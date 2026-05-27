import { computed } from 'vue'
import type { ReadingRecord } from '@/composables/data/useReadingHistory'

export type EmotionState = 
  | 'tranquil'
  | 'joyful'
  | 'confused'
  | 'anticipating'
  | 'relieved'
  | 'contemplative'
  | 'anxious'
  | 'sorrowful'

const TRANSITION_PROBABILITIES: Record<EmotionState, Partial<Record<EmotionState, number>>> = {
  tranquil: { joyful: 0.25, contemplative: 0.25, relieved: 0.2, anxious: 0.1, confused: 0.1, anticipating: 0.1 },
  joyful: { tranquil: 0.2, relieved: 0.2, anticipating: 0.25, contemplative: 0.15, anxious: 0.1, sorrowful: 0.1 },
  confused: { contemplative: 0.3, anxious: 0.25, tranquil: 0.2, relieved: 0.15, anticipating: 0.1 },
  anticipating: { joyful: 0.3, anxious: 0.25, contemplative: 0.2, relieved: 0.15, tranquil: 0.1 },
  relieved: { tranquil: 0.35, joyful: 0.2, contemplative: 0.2, anticipating: 0.15, anxious: 0.1 },
  contemplative: { tranquil: 0.25, relieved: 0.25, anxious: 0.2, confused: 0.15, sorrowful: 0.15 },
  anxious: { contemplative: 0.3, confused: 0.25, sorrowful: 0.2, tranquil: 0.15, relieved: 0.1 },
  sorrowful: { contemplative: 0.3, relieved: 0.25, tranquil: 0.2, anxious: 0.15, confused: 0.1 }
}

const EMOTION_POLARITY: Record<EmotionState, number> = {
  tranquil: 0.6,
  joyful: 1.0,
  anticipating: 0.7,
  relieved: 0.5,
  contemplative: 0.3,
  confused: 0.0,
  anxious: -0.3,
  sorrowful: -0.6
}

const MOOD_TO_STATE: Record<string, EmotionState> = {
  '平静': 'tranquil',
  '欣喜': 'joyful',
  '困惑': 'confused',
  '期待': 'anticipating',
  '释然': 'relieved',
  '沉思': 'contemplative',
  '焦虑': 'anxious',
  '悲伤': 'sorrowful'
}

export interface Prediction {
  nextEmotion: EmotionState
  confidence: number
  trend: 'improving' | 'stable' | 'declining'
  insight: string
  recommendedFocus: string
}

export interface PatternAnalysis {
  dominantPattern: EmotionState[]
  averageIntensity: number
  polarityTrend: number[]
  cycleLength: number | null
  transformationPoints: number[]
  patternStrength: number
}

export interface TemporalPattern {
  dayOfWeek: number
  hourOfDay: number
  frequency: number
  averageIntensity: number
}

const STATE_TO_CHINESE: Record<EmotionState, string> = {
  tranquil: '平静',
  joyful: '欣喜',
  confused: '困惑',
  anticipating: '期待',
  relieved: '释然',
  contemplative: '沉思',
  anxious: '焦虑',
  sorrowful: '悲伤'
}

function predictNextState(currentState: EmotionState): { state: EmotionState; confidence: number } {
  const transitions = TRANSITION_PROBABILITIES[currentState]
  
  if (!transitions || Object.keys(transitions).length === 0) {
    const states = Object.keys(MOOD_TO_STATE) as EmotionState[]
    const randomState = states[Math.floor(Math.random() * states.length)]
    return { state: randomState, confidence: 0.3 }
  }
  
  const total = Object.values(transitions).reduce((sum, p) => sum + p, 0)
  let random = Math.random() * total
  
  for (const [nextState, prob] of Object.entries(transitions)) {
    random -= prob
    if (random <= 0) {
      return {
        state: nextState as EmotionState,
        confidence: prob / total
      }
    }
  }
  
  const mostLikely = Object.entries(transitions)
    .sort((a, b) => b[1] - a[1])[0]
  
  return {
    state: mostLikely[0] as EmotionState,
    confidence: mostLikely[1] / total
  }
}

