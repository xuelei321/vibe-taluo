<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { useOracleAI } from '@/composables/ai/useOracleAI'
import { useTarotSpread } from '@/composables/tarot/useTarotSpread'
import { useReadingHistory } from '@/composables/data/useReadingHistory'
import { analyzeEmotions } from '@/composables/emotion/useEmotionDetector'
import { parseMarkdown } from '@/utils/markdown'
import type { DrawnCard } from '@/composables/tarot/useTarotSpread'

const emit = defineEmits<{
  (e: 'openDrawer'): void
}>()

const {
  chatMessages,
  isGenerating,
  hasError,
  errorMessage,
  addUserMessage,
  addCardDrawMessage,
  revealCardInDrawMessage,
  areAllCardsRevealed,
  runAllReadings,
  initChat,
  resetChat
} = useOracleAI()

const { drawnCards, drawSpread, resetSpread } = useTarotSpread()
const { addRecord } = useReadingHistory()

const inputText = ref('')
const savedDiaryText = ref('')
const containerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const phase = ref<'welcome' | 'input' | 'drawing' | 'reading' | 'complete'>('welcome')
const cardRevealCount = ref(0)

const minLength = 20
const canSend = computed(() => inputText.value.trim().length >= minLength && !isGenerating.value)

function scrollToBottom() {
  nextTick(() => {
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  })
}

watch(() => chatMessages.value.length, scrollToBottom)
watch(
  () => {
    const msgs = chatMessages.value
    return msgs[msgs.length - 1]?.text
  },
  () => {
    if (containerRef.value) {
      const el = containerRef.value
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
        el.scrollTop = el.scrollHeight
      }
    }
  }
)

initChat()
scrollToBottom()

async function handleSend() {
  if (!canSend.value) return

  const text = inputText.value.trim()
  savedDiaryText.value = text
  inputText.value = ''

  addUserMessage(text)
  phase.value = 'drawing'
  scrollToBottom()

  await new Promise(resolve => setTimeout(resolve, 600))
  drawSpread()
  addCardDrawMessage(drawnCards.value)
  cardRevealCount.value = 0
  scrollToBottom()
}

async function handleRevealCard(index: number) {
  if (isGenerating.value) return

  revealCardInDrawMessage(index)
  cardRevealCount.value++
  scrollToBottom()

  if (areAllCardsRevealed()) {
    phase.value = 'reading'
    await new Promise(resolve => setTimeout(resolve, 500))

    const cards = [...drawnCards.value]

    await runAllReadings(savedDiaryText.value, cards)
    phase.value = 'complete'
    saveRecord(cards)
    scrollToBottom()
  }
}

function saveRecord(cards: DrawnCard[]) {
  const oracleTexts: Record<number, string> = {}
  chatMessages.value.forEach(msg => {
    if (msg.type === 'card-reading' && msg.cardId !== undefined) {
      oracleTexts[msg.cardId] = msg.text
    }
  })

  const emotion = analyzeEmotions(savedDiaryText.value)

  addRecord({
    diaryExcerpt: savedDiaryText.value.slice(0, 200),
    drawnCards: cards,
    oracleTexts,
    emotionIntensity: emotion.emotionIntensity || Math.round(Math.min(100, savedDiaryText.value.length / 2 + 20)),
    dominantMood: emotion.moodLabel
  })
}

async function handleRedraw() {
  if (isGenerating.value) return

  resetChat()
  resetSpread()
  initChat()
  inputText.value = ''
  savedDiaryText.value = ''
  phase.value = 'welcome'
  cardRevealCount.value = 0
  scrollToBottom()
}

function handleRetry() {
  hasError.value = false
  errorMessage.value = ''
  handleRedraw()
}

