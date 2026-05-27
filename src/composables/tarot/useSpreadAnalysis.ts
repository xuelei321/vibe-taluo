import type { DrawnCard } from '@/composables/tarot/useTarotSpread'

export type ElementType = 'fire' | 'water' | 'air' | 'earth' | 'spirit'

export type EnergyFlow = 'ascending' | 'descending' | 'balanced' | 'blocked'

const SUIT_ELEMENTS: Record<string, ElementType> = {
  wands: 'fire',
  cups: 'water',
  swords: 'air',
  pentacles: 'earth'
}

const NUMBER_ENERGIES: Record<number, { meaning: string; quality: 'yang' | 'yin' | 'neutral' }> = {
  0: { meaning: '无限可能', quality: 'neutral' },
  1: { meaning: '独立创造', quality: 'yang' },
  2: { meaning: '二元对立', quality: 'yin' },
  3: { meaning: '创造表达', quality: 'yang' },
  4: { meaning: '稳定根基', quality: 'yin' },
  5: { meaning: '变化自由', quality: 'yang' },
  6: { meaning: '和谐平衡', quality: 'yin' },
  7: { meaning: '内省灵性', quality: 'yin' },
  8: { meaning: '力量成就', quality: 'yang' },
  9: { meaning: '智慧完成', quality: 'yin' },
  10: { meaning: '循环完结', quality: 'neutral' },
  11: { meaning: '超觉启示', quality: 'yin' },
  12: { meaning: '整合考验', quality: 'yin' },
  13: { meaning: '蜕变转化', quality: 'yang' },
  14: { meaning: '平衡调和', quality: 'yin' },
  15: { meaning: '阴影诱惑', quality: 'yang' },
  16: { meaning: '剧变觉醒', quality: 'yang' },
  17: { meaning: '希望指引', quality: 'yang' },
  18: { meaning: '直觉幻象', quality: 'yin' },
  19: { meaning: '喜悦成功', quality: 'yang' },
  20: { meaning: '灵魂审判', quality: 'neutral' },
  21: { meaning: '宇宙圆满', quality: 'neutral' }
}

const ELEMENT_INTERACTIONS: Record<ElementType, { strengthens: ElementType[]; weakens: ElementType[] }> = {
  fire: { strengthens: ['air'], weakens: ['water'] },
  water: { strengthens: ['earth'], weakens: ['fire'] },
  air: { strengthens: ['water'], weakens: ['earth'] },
  earth: { strengthens: ['fire'], weakens: ['air'] },
  spirit: { strengthens: [], weakens: [] }
}

const CARD_RELATIONSHIPS: Record<string, string[]> = {
  '0-1': ['创造意志的起点与展现'],
  '0-21': ['无限可能与宇宙圆满的呼应'],
  '1-2': ['创造性能量与直觉智慧的对话'],
  '2-3': ['智慧内省与丰盛创造力的转化'],
  '3-4': ['滋养与秩序的平衡'],
  '4-5': ['权威与信仰的张力'],
  '5-6': ['传统教条与自由选择的冲突'],
  '6-7': ['爱与胜利的结合考验'],
  '7-8': ['意志征服与内在力量的对话'],
  '8-9': ['外在力量与内心智慧的反差'],
  '9-10': ['独处寻找与命运转折'],
  '10-11': ['命运转动与因果审判'],
  '11-12': ['公正法则与牺牲放下'],
  '12-13': ['被动等待与主动蜕变'],
  '13-14': ['死亡终结与节制调和'],
  '14-15': ['平衡修炼与恶魔诱惑'],
  '15-16': ['束缚解脱与塔的剧变'],
  '16-17': ['破坏重建与星光疗愈'],
  '17-18': ['希望灵感与月亮幻象'],
  '18-19': ['恐惧幻象与太阳喜悦'],
  '19-20': ['成功活力与灵魂审判'],
  '20-21': ['生命回顾与宇宙完成']
}

export interface SpreadAnalysis {
  cardRelations: CardRelation[]
  energyFlow: EnergyFlow
  elementDistribution: Record<ElementType, number>
  dominantElement: ElementType | null
  synchronicityScore: number
  narrativeArc: string
  advice: string
  warnings: string[]
}

export interface CardRelation {
  fromCard: DrawnCard
  toCard: DrawnCard
  relationship: string
  strength: number
  type: 'supporting' | 'challenging' | 'neutral'
}

function getCardElement(card: DrawnCard): ElementType {
  if (card.card.arcana === 'major') {
    return 'spirit'
  }
  const suit = card.card.suit
  return SUIT_ELEMENTS[suit || ''] || 'spirit'
}