function calculateTrend(polarities: number[]): 'improving' | 'stable' | 'declining' {
  if (polarities.length < 2) return 'stable'
  
  const recentPolarities = polarities.slice(-3)
  const first = recentPolarities[0]
  const last = recentPolarities[recentPolarities.length - 1]
  const delta = last - first
  
  if (delta > 0.2) return 'improving'
  if (delta < -0.2) return 'declining'
  return 'stable'
}

function generateInsight(
  currentState: EmotionState,
  _predictedState: EmotionState,
  trend: 'improving' | 'stable' | 'declining'
): string {
  const insights: Record<string, string[]> = {
    tranquil: [
      '你正处于内心的平静期，适合进行深度的自我反思',
      '保持这种平衡的状态，让内在智慧自然浮现',
      '平静是行动前的准备，洞察往往在此刻产生'
    ],
    joyful: [
      '喜悦的能量正在流动，这是一个创造和连接的好时机',
      '享受这份积极能量，但也要留意是否在逃避某些问题',
      '喜悦是内在小孩的礼物，让它引导你发现生命的乐趣'
    ],
    confused: [
      '困惑意味着潜意识正在整合大量信息，这是觉醒的前奏',
      '不要急于寻找答案，让问题在潜意识中沉淀',
      '混乱常常是秩序重组的必经阶段'
    ],
    anticipating: [
      '期待带来希望，但也可能伴随焦虑',
      '将注意力集中在当下，未来的种子正在此刻播种',
      '期待是一种能量转化，等待和行动同样重要'
    ],
    relieved: [
      '释然表明一个循环正在结束，这是放下旧包袱的时刻',
      '感谢这段经历带来的成长，向新的可能性敞开',
      '释放旧的，才能迎接新的'
    ],
    contemplative: [
      '沉思是连接潜意识的桥梁，答案可能在意想不到的时刻出现',
      '给自己足够的独处时间，让内在的声音被听见',
      '有时候思考比行动更重要'
    ],
    anxious: [
      '焦虑指向内心未满足的需求或未面对的议题',
      '将模糊的恐惧具体化，转化为可行动的计划',
      '深呼吸，允许自己感受焦虑而不被它控制'
    ],
    sorrowful: [
      '悲伤是生命完整性的体现，允许自己全然地感受',
      '这份痛楚中藏着珍贵的教训和治愈的可能',
      '悲伤不是终点，它正在为新的情感空间清理道路'
    ]
  }
  
  const trendInsight: Record<string, string> = {
    improving: '你的情绪能量正在上升，保持觉察并顺势而为',
    stable: '当前状态较为稳定，适合进行内在的整合工作',
    declining: '注意情绪波动，必要时寻求支持或休息'
  }
  
  const baseInsight = insights[currentState]?.[Math.floor(Math.random() * insights[currentState].length)] || ''
  return `${baseInsight} ${trendInsight[trend]}`
}

function getRecommendedFocus(prediction: EmotionState): string {
  const focuses: Record<EmotionState, string> = {
    tranquil: '内在整合与智慧沉淀',
    joyful: '创造表达与人际连接',
    confused: '信息整理与问题厘清',
    anticipating: '目标明确与行动规划',
    relieved: '放下与接纳新可能',
    contemplative: '独处反思与自我对话',
    anxious: '恐惧具象化与呼吸练习',
    sorrowful: '情感释放与自我慈悲'
  }
  return focuses[prediction]
}

function detectCycle(polarities: number[], minCycleLength = 3): number | null {
  if (polarities.length < minCycleLength * 2) return null
  
  for (let cycleLen = minCycleLength; cycleLen <= polarities.length / 2; cycleLen++) {
    let matches = 0
    for (let i = 0; i < polarities.length - cycleLen * 2; i++) {
      const diff1 = Math.abs(polarities[i] - polarities[i + cycleLen])
      const diff2 = Math.abs(polarities[i + cycleLen] - polarities[i + cycleLen * 2])
      if (diff1 < 0.3 && diff2 < 0.3) {
        matches++
      }
    }
    if (matches >= 2) {
      return cycleLen
    }
  }
  return null
}

