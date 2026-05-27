<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import type { DialogMessage } from '@/composables/ai/useOracleAI'

interface Props {
  messages: DialogMessage[]
  isGenerating: boolean
  currentCardIndex: number
}

const props = defineProps<Props>()

const containerRef = ref<HTMLElement | null>(null)

const activeCardName = computed(() => {
  if (props.currentCardIndex < 0) return ''
  const msg = props.messages.find(m =>
    m.cardId !== undefined && !m.isComplete
  )
  return msg?.cardName || ''
})

watch(
  () => props.messages.length,
  async () => {
    await nextTick()
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  }
)

watch(
  () => props.messages[props.messages.length - 1]?.text,
  async () => {
    await nextTick()
    if (containerRef.value) {
      const el = containerRef.value
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) {
        el.scrollTop = el.scrollHeight
      }
    }
  }
)
</script>

<template>
  <div class="oracle-dialog flex flex-col h-full">
    <div class="shrink-0 px-4 py-3 border-b" :style="{ borderColor: 'rgba(139, 92, 246, 0.25)' }">
      <div class="flex items-center gap-2">
        <span class="text-sm text-[#c8a0ff]">◈</span>
        <span class="text-sm font-serif-sc text-[#c4b5fd] tracking-wider">神谕对话</span>
        <span v-if="isGenerating" class="ml-auto flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse" />
          <span class="text-[10px] text-[#8b9dc3] font-serif-sc">
            {{ activeCardName ? `${activeCardName} 解读中...` : '综合解读中...' }}
          </span>
        </span>
        <span v-else-if="messages.length > 0" class="ml-auto text-[10px] text-[#5a6a8a] font-serif-sc">
          解读完成
        </span>
      </div>
    </div>

    <div
      ref="containerRef"
      class="flex-1 overflow-y-auto px-4 py-3 space-y-4 custom-scroll"
    >
      <div
        v-if="messages.length === 0 && !isGenerating"
        class="flex items-center justify-center h-full"
      >
        <div class="text-center space-y-3">
          <div class="text-2xl opacity-30">◈ ✦ ◈</div>
          <p class="text-xs text-[#5a6a8a] font-serif-sc">等待神谕降临...</p>
        </div>
      </div>

      <div
        v-for="msg in messages"
        :key="msg.id"
        class="dialog-message"
        :class="{ 'dialog-message--enter': true }"
      >
        <div v-if="msg.type === 'card'" class="flex gap-3">
          <div
            class="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex flex-col items-center justify-center"
            :style="{
              background: msg.isReversed ? 'rgba(255, 100, 150, 0.15)' : 'rgba(139, 92, 246, 0.15)',
              border: `1px solid ${msg.isReversed ? 'rgba(255, 100, 150, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`
            }"
          >
            <span class="text-lg md:text-xl">{{ msg.cardIcon }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="text-xs md:text-sm font-serif-sc text-[#f0e6d0]">{{ msg.cardName }}</span>
              <span class="text-[10px] text-[#8899bb]">·</span>
              <span class="text-[10px] text-[#8899bb] font-serif-sc">{{ msg.positionLabel }}</span>
              <span
                class="text-[10px] px-1.5 py-0.5 rounded-full"
                :style="{
                  background: msg.isReversed ? 'rgba(255, 100, 150, 0.15)' : 'rgba(100, 200, 150, 0.15)',
                  color: msg.isReversed ? '#ff8ab0' : '#7dffc4'
                }"
              >
                {{ msg.isReversed ? '逆位' : '正位' }}
              </span>
            </div>

            <div
              class="relative p-3 md:p-4 rounded-xl"
              style="background: rgba(15, 12, 35, 0.8); border: 1px solid rgba(139, 92, 246, 0.15);"
            >
              <p class="text-xs md:text-sm text-[#c8d5f0] font-serif-sc leading-[1.9] whitespace-pre-wrap">
                {{ msg.text }}
                <span v-if="!msg.isComplete && msg.isGenerating" class="cursor-blink">|</span>
              </p>
              <Transition name="mark-fade">
                <span
                  v-if="msg.isComplete"
                  class="completion-mark absolute bottom-1.5 right-3 text-[#c9a84c] text-xs"
                  style="text-shadow: 0 0 6px rgba(201, 168, 76, 0.5);"
                >◈</span>
              </Transition>
            </div>
          </div>
        </div>

        <div v-else class="summary-block">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-6 h-px" style="background: linear-gradient(90deg, transparent, #c9a84c);"></div>
            <span class="text-sm font-serif-sc text-[#c9a84c]">✦ 综合解读 ✦</span>
            <div class="flex-1 h-px" style="background: linear-gradient(90deg, #c9a84c, transparent);"></div>
          </div>
          <div
            class="p-4 rounded-xl"
            style="background: linear-gradient(135deg, rgba(30, 20, 60, 0.6), rgba(20, 15, 45, 0.6)); border: 1px solid rgba(201, 168, 76, 0.2);"
          >
            <p class="text-xs md:text-sm text-[#e8dcc8] font-serif-sc leading-[2] whitespace-pre-wrap">
              {{ msg.text }}
              <span v-if="!msg.isComplete && msg.isGenerating" class="cursor-blink text-[#c9a84c]">|</span>
            </p>
            <Transition name="mark-fade">
              <span
                v-if="msg.isComplete"
                class="inline-block mt-2 text-[#c9a84c] text-xs"
                style="text-shadow: 0 0 8px rgba(201, 168, 76, 0.6);"
              >◈ 解读完成 ◈</span>
            </Transition>
          </div>
        </div>
      </div>

      <div
        v-if="isGenerating && messages.length > 0 && messages[messages.length - 1]?.isComplete"
        class="flex items-center gap-2 pl-14"
      >
        <span class="typing-dot w-1.5 h-1.5 rounded-full bg-[#8b9dc3]" />
        <span class="typing-dot w-1.5 h-1.5 rounded-full bg-[#8b9dc3]" style="animation-delay: 0.15s;" />
        <span class="typing-dot w-1.5 h-1.5 rounded-full bg-[#8b9dc3]" style="animation-delay: 0.3s;" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.oracle-dialog {
  min-height: 0;
}

.custom-scroll::-webkit-scrollbar {
  width: 3px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.2);
  border-radius: 2px;
}

.dialog-message--enter {
  animation: msg-in 0.4s ease-out;
}

@keyframes msg-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.font-serif-sc {
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
}
</style>
