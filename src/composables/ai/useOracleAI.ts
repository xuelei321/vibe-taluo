import { ref } from 'vue'
import type { DrawnCard } from '@/composables/tarot/useTarotSpread'

export interface OracleRequest {
  diaryText: string
  drawnCards: DrawnCard[]
}

export interface ChatMessage {
  id: string
  role: 'system' | 'user' | 'assistant'
  type: 'text' | 'card-draw' | 'card-reading' | 'summary'
  text: string
  isComplete: boolean
  isGenerating: boolean
  cardId?: number
  cardName?: string
  cardIcon?: string
  positionLabel?: string
  isReversed?: boolean
  drawnCards?: DrawnCard[]
  revealedCards?: boolean[]
}

export interface DialogMessage {
  id: string
  cardId?: number
  cardName?: string
  cardIcon?: string
  positionLabel?: string
  isReversed?: boolean
  text: string
  isComplete: boolean
  isGenerating: boolean
  type: 'card' | 'summary'
}

function getCurrentModelConfig() {
  const runtimeConfig = (typeof window !== 'undefined' && (window as any).__VITE_TALUO_CONFIG__) || {}
  const hasValidRuntimeKey = !!(
    runtimeConfig.apiKey &&
    runtimeConfig.apiKey !== 'undefined' &&
    runtimeConfig.apiKey !== 'your-api-key-here'
  )

  if (hasValidRuntimeKey) {
    return {
      apiKey: runtimeConfig.apiKey,
      apiUrl: runtimeConfig.apiUrl || import.meta.env.VITE_OPENAI_BASE_URL || '',
      model: runtimeConfig.model || import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o',
      temperature: runtimeConfig.temperature ?? 0.85,
      maxTokens: runtimeConfig.maxTokens ?? 400,
      topP: runtimeConfig.topP ?? 0.9
    }
  }

  return {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    apiUrl: import.meta.env.VITE_OPENAI_BASE_URL || '',
    model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o',
    temperature: runtimeConfig.temperature ?? 0.85,
    maxTokens: runtimeConfig.maxTokens ?? 400,
    topP: runtimeConfig.topP ?? 0.9
  }
}

interface MockContext {
  cardName: string
  positionLabel: string
  isReversed: boolean
  cardId: number
}