function analyzePatterns(records: ReadingRecord[]): PatternAnalysis {
  if (records.length === 0) {
    return {
      dominantPattern: [],
      averageIntensity: 0,
      polarityTrend: [],
      cycleLength: null,
      transformationPoints: [],
      patternStrength: 0
    }
  }
  
  const sortedRecords = [...records].sort((a, b) => a.timestamp - b.timestamp)
  
  const emotionSequence = sortedRecords.map(r => 
    MOOD_TO_STATE[r.dominantMood] || 'contemplative'
  )
  
  const polarityTrend = sortedRecords.map(r => 
    EMOTION_POLARITY[MOOD_TO_STATE[r.dominantMood] || 'contemplative'] || 0
  )
  
  const averageIntensity = sortedRecords.reduce((sum, r) => sum + r.emotionIntensity, 0) / sortedRecords.length
  
  const dominantPattern: EmotionState[] = []
  let currentMood: EmotionState | null = null
  let count = 0
  
  for (const mood of emotionSequence) {
    if (mood === currentMood) {
      count++
    } else {
      if (count >= 2) {
        dominantPattern.push(currentMood!)
      }
      currentMood = mood
      count = 1
    }
  }
  if (count >= 2) {
    dominantPattern.push(currentMood!)
  }
  
  const transformationPoints: number[] = []
  for (let i = 1; i < emotionSequence.length; i++) {
    const prev = EMOTION_POLARITY[emotionSequence[i - 1]] || 0
    const curr = EMOTION_POLARITY[emotionSequence[i]] || 0
    if (Math.abs(curr - prev) > 0.5) {
      transformationPoints.push(i)
    }
  }
  
  const cycleLength = detectCycle(polarityTrend)
  
  const patternStrength = Math.min(100, (dominantPattern.length / emotionSequence.length) * 100)
  
  return {
    dominantPattern,
    averageIntensity,
    polarityTrend,
    cycleLength,
    transformationPoints,
    patternStrength
  }
}

function analyzeTemporalPatterns(records: ReadingRecord[]): TemporalPattern[] {
  const patterns: Record<string, TemporalPattern> = {}
  
  for (const record of records) {
    const date = new Date(record.timestamp)
    const dayOfWeek = date.getDay()
    const hourOfDay = date.getHours()
    const key = `${dayOfWeek}-${hourOfDay}`
    
    if (!patterns[key]) {
      patterns[key] = {
        dayOfWeek,
        hourOfDay,
        frequency: 0,
        averageIntensity: 0
      }
    }
    
    patterns[key].frequency++
    patterns[key].averageIntensity = 
      (patterns[key].averageIntensity * (patterns[key].frequency - 1) + record.emotionIntensity) 
      / patterns[key].frequency
  }
  
  return Object.values(patterns).sort((a, b) => b.frequency - a.frequency)
}

export function useEmotionPatternEngine(records: () => ReadingRecord[]) {
  const patternAnalysis = computed(() => analyzePatterns(records()))
  const temporalPatterns = computed(() => analyzeTemporalPatterns(records()))
  
  function predict(): Prediction {
    const history = records()
    
    if (history.length === 0) {
      return {
        nextEmotion: 'contemplative',
        confidence: 0.3,
        trend: 'stable',
        insight: '还没有足够的数据进行预测，建议先进行几次占卜',
        recommendedFocus: '自我觉察与日记记录'
      }
    }
    
    const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp)
    const latestMood = sortedHistory[0].dominantMood
    const currentState = MOOD_TO_STATE[latestMood] || 'contemplative'
    
    const { state, confidence } = predictNextState(currentState)
    
    const polarities = patternAnalysis.value.polarityTrend
    const trend = calculateTrend(polarities)
    
    const insight = generateInsight(currentState, state, trend)
    
    const recommendedFocus = getRecommendedFocus(state)
    
    return {
      nextEmotion: state,
      confidence: Math.round(confidence * 100),
      trend,
      insight,
      recommendedFocus
    }
  }
  
  function getStateDescription(state: EmotionState): string {
    return STATE_TO_CHINESE[state] || state
  }
  
  function getPolarity(state: EmotionState): number {
    return EMOTION_POLARITY[state]
  }
  
  return {
    predict,
    patternAnalysis,
    temporalPatterns,
    getStateDescription,
    getPolarity,
    STATE_TO_CHINESE
  }
}