function getCardBackStyle(card: DrawnCard) {
  const c = card.card
  if (c.arcana === 'major') {
    return {
      bg: '#0d0820',
      border: 'rgba(150, 100, 255, 0.6)',
      accent: '#c9a84c',
      symbol: '✦'
    }
  }
  switch (c.suit) {
    case 'wands':
      return { bg: '#1a0c04', border: 'rgba(255, 150, 80, 0.6)', accent: '#ff9040', symbol: '🔥' }
    case 'cups':
      return { bg: '#040d1a', border: 'rgba(100, 150, 255, 0.6)', accent: '#6090ff', symbol: '💧' }
    case 'swords':
      return { bg: '#0a0d12', border: 'rgba(160, 190, 220, 0.55)', accent: '#a8c8e8', symbol: '🗡' }
    case 'pentacles':
      return { bg: '#08140a', border: 'rgba(120, 200, 150, 0.55)', accent: '#70c080', symbol: '⬠' }
    default:
      return { bg: '#0d0820', border: 'rgba(150, 100, 255, 0.6)', accent: '#c9a84c', symbol: '✦' }
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function autoResize() {
  const el = inputRef.value
  if (el) {
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 150)}px`
  }
}

defineExpose({ focus: () => inputRef.value?.focus() })
</script>

<template>
  <div class="chat-view flex flex-col h-full w-full max-w-[900px] mx-auto">
    <div
      ref="containerRef"
      class="flex-1 overflow-y-auto px-4 py-6 space-y-5 custom-scroll"
    >
      <TransitionGroup name="message-fade">
        <template v-for="msg in chatMessages" :key="msg.id">
          <div v-if="msg.role === 'system' && msg.type === 'text'" class="flex justify-start">
            <div class="max-w-[85%] md:max-w-[75%]">
              <div
                class="px-5 py-4 rounded-2xl"
                style="background: rgba(20, 15, 50, 0.5); border: 1px solid rgba(139, 92, 246, 0.15);"
              >
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-sm text-[#c8a0ff]">◈</span>
                  <span class="text-xs font-serif-sc text-[#8899bb] tracking-wider">情绪镜像塔罗</span>
                </div>
                <div class="text-sm text-[#c0cdf0] font-serif-sc leading-[2]" v-html="parseMarkdown(msg.text)"></div>
              </div>
            </div>
          </div>

          <div v-else-if="msg.role === 'user' && msg.type === 'text'" class="flex justify-end">
            <div class="max-w-[80%] md:max-w-[70%]">
              <div
                class="px-5 py-3.5 rounded-2xl"
                style="background: rgba(100, 80, 200, 0.2); border: 1px solid rgba(139, 92, 246, 0.3);"
              >
                <p class="text-sm text-[#d8e0f8] font-serif-sc leading-[1.9] whitespace-pre-wrap">{{ msg.text }}</p>
              </div>
            </div>
          </div>

          <div v-else-if="msg.type === 'card-draw'" class="flex justify-start">
            <div class="max-w-[95%] md:max-w-[90%] w-full">
              <div
                class="px-5 py-5 rounded-2xl"
                style="background: rgba(20, 15, 50, 0.5); border: 1px solid rgba(139, 92, 246, 0.15);"
              >
                <div class="flex items-center gap-2 mb-4">
                  <span class="text-sm text-[#c8a0ff]">◈</span>
                  <span class="text-xs font-serif-sc text-[#8899bb] tracking-wider">为你抽出了三张牌</span>
                </div>

                <p v-if="cardRevealCount === 0" class="text-xs text-[#6a7a9a] font-serif-sc mb-4">
                  请依次点击每一张牌，将它翻开——让潜意识的映像呈现在你面前。
                </p>
                <p v-else-if="cardRevealCount < 3" class="text-xs text-[#6a7a9a] font-serif-sc mb-4">
                  还有 {{ 3 - cardRevealCount }} 张牌等待你的触碰...
                </p>
                <p v-else class="text-xs text-[#7dffc4] font-serif-sc mb-4">
                  三张牌已全部翻开，解读即将开始 ✦
                </p>

                <div class="flex flex-row justify-center items-end gap-3 md:gap-5">
                  <div
                    v-for="(card, index) in msg.drawnCards"
                    :key="index"
                    class="flex flex-col items-center gap-2"
                  >
                    <div
                      class="relative cursor-pointer transition-all duration-300"
                      :class="[
                        msg.revealedCards?.[index]
                          ? 'w-[90px] h-[140px] md:w-[110px] md:h-[170px]'
                          : 'w-[90px] h-[140px] md:w-[110px] md:h-[170px] hover:scale-105 hover:-translate-y-2',
                        !msg.revealedCards?.[index] && !isGenerating ? 'animate-float-card' : ''
                      ]"
                      :style="{
                        perspective: '1000px',
                        animationDelay: !msg.revealedCards?.[index] ? `${index * 0.3}s` : '0s'
                      }"
                      @click="handleRevealCard(index)"
                    >
                      <div
                        v-if="!msg.revealedCards?.[index]"
                        class="absolute inset-0 rounded-xl overflow-hidden transition-all duration-500"
                        :style="{
                          background: getCardBackStyle(card).bg,
                          border: `1.5px solid ${getCardBackStyle(card).border}`,
                          boxShadow: `0 0 20px ${getCardBackStyle(card).border.replace('0.6', '0.25').replace('0.55', '0.2')}`,
                          transform: `rotate(${[-6, 0, 6][index]}deg)`,
                          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }"
                      >
                        <div class="absolute inset-0 flex items-center justify-center">
                          <div class="relative w-12 h-12 md:w-16 md:h-16">
                            <div class="absolute inset-0 border opacity-30" :style="{ borderColor: getCardBackStyle(card).accent }" style="transform: rotate(0deg);"></div>
                            <div class="absolute inset-0 border opacity-30" :style="{ borderColor: getCardBackStyle(card).accent }" style="transform: rotate(45deg);"></div>
                            <div class="absolute inset-0 border opacity-20" :style="{ borderColor: getCardBackStyle(card).accent }" style="transform: rotate(22.5deg);"></div>
                            <div class="absolute inset-0 border opacity-20" :style="{ borderColor: getCardBackStyle(card).accent }" style="transform: rotate(67.5deg);"></div>
                            <div class="absolute inset-0 flex items-center justify-center">
                              <span class="text-lg md:text-xl opacity-40" :style="{ color: getCardBackStyle(card).accent }">{{ getCardBackStyle(card).symbol }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="absolute bottom-2 left-0 right-0 text-center">
                          <span class="text-[9px] md:text-[10px] font-serif-sc opacity-30 tracking-[0.2em]" :style="{ color: getCardBackStyle(card).accent }">TAROT</span>
                        </div>
                        <div class="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          :style="{ boxShadow: `0 0 30px ${getCardBackStyle(card).accent}40, inset 0 0 30px ${getCardBackStyle(card).accent}20` }"></div>
                      </div>

                      <div
                        v-else
                        class="absolute inset-0 rounded-xl overflow-hidden transition-all duration-500"
                        style="transform: rotate(0deg);"
                        :style="{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }"
                      >
                        <div class="absolute inset-0" style="background: linear-gradient(180deg, #080820 0%, #0d0f30 100%);"></div>
                        <div class="absolute inset-0 rounded-xl" style="border: 1.5px solid rgba(200, 160, 80, 0.7);"></div>
                        <div class="relative w-full h-full flex flex-col items-center justify-center p-2 space-y-0.5">
                          <span class="text-[9px] text-[#8ab4f8] opacity-80 font-serif-sc">{{ card.positionLabel }}</span>
                          <span class="text-xl md:text-2xl">{{ card.card.icon }}</span>
                          <span class="text-[10px] md:text-xs font-serif-sc text-[#f0e6d0] text-center leading-tight">{{ card.card.name }}</span>
                          <span class="text-[8px] md:text-[9px] text-[#8899bb] tracking-wide">{{ card.card.nameEn }}</span>
                          <span
                            class="text-[9px] px-1.5 py-0.5 rounded-full"
                            :style="{
                              background: card.isReversed ? 'rgba(255, 100, 150, 0.15)' : 'rgba(100, 200, 150, 0.15)',
                              color: card.isReversed ? '#ff8ab0' : '#7dffc4'
                            }"
                          >
                            {{ card.isReversed ? '逆位' : '正位' }}
                          </span>
                        </div>
                        <div class="absolute inset-0 rounded-xl pointer-events-none opacity-30"
                          :style="{ boxShadow: `0 0 15px rgba(200, 160, 80, 0.5), 0 0 30px rgba(200, 160, 80, 0.2)` }"></div>
                      </div>
                    </div>

                    <span v-if="msg.revealedCards?.[index]" class="text-[10px] text-[#8899bb] font-serif-sc opacity-60">
                      {{ card.positionLabel }}
                    </span>
                    <span v-else class="text-[10px] text-[#5a6a8a] font-serif-sc">
                      点击翻开
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="msg.type === 'card-reading'" class="flex justify-start">
            <div class="max-w-[85%] md:max-w-[75%]">
              <div class="flex items-center gap-2.5 mb-2 pl-1">
                <div
                  class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                  :style="{
                    background: msg.isReversed ? 'rgba(255, 100, 150, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                    border: `1px solid ${msg.isReversed ? 'rgba(255, 100, 150, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`
                  }"
                >
                  <span class="text-base">{{ msg.cardIcon }}</span>
                </div>
                <div>
                  <span class="text-sm font-serif-sc text-[#f0e6d0]">{{ msg.cardName }}</span>
                  <span class="text-[10px] text-[#8899bb] mx-1.5">·</span>
                  <span class="text-[10px] text-[#8899bb] font-serif-sc">{{ msg.positionLabel }}</span>
                </div>
                <span
                  class="text-[10px] px-1.5 py-0.5 rounded-full"
                  :style="{
                    background: msg.isReversed ? 'rgba(255, 100, 150, 0.15)' : 'rgba(100, 200, 150, 0.15)',
                    color: msg.isReversed ? '#ff8ab0' : '#7dffc4'
                  }"
                >
                  {{ msg.isReversed ? '逆位' : '正位' }}
                </span>
                <span v-if="msg.isGenerating" class="ml-auto flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse" />
                  <span class="text-[10px] text-[#8b9dc3] font-serif-sc">解读中</span>
                </span>
              </div>

              <div
                class="relative p-4 rounded-xl"
                style="background: rgba(15, 12, 35, 0.8); border: 1px solid rgba(139, 92, 246, 0.15);"
              >
                <div class="flex items-start gap-1">
                  <div class="flex-1 text-xs md:text-sm text-[#c8d5f0] font-serif-sc leading-[2]" v-html="parseMarkdown(msg.text)"></div>
                  <span v-if="!msg.isComplete && msg.isGenerating" class="cursor-blink">|</span>
                </div>
                <Transition name="mark-fade">
                  <span
                    v-if="msg.isComplete"
                    class="absolute bottom-1.5 right-3 text-[#c9a84c] text-xs"
                    style="text-shadow: 0 0 6px rgba(201, 168, 76, 0.5);"
                  >◈</span>
                </Transition>
              </div>
            </div>
          </div>

          <div v-else-if="msg.type === 'summary'" class="flex justify-center">
            <div class="max-w-[85%] md:max-w-[80%] w-full">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-8 h-px" style="background: linear-gradient(90deg, transparent, #c9a84c);"></div>
                <span class="text-sm font-serif-sc text-[#c9a84c]">✦ 综合解读 ✦</span>
                <div class="flex-1 h-px" style="background: linear-gradient(90deg, #c9a84c, transparent);"></div>
              </div>
              <div
                class="p-4 rounded-xl"
                style="background: linear-gradient(135deg, rgba(30, 20, 60, 0.6), rgba(20, 15, 45, 0.6)); border: 1px solid rgba(201, 168, 76, 0.2);"
              >
                <div class="flex items-start gap-1">
                  <div class="flex-1 text-xs md:text-sm text-[#e8dcc8] font-serif-sc leading-[2.1]" v-html="parseMarkdown(msg.text)"></div>
                  <span v-if="!msg.isComplete && msg.isGenerating" class="cursor-blink text-[#c9a84c]">|</span>
                </div>
                <Transition name="mark-fade">
                  <span
                    v-if="msg.isComplete"
                    class="inline-block mt-3 text-[#c9a84c] text-xs"
                    style="text-shadow: 0 0 8px rgba(201, 168, 76, 0.6);"
                  >◈ 解读完成 ◈</span>
                </Transition>
              </div>
            </div>
          </div>
        </template>
      </TransitionGroup>

      <div
        v-if="isGenerating && chatMessages.length > 0 && chatMessages[chatMessages.length - 1]?.isComplete"
        class="flex items-center gap-2 pl-4"
      >
        <span class="typing-dot w-1.5 h-1.5 rounded-full bg-[#8b9dc3]" />
        <span class="typing-dot w-1.5 h-1.5 rounded-full bg-[#8b9dc3]" style="animation-delay: 0.15s;" />
        <span class="typing-dot w-1.5 h-1.5 rounded-full bg-[#8b9dc3]" style="animation-delay: 0.3s;" />
      </div>

      <Transition name="fade-slow">
        <div v-if="hasError" class="flex justify-center">
          <div
            class="px-5 py-4 rounded-xl text-center max-w-[400px]"
            style="background: rgba(100, 30, 50, 0.3); border: 1px solid rgba(255, 100, 150, 0.5);"
          >
            <div class="flex items-center justify-center gap-2 mb-2">
              <span class="text-red-400 text-xs">◈</span>
              <span class="text-red-400 font-serif-sc text-xs">神谕传递受阻</span>
              <span class="text-red-400 text-xs">◈</span>
            </div>
            <p class="text-[#ff8ab0] text-xs font-serif-sc mb-3">
              {{ errorMessage || '连接中断，请重试...' }}
            </p>
            <button
              @click="handleRetry"
              class="px-5 py-2 rounded-lg border text-xs font-serif-sc transition-all duration-200 hover:scale-105 active:scale-95"
              style="background: rgba(150, 50, 100, 0.3); border-color: rgba(255, 100, 150, 0.6); color: #ff8ab0;"
            >
              ✦ 重新连接 ✦
            </button>
          </div>
        </div>
      </Transition>

      <div class="h-2" />
    </div>

    <div class="shrink-0 px-4 pb-4 pt-2">
      <Transition name="fade-slow">
        <div v-if="phase === 'complete'" class="flex justify-center gap-3 mb-4">
          <button
            @click="handleRedraw"
            class="px-6 py-2.5 rounded-xl border text-sm font-serif-sc transition-all duration-300 hover:scale-105 active:scale-95"
            style="background: rgba(80, 60, 160, 0.3); border-color: rgba(150, 100, 255, 0.6); color: #c8a0ff; box-shadow: 0 0 20px rgba(150, 100, 255, 0.25);"
          >
            ✦ 重新抽牌 ✦
          </button>
          <button
            @click="emit('openDrawer')"
            class="px-6 py-2.5 rounded-xl border text-sm font-serif-sc transition-all duration-300 hover:scale-105 active:scale-95"
            style="background: rgba(30, 40, 80, 0.4); border-color: rgba(100, 150, 255, 0.4); color: #8b9dc3;"
          >
            情绪星档
          </button>
        </div>
      </Transition>

      <div
        class="flex items-end gap-3 px-4 py-3 rounded-2xl transition-all duration-300"
        :class="phase !== 'complete' ? '' : 'opacity-60 pointer-events-none'"
        style="background: rgba(20, 15, 50, 0.7); border: 1px solid rgba(139, 92, 246, 0.25); backdrop-filter: blur(12px);"
      >
        <textarea
          ref="inputRef"
          v-model="inputText"
          :disabled="phase === 'reading' || phase === 'complete'"
          :placeholder="phase === 'drawing' ? '点击上方的牌翻开它们...' : '写下你的感受... (Enter 发送，Shift+Enter 换行)'"
          rows="1"
          class="flex-1 bg-transparent outline-none border-none text-sm text-[#c8d5f0] font-serif-sc resize-none placeholder:text-[#4a5a7a] leading-[1.7]"
          style="max-height: 150px;"
          @keydown="handleKeydown"
          @input="autoResize"
        />
        <button
          :disabled="!canSend"
          class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
          :class="canSend ? 'hover:scale-110 active:scale-95' : 'opacity-30'"
          :style="{
            background: canSend ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.1)',
            border: `1px solid ${canSend ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.15)'}`,
          }"
          @click="handleSend"
        >
          <span class="text-sm" :style="{ color: canSend ? '#c8a0ff' : '#5a6a8a' }">↑</span>
        </button>
      </div>

      <div class="flex justify-between mt-2 px-1">
        <span class="text-[10px] text-[#4a5a7a] font-serif-sc">
          {{ phase === 'welcome' ? `至少 ${minLength} 个字符` : phase === 'drawing' ? '翻开所有卡牌以继续' : '' }}
        </span>
        <span class="text-[10px] text-[#4a5a7a] font-serif-sc">{{ inputText.length }} 字</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-view {
  height: 100%;
  min-height: 0;
}

.custom-scroll::-webkit-scrollbar {
  width: 3px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.15);
  border-radius: 2px;
}

.cursor-blink {
  animation: blink 0.8s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.typing-dot {
  animation: dot-bounce 0.6s ease-in-out infinite;
}

@keyframes dot-bounce {
  0%, 100% { opacity: 0.3; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-4px); }
}

.mark-fade-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.mark-fade-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.fade-slow-enter-active,
.fade-slow-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-slow-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slow-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-slow-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-slow-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes float-card {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.animate-float-card {
  animation: float-card 3s ease-in-out infinite;
}

.message-fade-enter-active,
.message-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.message-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.message-fade-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.message-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.message-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.font-serif-sc {
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
}
</style>
