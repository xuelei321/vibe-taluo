import { computed, watch } from 'vue'
import { useStorage } from '@vueuse/core'

export type ModelProvider = 'openai' | 'deepseek' | 'custom'

export interface ModelConfig {
  id: string
  name: string
  provider: ModelProvider
  model: string
  apiKey: string
  apiUrl: string
  temperature: number
  maxTokens: number
  topP: number
  isDefault: boolean
}

export interface AppSettings {
  models: ModelConfig[]
  activeModelId: string | null
  theme: 'dark' | 'auto'
  enableAnimations: boolean
  autoSave: boolean
}

function getEnvApiKey(): string {
  return import.meta.env.VITE_OPENAI_API_KEY || ''
}

function getEnvApiUrl(): string {
  return import.meta.env.VITE_OPENAI_BASE_URL || ''
}

function getEnvModel(): string {
  return import.meta.env.VITE_OPENAI_MODEL || ''
}

function detectProviderFromEnv(): { provider: ModelProvider; defaultModel: string; defaultApiUrl: string } {
  const envUrl = getEnvApiUrl()
  if (envUrl.includes('deepseek')) {
    return { provider: 'deepseek', defaultModel: getEnvModel() || 'deepseek-chat', defaultApiUrl: envUrl }
  }
  if (envUrl.includes('siliconflow')) {
    return { provider: 'custom', defaultModel: getEnvModel() || 'deepseek-chat', defaultApiUrl: envUrl }
  }
  if (envUrl.includes('openai')) {
    return { provider: 'openai', defaultModel: getEnvModel() || 'gpt-4o', defaultApiUrl: envUrl }
  }
  return { provider: 'custom', defaultModel: getEnvModel() || 'gpt-4o', defaultApiUrl: envUrl || 'https://api.openai.com/v1' }
}

const envConfig = detectProviderFromEnv()
const hasEnvConfig = !!(getEnvApiKey() && getEnvApiUrl())

function buildDefaultModels(): ModelConfig[] {
  const models: ModelConfig[] = []

  if (hasEnvConfig) {
    models.push({
      id: 'env-default',
      name: envConfig.defaultModel,
      provider: envConfig.provider,
      model: envConfig.defaultModel,
      apiKey: getEnvApiKey(),
      apiUrl: envConfig.defaultApiUrl,
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
      isDefault: true
    })
  } else {
    models.push({
      id: 'deepseek-default',
      name: 'DeepSeek Chat',
      provider: 'deepseek',
      model: 'deepseek-chat',
      apiKey: '',
      apiUrl: 'https://api.deepseek.com/v1',
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
      isDefault: true
    })
  }

  models.push({
    id: 'openai-default',
    name: 'GPT-4o',
    provider: 'openai',
    model: 'gpt-4o',
    apiKey: '',
    apiUrl: 'https://api.openai.com/v1',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    isDefault: false
  })

  return models
}

const DEFAULT_MODELS = buildDefaultModels()

const DEFAULT_SETTINGS: AppSettings = {
  models: DEFAULT_MODELS,
  activeModelId: DEFAULT_MODELS[0]?.id || null,
  theme: 'dark',
  enableAnimations: true,
  autoSave: true
}

function generateId(): string {
  return `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function validateModelConfig(config: Partial<ModelConfig>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config.name?.trim()) {
    errors.push('模型名称不能为空')
  }

  if (!config.model?.trim()) {
    errors.push('模型标识不能为空')
  }

  if (!config.provider) {
    errors.push('请选择模型提供商')
  }

  if (!config.apiUrl?.trim()) {
    errors.push('API 地址不能为空')
  } else {
    try {
      new URL(config.apiUrl)
    } catch {
      errors.push('API 地址格式不正确')
    }
  }

  if (config.temperature !== undefined) {
    if (config.temperature < 0 || config.temperature > 2) {
      errors.push('Temperature 必须在 0-2 之间')
    }
  }

  if (config.maxTokens !== undefined) {
    if (config.maxTokens < 1 || config.maxTokens > 8192) {
      errors.push('Max Tokens 必须在 1-8192 之间')
    }
  }

  if (config.topP !== undefined) {
    if (config.topP < 0 || config.topP > 1) {
      errors.push('Top P 必须在 0-1 之间')
    }
  }

  return { valid: errors.length === 0, errors }
}

export function createModelConfig(overrides: Partial<ModelConfig> = {}): ModelConfig {
  return {
    id: generateId(),
    name: '新模型',
    provider: 'deepseek',
    model: '',
    apiKey: '',
    apiUrl: 'https://api.deepseek.com/v1',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    isDefault: false,
    ...overrides
  }
}

export function useSettings() {
  const settings = useStorage<AppSettings>('vibe-taluo-settings', DEFAULT_SETTINGS, localStorage, {
    mergeDefaults: true
  })

  const activeModel = computed<ModelConfig | null>(() => {
    if (!settings.value.activeModelId) return null
    return settings.value.models.find(m => m.id === settings.value.activeModelId) || null
  })

  const models = computed(() => settings.value.models)

  function addModel(config: Partial<ModelConfig> = {}): ModelConfig {
    const newModel = createModelConfig(config)
    settings.value.models.push(newModel)
    return newModel
  }

  function updateModel(id: string, updates: Partial<ModelConfig>): boolean {
    const index = settings.value.models.findIndex(m => m.id === id)
    if (index === -1) return false

    settings.value.models[index] = {
      ...settings.value.models[index],
      ...updates
    }
    return true
  }

  function deleteModel(id: string): boolean {
    const index = settings.value.models.findIndex(m => m.id === id)
    if (index === -1) return false

    const wasDefault = settings.value.models[index].isDefault

    settings.value.models.splice(index, 1)

    if (settings.value.activeModelId === id) {
      settings.value.activeModelId = settings.value.models[0]?.id || null
    }

    if (wasDefault && settings.value.models.length > 0) {
      settings.value.models[0].isDefault = true
    }

    return true
  }

  function setActiveModel(id: string): boolean {
    const model = settings.value.models.find(m => m.id === id)
    if (!model) return false
    settings.value.activeModelId = id
    return true
  }

  function setDefaultModel(id: string): boolean {
    const model = settings.value.models.find(m => m.id === id)
    if (!model) return false

    settings.value.models.forEach(m => {
      m.isDefault = m.id === id
    })

    return true
  }

  function resetToDefaults(): void {
    settings.value = { ...DEFAULT_SETTINGS }
  }

  function exportSettings(): string {
    return JSON.stringify(settings.value, null, 2)
  }

  function importSettings(json: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(json)
      if (!parsed.models || !Array.isArray(parsed.models)) {
        return { success: false, error: '配置格式不正确：缺少模型列表' }
      }
      settings.value = parsed
      return { success: true }
    } catch (e) {
      return { success: false, error: 'JSON 解析失败' }
    }
  }

  watch(
    () => activeModel.value,
    (model) => {
      if (model) {
        if (typeof window !== 'undefined') {
          (window as any).__VITE_TALUO_CONFIG__ = {
            apiKey: model.apiKey,
            apiUrl: model.apiUrl,
            model: model.model,
            temperature: model.temperature,
            maxTokens: model.maxTokens,
            topP: model.topP
          }
        }
      }
    },
    { immediate: true, deep: true }
  )

  return {
    settings,
    models,
    activeModel,
    addModel,
    updateModel,
    deleteModel,
    setActiveModel,
    setDefaultModel,
    resetToDefaults,
    exportSettings,
    importSettings
  }
}
