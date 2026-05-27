import { computed, type Ref } from 'vue'

export interface DetectedEmotion {
  word: string
  type: 'negative' | 'positive' | 'neutral'
  color: string
}

export interface EmotionResult {
  dominantMood: 'negative' | 'positive' | 'neutral' | 'unknown'
  emotionIntensity: number
  moodLabel: string
  dominantColor: string
  detectedWords: string[]
}

const negationWords = ['不是', '没有', '并不', '不太', '不', '没', '并非', '绝不', '毫无', '不再', '从未', '一点也不']

const emotionDictionary = {
  negative: [
    '疲惫', '焦虑', '迷茫', '痛苦', '压抑', '愤怒', '失落', '孤独',
    '绝望', '崩溃', '烦躁', '委屈', '后悔', '恐惧', '厌倦', '沮丧',
    '无力', '挣扎', '撕裂', '窒息', '麻木', '茫然', '抑郁', '内耗',
    '悲伤', '难过', '失望', '忧虑', '不安', '苦恼', '烦闷',
    '伤心', '痛心', '哀愁', '凄惨', '悲凉', '阴郁', '沉重',
    '焦虑不安', '心烦意乱', '忧心忡忡', '愁眉不展', '心灰意冷', '黯然神伤'
  ],
  positive: [
    '平静', '满足', '喜悦', '感恩', '希望', '温暖', '自由', '轻盈',
    '清醒', '笃定', '从容', '振奋', '热爱', '释然', '充实', '幸福',
    '期待', '勇气', '治愈', '安定', '快乐', '愉快', '开心', '兴奋',
    '乐观', '自信', '愉悦', '欣慰', '舒畅', '安逸', '温馨', '甜蜜',
    '欢欣', '畅快', '心旷神怡', '心满意足', '怡然自得', '兴高采烈'
  ],
  neutral: [
    '思考', '寻找', '理解', '接受', '变化', '成长', '反思', '探索',
    '矛盾', '复杂', '纠结', '徘徊', '等待', '观察', '适应', '审视',
    '分析', '权衡', '考量', '抉择', '犹豫', '评估', '判断',
    '认知', '觉察', '体会', '感悟', '洞察', '领悟', '沉思', '冥想',
    '内省', '思索', '琢磨', '推敲', '斟酌'
  ]
}

const emotionColors = {
  negative: '#f472b6',
  positive: '#8ab4f8',
  neutral: '#a3e635',
}

function hasNegationBefore(text: string, wordIndex: number): boolean {
  const contextStart = Math.max(0, wordIndex - 6)
  const context = text.slice(contextStart, wordIndex)
  return negationWords.some(neg => context.includes(neg))
}

export function analyzeEmotions(text: string): EmotionResult {
  const inputText = text.toLowerCase()
  const detectedWords: { word: string; type: 'negative' | 'positive' | 'neutral' }[] = []

  if (!inputText.trim()) {
    return {
      dominantMood: 'unknown',
      emotionIntensity: 0,
      moodLabel: '未知',
      dominantColor: '#6b7280',
      detectedWords: []
    }
  }

  const seen = new Set<string>()

  for (const [type, words] of Object.entries(emotionDictionary) as Array<[string, string[]]>) {
    for (const word of words) {
      const idx = inputText.indexOf(word.toLowerCase())
      if (idx !== -1 && !hasNegationBefore(inputText, idx)) {
        if (seen.has(word)) continue
        seen.add(word)
        detectedWords.push({ word, type: type as 'negative' | 'positive' | 'neutral' })
      }
    }
  }

  const counts = { negative: 0, positive: 0, neutral: 0 }
  detectedWords.forEach(e => counts[e.type]++)

  let dominantMood: 'negative' | 'positive' | 'neutral' | 'unknown' = 'unknown'
  const maxCount = Math.max(counts.negative, counts.positive, counts.neutral)
  if (maxCount > 0) {
    if (counts.negative === maxCount) dominantMood = 'negative'
    else if (counts.positive === maxCount) dominantMood = 'positive'
    else dominantMood = 'neutral'
  }

  let weightedScore = 0
  detectedWords.forEach(e => {
    if (e.type === 'negative') weightedScore += 2
    else if (e.type === 'positive') weightedScore += 1.5
    else weightedScore += 1
  })

  const textLength = text.length
  const frequencyFactor = Math.min(weightedScore / textLength * 100, 50)
  const countFactor = Math.min(detectedWords.length * 10, 50)
  const intensity = Math.min(100, Math.max(0, Math.round(frequencyFactor + countFactor)))

  const labels: Record<string, string> = {
    negative: '阴霾', positive: '阳光', neutral: '平静', unknown: '未知'
  }

  return {
    dominantMood,
    emotionIntensity: intensity,
    moodLabel: labels[dominantMood],
    dominantColor: dominantMood === 'unknown' ? '#6b7280' : emotionColors[dominantMood],
    detectedWords: detectedWords.map(e => e.word)
  }
}

export function useEmotionDetector(text: Ref<string>) {
  const result = computed(() => analyzeEmotions(text.value))

  const detectedEmotions = computed<DetectedEmotion[]>(() => {
    return result.value.detectedWords.map(word => {
      const type = result.value.dominantMood === 'unknown' ? 'neutral' as const : result.value.dominantMood
      return {
        word,
        type,
        color: emotionColors[type]
      }
    })
  })

  const dominantMood = computed(() => result.value.dominantMood)
  const emotionIntensity = computed(() => result.value.emotionIntensity)
  const moodLabel = computed(() => result.value.moodLabel)
  const dominantColor = computed(() => result.value.dominantColor)

  return {
    detectedEmotions,
    dominantMood,
    emotionIntensity,
    moodLabel,
    dominantColor,
  }
}