function getNumberEnergy(card: DrawnCard): typeof NUMBER_ENERGIES[0] {
  const id = card.card.id
  if (id <= 21) {
    return NUMBER_ENERGIES[id]
  }
  const num = id % 10
  return NUMBER_ENERGIES[num === 0 ? 10 : num]
}

function calculateRelationStrength(card1: DrawnCard, card2: DrawnCard): number {
  let strength = 30
  
  const elem1 = getCardElement(card1)
  const elem2 = getCardElement(card2)
  if (ELEMENT_INTERACTIONS[elem1].strengthens.includes(elem2)) {
    strength += 25
  }
  if (ELEMENT_INTERACTIONS[elem1].weakens.includes(elem2)) {
    strength += 15
  }
  
  const num1 = getNumberEnergy(card1)
  const num2 = getNumberEnergy(card2)
  if (num1.quality === num2.quality) {
    strength += 15
  }
  
  if (card1.position === 'past' && card2.position === 'future') {
    strength += 20
  }
  
  if (card1.card.arcana === 'major' && card2.card.arcana === 'major') {
    strength += 10
  }
  
  return Math.min(100, strength)
}

function analyzeCardRelations(cards: DrawnCard[]): CardRelation[] {
  const relations: CardRelation[] = []
  
  for (let i = 0; i < cards.length - 1; i++) {
    const fromCard = cards[i]
    const toCard = cards[i + 1]
    
    const strength = calculateRelationStrength(fromCard, toCard)
    
    let type: CardRelation['type'] = 'neutral'
    let relationship = ''
    
    const key = `${fromCard.card.id}-${toCard.card.id}`
    const reverseKey = `${toCard.card.id}-${fromCard.card.id}`
    
    if (CARD_RELATIONSHIPS[key]) {
      relationship = CARD_RELATIONSHIPS[key][0]
    } else if (CARD_RELATIONSHIPS[reverseKey]) {
      relationship = CARD_RELATIONSHIPS[reverseKey][0]
    } else {
      const fromElem = getCardElement(fromCard)
      const toElem = getCardElement(toCard)
      relationship = `从${fromCard.card.name}的${fromElem}能量向${toCard.card.name}的${toElem}能量转化`
    }
    
    const fromNum = getNumberEnergy(fromCard)
    const toNum = getNumberEnergy(toCard)
    if (strength > 60) {
      type = fromNum.quality === toNum.quality ? 'supporting' : 'challenging'
    }
    
    relations.push({
      fromCard,
      toCard,
      relationship,
      strength,
      type
    })
  }
  
  return relations
}

function analyzeEnergyFlow(cards: DrawnCard[]): EnergyFlow {
  const elements = cards.map(getCardElement)
  const counts = elements.reduce((acc, elem) => {
    acc[elem] = (acc[elem] || 0) + 1
    return acc
  }, {} as Record<ElementType, number>)
  
  const uniqueElements = Object.keys(counts).length
  
  if (uniqueElements === 1) {
    return 'ascending'
  }
  
  if (uniqueElements === 3 && counts['spirit']) {
    return 'balanced'
  }
  
  if ((counts['fire'] && counts['water']) || (counts['air'] && counts['earth'])) {
    return 'blocked'
  }
  
  return 'descending'
}

function calculateSynchronicityScore(cards: DrawnCard[]): number {
  let score = 50
  
  const majorCount = cards.filter(c => c.card.arcana === 'major').length
  score += majorCount * 10
  
  const reversedCount = cards.filter(c => c.isReversed).length
  score -= reversedCount * 5
  
  const ids = cards.map(c => c.card.id).sort((a, b) => a - b)
  for (let i = 0; i < ids.length - 1; i++) {
    if (ids[i + 1] - ids[i] === 1) {
      score += 8
    } else if (ids[i + 1] - ids[i] <= 3) {
      score += 4
    }
  }
  
  const suits = cards.filter(c => c.card.suit).map(c => c.card.suit)
  if (suits.length === 3 && suits.every(s => s === suits[0])) {
    score += 15
  }
  
  const positions = cards.map(c => c.position)
  if (positions.includes('past') && positions.includes('present') && positions.includes('future')) {
    score += 10
  }
  
  return Math.max(0, Math.min(100, score))
}