function generateMockResponse(ctx: MockContext): string {
  const { cardName, positionLabel, isReversed } = ctx

  const positionIntros: Record<string, string> = {
    '过去 · 根源': '回望你走过的路，' + cardName + '的能量曾在你生命中留下痕迹。',
    '当下 · 核心': '站在此刻的中心，' + cardName + '正凝视着你的灵魂。',
    '将来 · 潜力': '前方的迷雾中，' + cardName + '为你点亮了一盏微光。'
  }

  const reversedNote = isReversed
    ? '逆位让它原本的光芒收敛了几分，但那些藏在暗处的讯息，或许才是你真正需要听见的。'
    : '它在正位中向你敞开，带着全部的勇气与坦诚——这份能量已经准备好被你接住。'

  const bodySegments = [
    [
      '你以为自己只是普通的不安，但' + cardName + '告诉我，那不是不安——那是一头困在理智铁笼里的野兽，正在你的胸腔里无声地撕咬。你越是用"应该"和"必须"来驯服它，它的反扑就越猛烈。',
      '你的灵魂像一个被过度充气的气球，表面光滑完美，内里却承受着无处释放的压力。' + cardName + '在此刻出现，是为了提醒你：松动一点，你才有空间感受真实。',
      cardName + '的能量像一面古老的铜镜，映出的不是你的面容，而是你长年累月不愿正视的那部分自我。它并不狰狞，只是渴望被你看见。',
      '你习惯用一种理性的光去驱逐内心的阴影，但' + cardName + '揭示的正是那些在光照不到的地方悄然生长的真相。试着邀请它坐下来喝杯茶，它想说的，可能正是你需要听见的。',
      '水流象征着你的情绪海洋，而你正站在岸边犹豫不决。' + cardName + '的出现就像一只无形的手，轻轻推你向前——不是让你溺入其中，而是让你相信水的浮力。'
    ],
    [
      '有时你需要的不是一个答案，而是一个比答案更安静的空间。' + cardName + '带来的就是这样一个空间——在这里，你不需要证明什么，只需要感受那些被日常喧嚣淹没的细微信号。',
      cardName + '的能量是关于转化的。毛毛虫在茧中经历的不是沉睡，而是痛苦的重组。你现在感受到的混乱，正是蜕变前的必要阵痛。不要急于挣脱。',
      '有些真相穿着黑暗的外衣来访，不是要吓你，而是因为只有在黑暗中你才愿意停止假装。' + cardName + '此刻就在扮演这个角色——它用阴影的方式给你送来光亮。',
      '你已经走了很长的路才来到' + positionLabel + '这个位置。' + cardName + '像一位沉默的见证者，它看到的不是你表面的成败，而是那些连你自己都未曾注意的微小勇气。',
      cardName + '在提醒你：力量的本质不是压倒一切，而是在面对困境时，你仍然选择张开手而不是握紧拳。你的柔软比你的强势更具力量。'
    ],
    [
      '如果把你的内在世界看作一个生态系统，' + cardName + '就是那片需要被复原的湿地。不用急着抽干它或者美化它——让它自然呼吸，它自己会找到平衡。',
      cardName + '带来的启示不是关于"怎么做"，而是关于"怎么看"。当你调整观察的角度，那些看似无法逾越的高墙，也许会变成只需绕行几步就能越过的矮篱。',
      '荣格说过，被称为命运的东西，往往只是我们拒绝审视的内在模式。' + cardName + '邀请你把目光从外部世界收回来，投向那些一直在自动运转的旧程序。觉察本身，就是改变的起点。',
      cardName + '对你说：不要害怕暂时的混乱。宇宙本身就是在混沌中诞生的，而你的内心也是一个不断膨胀的宇宙。那些看似无序的元素，最终会拼出你意想不到的图景。',
      '有时候最勇敢的事情不是大声反抗，而是允许自己在' + cardName + '的守护下，静静地承认："是的，我感到不安/迷茫/渴望。"当你不再和情绪对抗，它们就会失去控制你的力量。'
    ]
  ]

  const seed = ctx.cardId * 3 + (isReversed ? 1 : 0) + positionLabel.length
  const intro = positionIntros[positionLabel] || positionIntros['当下 · 核心']
  const body1 = bodySegments[0][seed % bodySegments[0].length]
  const body2 = bodySegments[1][(seed * 7) % bodySegments[1].length]
  const closing = bodySegments[2][(seed * 13) % bodySegments[2].length]

  const closingQuestion = isReversed
    ? '当' + cardName + '逆位的光芒照进' + positionLabel + '，它希望你在哪个角落重新审视自己？'
    : '当' + cardName + '的能量在' + positionLabel + '绽放，你愿意接纳它带来的哪一份礼物？'

  return `${intro}\n\n${reversedNote}\n\n${body1}\n\n${body2}\n\n${closing}\n\n${closingQuestion}`
}

const SUMMARY_PROMPT = `你是一位塔罗解读师。现在你已经分别为三张牌做了单独解读，请基于三张牌的整体牌阵，给出一段综合解读。

要求：
1. 找到三张牌之间的能量联系和叙事脉络
2. 将"过去·当下·未来"串联成一个完整的故事
3. 指出整个牌阵的核心主题
4. 给出一句能触动用户的结语
5. 字数控制在 200-300 字
6. 以第二人称"你"进行对话
7. 不要重复每张牌的单独解读内容`

