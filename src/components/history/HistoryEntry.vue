<script setup lang="ts">
import type { ReadingRecord } from '@/composables/data/useReadingHistory'
import { computed } from 'vue'

const props = defineProps<{
  record: ReadingRecord
  index: number
}>()

const emit = defineEmits<{
  delete: [id: string]
  expand: [record: ReadingRecord]
}>()

const formattedDate = computed(() => {
  const date = new Date(props.record.timestamp)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${mm}/${dd} ${hh}:${min}`
})

const truncatedDiary = computed(() => {
  if (props.record.diaryExcerpt.length <= 40) {
    return props.record.diaryExcerpt
  }
  return props.record.diaryExcerpt.slice(0, 40) + '…'
})

const cardNames = computed(() => {
  return props.record.drawnCards.map(dc => dc.card.name)
})

const intensityLabel = computed(() => {
  if (props.record.emotionIntensity >= 70) return '高强度情绪'
  if (props.record.emotionIntensity >= 40) return '中强度情绪'
  return '低强度情绪'
})

function handleCardClick() {
  emit('expand', props.record)
}

function handleDelete(e: Event) {
  e.stopPropagation()
  emit('delete', props.record.id)
}
</script>

<template>
  <div
    v-motion
    :initial="{ x: 60, opacity: 0 }"
    :enter="{ x: 0, opacity: 1 }"
    :transition="{ duration: 400, delay: index * 50 }"
    class="glass rounded-xl p-4 mb-3 cursor-pointer select-none transition-all duration-200 hover:scale-[1.005] hover:shadow-[0_0_20px_rgba(138,120,255,0.15)]"
    @click="handleCardClick"
  >
    <div class="flex justify-between items-center mb-2">
      <span class="text-xs text-[#8b9dc3] font-mono">{{ formattedDate }}</span>
      <button
        class="text-lg leading-none transition-colors duration-200 hover:text-red-400 hover:scale-110"
        @click="handleDelete"
      >
        ❌
      </button>
    </div>

    <p class="text-sm text-[#b8c5d9] mb-3 leading-relaxed">{{ truncatedDiary }}</p>

    <div class="flex gap-1.5 mb-3">
      <span
        v-for="name in cardNames"
        :key="name"
        class="px-2 py-0.5 text-[10px] font-serif-sc rounded-full border border-[rgba(100,80,160,0.4)] bg-[rgba(40,30,80,0.3)] text-[#9b8fc7]"
      >
        {{ name }}
      </span>
    </div>

    <div class="flex items-center gap-2">
      <span
        class="px-3 py-0.5 text-xs font-serif-sc rounded-full border backdrop-blur-sm"
        :class="{
          'bg-[rgba(180,50,100,0.15)] border-[rgba(220,80,120,0.4)] text-[#ff8ab0]': record.dominantMood.includes('悲') || record.dominantMood.includes('恐') || record.dominantMood.includes('怒'),
          'bg-[rgba(20,120,80,0.15)] border-[rgba(40,200,130,0.4)] text-[#7dffc4]': record.dominantMood.includes('喜') || record.dominantMood.includes('平静'),
          'bg-[rgba(40,60,120,0.15)] border-[rgba(80,120,200,0.4)] text-[#8ab4f8]': record.dominantMood.includes('惊') || !record.dominantMood
        }"
      >
        {{ record.dominantMood }}
      </span>
      <span class="text-xs text-[#6b7a99]">{{ intensityLabel }} · {{ record.emotionIntensity }}</span>
    </div>
  </div>
</template>