function generateNarrativeArc(cards: DrawnCard[]): string {
  const arcs: string[] = []
  
  const firstCard = cards[0]
  if (firstCard.card.id <= 3) {
    arcs.push('故事从生命的起点或创造的原点展开')
  } else if (firstCard.card.id >= 13) {
    arcs.push('故事从终结或转化的节点开启')
  } else {
    arcs.push('故事从一个承上启下的阶段展开')
  }
  
  const middleCard = cards[1]
  if (middleCard.isReversed) {
    arcs.push('过程中遭遇内在的阻碍与挣扎')
  } else {
    arcs.push('核心能量引导着事态的发展方向')
  }
  
  const lastCard = cards[2]
  if (lastCard.card.id >= 17) {
    arcs.push('最终指向希望、光明与疗愈的方向')
  } else if (lastCard.card.id <= 5) {
    arcs.push('最终回到基本的生命主题')
  } else if (lastCard.isReversed) {
    arcs.push('结果的显现可能需要更长的时间')
  } else {
    arcs.push('事态将朝向明确的方向发展')
  }
  
  return arcs.join('，')
}

function generateAdvice(cards: DrawnCard[]): string {
  const elements = cards.map(getCardElement)
  const counts = elements.reduce((acc, elem) => {
    acc[elem] = (acc[elem] || 0) + 1
    return acc
  }, {} as Record<ElementType, number>)
  
  const dominantElement = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] as ElementType
  
  const adviceMap: Record<ElementType, string> = {
    fire: '需要更多的行动力和热情，勇敢迈出第一步',
    water: '适合进行情感层面的探索和内在的疗愈工作',
    air: '应当关注沟通和思想的清晰度，避免过度分析',
    earth: '建议专注于实际事务，稳扎稳打地推进计划',
    spirit: '适合进行灵性修行和自我觉察的练习'
  }
  
  const reversedCount = cards.filter(c => c.isReversed).length
  let advice = adviceMap[dominantElement] || '保持觉察，顺其自然'
  
  if (reversedCount >= 2) {
    advice = '当前存在较强的内在阻力，需要先处理未完成的情结'
  }
  
  return advice
}

function generateWarnings(cards: DrawnCard[]): string[] {
  const warnings: string[] = []
  
  const dangerCards = [15, 16, 18]
  cards.forEach(card => {
    if (dangerCards.includes(card.card.id)) {
      if (card.card.id === 15) {
        warnings.push(card.isReversed ? '注意物质或情感上的过度依赖' : '警惕诱惑和束缚的产生')
      }
      if (card.card.id === 16) {
        warnings.push('可能面临突如其来的变化或冲击')
      }
      if (card.card.id === 18) {
        warnings.push('谨防被幻象或恐惧所迷惑')
      }
    }
  })
  
  const flow = analyzeEnergyFlow(cards)
  if (flow === 'blocked') {
    warnings.push('注意化解内心的对立冲突')
  }
  
  const reversedCount = cards.filter(c => c.isReversed).length
  if (reversedCount >= 2) {
    warnings.push('需要时间让能量正常流动和显现')
  }
  
  return warnings
}

export function analyzeSpread(cards: DrawnCard[]): SpreadAnalysis {
  const cardRelations = analyzeCardRelations(cards)
  const energyFlow = analyzeEnergyFlow(cards)
  
  const elementDistribution = cards.reduce((acc, card) => {
    const elem = getCardElement(card)
    acc[elem] = (acc[elem] || 0) + 1
    return acc
  }, {} as Record<ElementType, number>)
  
  const dominantElement = Object.entries(elementDistribution)
    .sort((a, b) => b[1] - a[1])[0]?.[0] as ElementType | null
  
  const synchronicityScore = calculateSynchronicityScore(cards)
  const narrativeArc = generateNarrativeArc(cards)
  const advice = generateAdvice(cards)
  const warnings = generateWarnings(cards)
  
  return {
    cardRelations,
    energyFlow,
    elementDistribution,
    dominantElement,
    synchronicityScore,
    narrativeArc,
    advice,
    warnings
  }
}

export const ELEMENT_DESCRIPTIONS: Record<ElementType, { name: string; traits: string[]; color: string }> = {
  fire: {
    name: '火元素',
    traits: ['行动力', '激情', '创造力', '意志力'],
    color: '#ff8040'
  },
  water: {
    name: '水元素',
    traits: ['情感', '直觉', '疗愈', '包容'],
    color: '#4080ff'
  },
  air: {
    name: '风元素',
    traits: ['思想', '沟通', '智慧', '自由'],
    color: '#80c0e0'
  },
  earth: {
    name: '土元素',
    traits: ['物质', '稳定', '实际', '富足'],
    color: '#60c060'
  },
  spirit: {
    name: '精神',
    traits: ['灵性', '转化', '整合', '超脱'],
    color: '#c080e0'
  }
}
