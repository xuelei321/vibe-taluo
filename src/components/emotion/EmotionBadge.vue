<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  word: string
  type: 'negative' | 'positive' | 'neutral'
  color: string
}>()

const badgeStyle = computed(() => {
  const styles = {
    negative: {
      bgClass: 'bg-[rgba(180,50,100,0.2)]',
      borderClass: 'border-[rgba(220,80,120,0.5)]',
      textClass: 'text-[#ff8ab0]',
      glowClass: 'shadow-[0_0_10px_rgba(255,138,176,0.4)]',
    },
    positive: {
      bgClass: 'bg-[rgba(20,120,80,0.2)]',
      borderClass: 'border-[rgba(40,200,130,0.5)]',
      textClass: 'text-[#7dffc4]',
      glowClass: 'shadow-[0_0_10px_rgba(125,255,196,0.4)]',
    },
    neutral: {
      bgClass: 'bg-[rgba(40,60,120,0.2)]',
      borderClass: 'border-[rgba(80,120,200,0.5)]',
      textClass: 'text-[#8ab4f8]',
      glowClass: 'shadow-[0_0_10px_rgba(138,180,248,0.4)]',
    },
  }
  return styles[props.type]
})
</script>

<template>
  <span
    v-motion
    :initial="{ scale: 0.8, opacity: 0 }"
    :enter="{ scale: 1, opacity: 1 }"
    :transition="{ type: 'spring', duration: 300 }"
    class="inline-flex items-center px-4 py-1.5 text-xs font-serif-sc rounded-full border backdrop-blur-sm cursor-default transition-transform duration-200 hover:scale-105"
    :class="[badgeStyle.bgClass, badgeStyle.borderClass, badgeStyle.textClass, badgeStyle.glowClass]"
  >
    {{ word }}
  </span>
</template>
