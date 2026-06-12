<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'

import { parseMarkdownToNodes, type MarkdownNode } from '@/utils/markdown'

interface Props {
  text: string
  isComplete: boolean
  isGenerating: boolean
}

const props = defineProps<Props>()

const containerRef = ref<HTMLElement | null>(null)
const showCompletionMark = ref(false)

const parsedNodes = computed(() => parseMarkdownToNodes(props.text))

watch(() => props.text, async () => {
  await nextTick()
  if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight
  }
})

watch(() => props.isComplete, (complete: boolean) => {
  if (complete) {
    setTimeout(() => { showCompletionMark.value = true }, 300)
  } else {
    showCompletionMark.value = false
  }
})

function renderNode(node: MarkdownNode, _index: number) {
  switch (node.type) {
    case 'strong':
      return `<strong class="text-[#f0e6d0] font-medium">${node.content}</strong>`
    case 'em':
      return `<em class="italic text-[#d0c8e8]">${node.content}</em>`
    case 'code':
      return `<code class="bg-[rgba(40,30,60,0.5)] text-[#a8c0ff] px-1 rounded text-[10px]">${node.content}</code>`
    case 'br':
      return '<br/>'
    case 'h1':
    case 'h2':
    case 'h3':
      return `<div class="text-[#c9a84c] font-serif-sc text-sm mb-1">${node.content}</div>`
    default:
      return node.content
  }
}

const renderedText = computed(() => {
  return parsedNodes.value.map((node, index) => renderNode(node, index)).join('')
})
</script>

<template>
  <div
    ref="containerRef"
    class="oracle-typewriter-container max-h-[120px] overflow-y-auto custom-scrollbar"
  >
    <div
      v-if="isGenerating && !text"
      class="flex items-center justify-center gap-2 h-[120px]"
    >
      <span class="rune-1 text-[#8ab4f8] text-sm">◈</span>
      <span class="rune-2 text-[#c9a84c] text-sm">✦</span>
      <span class="rune-3 text-[#8ab4f8] text-sm">◈</span>
    </div>

    <div
      v-else
      class="oracle-text font-serif-sc text-xs md:text-[11px] leading-[1.8] text-[#c0cce0]"
      :class="{ 'cursor-active': !isComplete && text }"
    >
      <span v-html="renderedText"></span>
      <Transition name="completion-fade">
        <span v-if="showCompletionMark && isComplete" class="completion-mark"> ◈</span>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(138, 180, 248, 0.1);
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(138, 180, 248, 0.3);
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(138, 180, 248, 0.5);
}

.completion-mark {
  color: #c9a84c;
  text-shadow: 0 0 8px rgba(201, 168, 76, 0.6), 0 0 16px rgba(201, 168, 76, 0.3);
}

.completion-fade-enter-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.completion-fade-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

@keyframes rune-breathe-1 {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes rune-breathe-2 {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes rune-breathe-3 {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

.rune-1 { animation: rune-breathe-1 2s ease-in-out infinite; }
.rune-2 { animation: rune-breathe-2 2s ease-in-out infinite; animation-delay: 0.33s; }
.rune-3 { animation: rune-breathe-3 2s ease-in-out infinite; animation-delay: 0.66s; }

.cursor-active::after {
  content: '|';
  animation: cursor-pulse 1s ease-in-out infinite;
  margin-left: 2px;
}

@keyframes cursor-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.font-serif-sc {
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
}
</style>