export function useOracleAI() {
  const messages = ref<DialogMessage[]>([])
  const chatMessages = ref<ChatMessage[]>([])
  const isGenerating = ref(false)
  const hasError = ref(false)
  const errorMessage = ref('')
  const currentCardIndex = ref(-1)

  const SYSTEM_PROMPT = `你是一位精通荣格分析心理学、卡巴拉神秘传统和现代神经科学的占卜引导师。你用塔罗牌作为潜意识的投射镜，而非命运的判决书。

语言风格规范（必须严格遵守）：
1. 永远不要使用"根据您的输入"、"您的情况"、"分析显示"等科技产品的机械语言
2. 以第二人称"你"直接对话，语气像一个洞察人心的挚友，不是算命先生
3. 多使用感官性、画面感强的比喻（"就像一头被困在水泥地下的根"）
4. 引用具体的心理学概念时，要自然融入（阴影、集体无意识、原型），不要学术腔
5. 每段解读必须包含：①牌的核心能量（1-2句）②与用户情绪的具体连接（2-3句）③一个具体的行动启示或内在问题（1-2句）
6. 禁止给出任何关于健康、财务、法律的建议
7. 字数：每张牌的解读控制在 120-180 字之间
8. 结尾不要总结，留下一个开放性的、值得反思的问题

口吻参考（你可以超越这个水准，但禁止低于）：
"你以为自己只是普通的疲惫，但这张牌告诉我，那不是疲惫——那是一头困在理智铁笼里的野兽，正在你的胸腔里无声地撕咬。你越是用'应该'和'必须'来驯服它，它的反扑就越会以某种你没预料到的方式出现……"`

  function msgId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  }

  function chatMsgId(): string {
    return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  }

  function addMessage(msg: DialogMessage) {
    messages.value.push(msg)
  }

  function updateLastMessage(text: string, isComplete: boolean) {
    const last = messages.value[messages.value.length - 1]
    if (last) {
      last.text = text
      last.isComplete = isComplete
      last.isGenerating = !isComplete
    }
  }

  function addChatMessage(msg: ChatMessage) {
    chatMessages.value.push(msg)
  }

  function updateLastChatMessage(text: string, isComplete: boolean) {
    const last = chatMessages.value[chatMessages.value.length - 1]
    if (last) {
      last.text = text
      last.isComplete = isComplete
      last.isGenerating = !isComplete
    }
  }

  function addSystemMessage(text: string) {
    addChatMessage({
      id: chatMsgId(),
      role: 'system',
      type: 'text',
      text,
      isComplete: true,
      isGenerating: false
    })
  }

  function addUserMessage(text: string) {
    addChatMessage({
      id: chatMsgId(),
      role: 'user',
      type: 'text',
      text,
      isComplete: true,
      isGenerating: false
    })
  }

  function addCardDrawMessage(cards: DrawnCard[]) {
    addChatMessage({
      id: chatMsgId(),
      role: 'assistant',
      type: 'card-draw',
      text: '',
      isComplete: false,
      isGenerating: false,
      drawnCards: cards,
      revealedCards: [false, false, false]
    })
  }

  function revealCardInDrawMessage(index: number) {
    const msg = chatMessages.value.find(m => m.type === 'card-draw' && m.revealedCards)
    if (msg && msg.revealedCards) {
      msg.revealedCards[index] = true
      if (msg.revealedCards.every(Boolean)) {
        msg.isComplete = true
      }
    }
  }

  function areAllCardsRevealed(): boolean {
    const msg = chatMessages.value.find(m => m.type === 'card-draw')
    return msg?.revealedCards?.every(Boolean) ?? false
  }

  async function streamAPI(
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number,
    temperature: number,
    onChunk: (text: string) => void
  ): Promise<string> {
    const config = getCurrentModelConfig()

    if (!config.apiKey || config.apiKey === 'undefined' || config.apiKey === 'your-api-key-here') {
      throw new Error('API Key 未配置。请在设置中配置模型或检查 .env.local 文件')
    }

    const apiEndpoint = config.apiUrl
      ? `${config.apiUrl.replace(/\/$/, '')}/chat/completions`
      : '/api/chat/completions'

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: true,
        max_tokens: maxTokens,
        temperature,
        top_p: config.topP
      })
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '未知错误')
      console.error('API 错误响应:', errorText)
      throw new Error(`HTTP 错误: ${response.status} - ${errorText.slice(0, 200)}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('无法获取响应流')

    const decoder = new TextDecoder('utf-8')
    let fullText = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.trim())

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const json = JSON.parse(data)
            const delta = json.choices[0]?.delta?.content || ''
            fullText += delta
            onChunk(fullText)
          } catch { /* skip parse errors */ }
        }
      }
    }

    return fullText
  }

  async function streamMock(text: string, onChunk: (t: string) => void): Promise<string> {
    for (let i = 0; i <= text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 25))
      onChunk(text.slice(0, i))
    }
    return text
  }

  async function processCardReading(
    drawnCard: DrawnCard,
    diaryText: string,
    positionIndex: number,
    onUpdate: (text: string, isComplete: boolean) => void
  ): Promise<void> {
    const card = drawnCard.card
    const isReversed = drawnCard.isReversed
    const positionLabel = drawnCard.positionLabel
    const positionNum = positionIndex + 1

    currentCardIndex.value = positionIndex

    const userPrompt = `用户今天的情绪日记：
「${diaryText}」
为用户解读第 ${positionNum} 张牌：
牌名：${card.name}（${card.nameEn}）
位置含义：${positionLabel}
出现状态：${isReversed ? '逆位' : '正位'}
${isReversed ? '逆位参考含义：' + card.shadowMeaning : '正位参考含义：' + card.lightMeaning}
请基于以上信息，为这位用户给出这张牌的专属神谕解读。`

    const useMock = import.meta.env.VITE_USE_MOCK === 'true'

    try {
      const fullText = useMock
        ? await streamMock(
            generateMockResponse({ cardName: card.name, positionLabel, isReversed, cardId: card.id }),
            (text) => onUpdate(text, false)
          )
        : await streamAPI(SYSTEM_PROMPT, userPrompt, 400, 0.85, (text) => onUpdate(text, false))

      onUpdate(fullText, true)
    } catch (error) {
      hasError.value = true
      errorMessage.value = error instanceof Error ? error.message : '未知错误'
      throw error
    }
  }

  async function processSummary(
    drawnCards: DrawnCard[],
    diaryText: string,
    onUpdate: (text: string, isComplete: boolean) => void
  ): Promise<void> {
    const cardReadingMsgs = chatMessages.value.filter(m => m.type === 'card-reading')

    const cardsSummary = drawnCards.map((dc, i) => {
      const reading = cardReadingMsgs.find(m => m.cardId === dc.card.id)
      return `第${i + 1}张：${dc.card.name}（${dc.positionLabel}，${dc.isReversed ? '逆位' : '正位'}）
单独解读：${reading?.text || ''}`
    }).join('\n\n')

    const userPrompt = `用户日记：
「${diaryText}」

三张牌的牌阵解读：
${cardsSummary}

请给出三张牌阵的综合解读。`

    const useMock = import.meta.env.VITE_USE_MOCK === 'true'
    const mockSummary = '三张牌如同一面三棱镜，将你的情绪之光折射出三种不同的色彩。过去的经历为你铺就了今天的道路，当下的觉察正在重塑未来的轨迹。这三张牌共同诉说着一个关于「转化」的故事——不是被动地等待命运的安排，而是主动地与自己的潜意识对话。\n\n你此刻所站的位置，正是过去与未来的交汇点。每一张牌都在提醒你：真正的力量不在牌面之上，而在你解读它们时所唤醒的那份自我觉察。\n\n当你再次凝视这三张牌时，不妨问自己：它们想让我看见的，究竟是牌面本身，还是我投射在牌面上的那颗心？'

    try {
      const fullText = useMock
        ? await streamMock(mockSummary, (text) => onUpdate(text, false))
        : await (async () => {
            const config = getCurrentModelConfig()
            if (!config.apiKey || config.apiKey === 'undefined') {
              return mockSummary
            }

            const apiEndpoint = config.apiUrl
              ? `${config.apiUrl.replace(/\/$/, '')}/chat/completions`
              : '/api/chat/completions'

            const response = await fetch(apiEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
              },
              body: JSON.stringify({
                model: config.model,
                messages: [
                  { role: 'system', content: SUMMARY_PROMPT },
                  { role: 'user', content: userPrompt }
                ],
                stream: true,
                max_tokens: 600,
                temperature: 0.8,
                top_p: config.topP
              })
            })

            if (!response.ok) throw new Error('综合解读请求失败')

            const reader = response.body?.getReader()
            if (!reader) throw new Error('无法获取响应流')

            const decoder = new TextDecoder('utf-8')
            let fullText = ''

            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              const chunk = decoder.decode(value)
              const lines = chunk.split('\n').filter(line => line.trim())
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6)
                  if (data === '[DONE]') continue
                  try {
                    const json = JSON.parse(data)
                    const delta = json.choices[0]?.delta?.content || ''
                    fullText += delta
                    onUpdate(fullText, false)
                  } catch { /* skip */ }
                }
              }
            }
            return fullText
          })()

      onUpdate(fullText, true)
    } catch (error) {
      console.error('综合解读失败:', error)
      onUpdate('三张牌已解读完毕，请结合每张牌的启示自行体悟其中的关联。', true)
    }
  }

  async function runAllReadings(diaryText: string, drawnCards: DrawnCard[]): Promise<void> {
    isGenerating.value = true
    hasError.value = false
    errorMessage.value = ''

    try {
      for (let i = 0; i < drawnCards.length; i++) {
        const dc = drawnCards[i]

        addChatMessage({
          id: chatMsgId(),
          role: 'assistant',
          type: 'card-reading',
          cardId: dc.card.id,
          cardName: dc.card.name,
          cardIcon: dc.card.icon,
          positionLabel: dc.positionLabel,
          isReversed: dc.isReversed,
          text: '',
          isComplete: false,
          isGenerating: true
        })

        await processCardReading(dc, diaryText, i, (text, isComplete) => {
          updateLastChatMessage(text, isComplete)
        })
      }

      addChatMessage({
        id: chatMsgId(),
        role: 'assistant',
        type: 'summary',
        text: '',
        isComplete: false,
        isGenerating: true
      })

      await processSummary(drawnCards, diaryText, (text, isComplete) => {
        updateLastChatMessage(text, isComplete)
      })
    } catch (error) {
      hasError.value = true
      errorMessage.value = error instanceof Error ? error.message : '生成神谕时发生错误'
    } finally {
      isGenerating.value = false
      currentCardIndex.value = -1
    }
  }

  function initChat() {
    chatMessages.value = []
    addSystemMessage('欢迎来到情绪镜像塔罗 ✦\n\n我是你的占卜引导师。塔罗牌并非命运的判决书，而是你潜意识的投射镜——每一张牌，都是你内心深处正在诉说却未被听见的声音。\n\n请告诉我，今天你的内心在经历什么？任何感受都可以——喜悦、迷茫、疲惫，或只是一种说不清楚的情绪。')
  }

  async function generateOracleDialogue(request: OracleRequest): Promise<void> {
    isGenerating.value = true
    hasError.value = false
    errorMessage.value = ''
    messages.value = []
    currentCardIndex.value = -1

    const { diaryText, drawnCards } = request

    try {
      for (let i = 0; i < drawnCards.length; i++) {
        const dc = drawnCards[i]

        addMessage({
          id: msgId(),
          cardId: dc.card.id,
          cardName: dc.card.name,
          cardIcon: dc.card.icon,
          positionLabel: dc.positionLabel,
          isReversed: dc.isReversed,
          text: '',
          isComplete: false,
          isGenerating: true,
          type: 'card'
        })

        await processCardReading(dc, diaryText, i, (text, isComplete) => {
          updateLastMessage(text, isComplete)
        })
      }

      addMessage({
        id: msgId(),
        text: '',
        isComplete: false,
        isGenerating: true,
        type: 'summary'
      })

      await processSummary(drawnCards, diaryText, (text, isComplete) => {
        updateLastMessage(text, isComplete)
      })
    } catch (error) {
      hasError.value = true
      errorMessage.value = error instanceof Error ? error.message : '生成神谕时发生错误'
    } finally {
      isGenerating.value = false
      currentCardIndex.value = -1
    }
  }

  function resetChat() {
    chatMessages.value = []
    messages.value = []
    hasError.value = false
    errorMessage.value = ''
    isGenerating.value = false
    currentCardIndex.value = -1
  }

  return {
    messages,
    generateOracleDialogue,
    chatMessages,
    isGenerating,
    hasError,
    errorMessage,
    currentCardIndex,
    addSystemMessage,
    addUserMessage,
    addCardDrawMessage,
    revealCardInDrawMessage,
    areAllCardsRevealed,
    runAllReadings,
    initChat,
    resetChat
  }
}
