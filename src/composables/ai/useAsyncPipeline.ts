export enum TaskPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3
}

export enum TaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface AsyncTask<T = unknown> {
  id: string
  priority: TaskPriority
  status: TaskStatus
  execute: () => Promise<T>
  onComplete?: (result: T) => void
  onError?: (error: Error) => void
  onProgress?: (progress: number) => void
  retries: number
  maxRetries: number
  createdAt: number
  startedAt?: number
  completedAt?: number
  result?: T
  error?: Error
}

interface InternalTask {
  id: string
  priority: TaskPriority
  status: TaskStatus
  execute: () => Promise<unknown>
  onComplete?: (result: unknown) => void
  onError?: (error: Error) => void
  onProgress?: (progress: number) => void
  retries: number
  maxRetries: number
  createdAt: number
  startedAt?: number
  completedAt?: number
  result?: unknown
  error?: Error
}

export interface PipelineConfig {
  maxConcurrent: number
  maxRetries: number
  retryDelay: number
  timeout: number
}

export type PipelineEventType = 
  | 'task_added'
  | 'task_started'
  | 'task_completed'
  | 'task_failed'
  | 'task_cancelled'
  | 'queue_empty'
  | 'queue_full'

export interface PipelineEvent {
  type: PipelineEventType
  task?: AsyncTask
  timestamp: number
  details?: Record<string, unknown>
}

type EventListener = (event: PipelineEvent) => void

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export class AsyncPipeline {
  private queue: InternalTask[] = []
  private runningTasks: Set<InternalTask> = new Set()
  private eventListeners: Map<PipelineEventType, Set<EventListener>> = new Map()
  private isProcessing = false
  private config: PipelineConfig
  
  constructor(config: Partial<PipelineConfig> = {}) {
    this.config = {
      maxConcurrent: config.maxConcurrent ?? 3,
      maxRetries: config.maxRetries ?? 3,
      retryDelay: config.retryDelay ?? 1000,
      timeout: config.timeout ?? 30000
    }
  }
  
  addTask<T>(
    execute: () => Promise<T>,
    options: {
      priority?: TaskPriority
      maxRetries?: number
      onComplete?: (result: T) => void
      onError?: (error: Error) => void
      onProgress?: (progress: number) => void
    } = {}
  ): string {
    const task: InternalTask = {
      id: generateId(),
      priority: options.priority ?? TaskPriority.NORMAL,
      status: TaskStatus.PENDING,
      execute: async () => execute() as unknown,
      onComplete: options.onComplete as ((result: unknown) => void) | undefined,
      onError: options.onError as ((error: Error) => void) | undefined,
      onProgress: options.onProgress as ((progress: number) => void) | undefined,
      retries: 0,
      maxRetries: options.maxRetries ?? this.config.maxRetries,
      createdAt: Date.now()
    }
    
    const insertIndex = this.queue.findIndex(t => t.priority < task.priority)
    if (insertIndex === -1) {
      this.queue.push(task)
    } else {
      this.queue.splice(insertIndex, 0, task)
    }
    
    this.emit('task_added', task)
    this.process()
    
    return task.id
  }
  
  cancelTask(taskId: string): boolean {
    const index = this.queue.findIndex(t => t.id === taskId)
    if (index !== -1) {
      const task = this.queue.splice(index, 1)[0]
      task.status = TaskStatus.CANCELLED
      this.emit('task_cancelled', task)
      return true
    }
    
    for (const task of this.runningTasks) {
      if (task.id === taskId) {
        task.status = TaskStatus.CANCELLED
        return true
      }
    }
    
    return false
  }
  
  getTaskStatus(taskId: string): TaskStatus | null {
    const queueTask = this.queue.find(t => t.id === taskId)
    if (queueTask) return queueTask.status
    
    for (const task of this.runningTasks) {
      if (task.id === taskId) return task.status
    }
    
    return null
  }
  
  getQueueStatus(): {
    pending: number
    running: number
    completed: number
    failed: number
  } {
    return {
      pending: this.queue.length,
      running: this.runningTasks.size,
      completed: 0,
      failed: 0
    }
  }
  
  clearQueue(): void {
    this.queue.forEach(task => {
      task.status = TaskStatus.CANCELLED
      this.emit('task_cancelled', task)
    })
    this.queue = []
  }
  
  async waitForCompletion(): Promise<void> {
    while (this.queue.length > 0 || this.runningTasks.size > 0) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  on(eventType: PipelineEventType, listener: EventListener): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set())
    }
    this.eventListeners.get(eventType)!.add(listener)
    
    return () => {
      this.eventListeners.get(eventType)?.delete(listener)
    }
  }
  
  private emit(type: PipelineEventType, task?: InternalTask, details?: Record<string, unknown>): void {
    const event: PipelineEvent = {
      type,
      task,
      timestamp: Date.now(),
      details
    }
    
    this.eventListeners.get(type)?.forEach(listener => {
      try {
        listener(event)
      } catch (error) {
        console.error('Event listener error:', error)
      }
    })
    
    this.eventListeners.get('*' as PipelineEventType)?.forEach(listener => {
      try {
        listener(event)
      } catch (error) {
        console.error('Event listener error:', error)
      }
    })
  }
  
  private async process(): Promise<void> {
    if (this.isProcessing) return
    this.isProcessing = true
    
    while (this.queue.length > 0) {
      if (this.runningTasks.size >= this.config.maxConcurrent) {
        await new Promise(resolve => setTimeout(resolve, 100))
        continue
      }
      
      const task = this.queue.shift()
      if (!task) break
      
      if (task.status === TaskStatus.CANCELLED) continue
      
      this.runningTasks.add(task)
      task.status = TaskStatus.RUNNING
      task.startedAt = Date.now()
      this.emit('task_started', task)
      
      this.executeTask(task)
    }
    
    if (this.queue.length === 0 && this.runningTasks.size === 0) {
      this.emit('queue_empty')
    }
    
    this.isProcessing = false
  }
  
  private async executeTask(task: InternalTask): Promise<void> {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Task timed out after ${this.config.timeout}ms`))
        }, this.config.timeout)
      })
      
      const result = await Promise.race([
        task.execute(),
        timeoutPromise
      ])
      
      task.result = result
      task.status = TaskStatus.COMPLETED
      task.completedAt = Date.now()
      
      if (task.onComplete) {
        task.onComplete(result as Parameters<typeof task.onComplete>[0])
      }
      
      this.emit('task_completed', task, { result })
    } catch (error) {
      task.error = error as Error
      task.retries++
      
      if (task.retries < task.maxRetries) {
        task.status = TaskStatus.PENDING
        
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * task.retries))
        
        this.queue.unshift(task)
        this.process()
      } else {
        task.status = TaskStatus.FAILED
        task.completedAt = Date.now()
        
        if (task.onError) {
          task.onError(error as Error)
        }
        
        this.emit('task_failed', task, { error })
      }
    } finally {
      this.runningTasks.delete(task)
      this.process()
    }
  }
}

export function createOraclePipeline(): AsyncPipeline {
  return new AsyncPipeline({
    maxConcurrent: 2,
    maxRetries: 2,
    retryDelay: 500,
    timeout: 60000
  })
}

let globalOraclePipeline: AsyncPipeline | null = null

export function getOraclePipeline(): AsyncPipeline {
  if (!globalOraclePipeline) {
    globalOraclePipeline = createOraclePipeline()
  }
  return globalOraclePipeline
}
