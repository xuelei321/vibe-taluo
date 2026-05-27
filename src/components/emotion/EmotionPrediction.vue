<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useReadingHistory } from '@/composables/data/useReadingHistory'
import { useEmotionPatternEngine } from '@/composables/emotion/useEmotionPatternEngine'

const { records } = useReadingHistory()
const { predict, patternAnalysis, temporalPatterns, getStateDescription } = useEmotionPatternEngine(() => records.value)

const prediction = ref(predict())

onMounted(() => {
  const interval = setInterval(() => {
    prediction.value = predict()
  }, 60000)
  
  return () => clearInterval(interval)
})

const trendIcon = computed(() => {
  switch (prediction.value.trend) {
    case 'improving': return '↗'
    case 'declining': return '↘'
    default: return '→'
  }
})

const trendText = computed(() => {
  switch (prediction.value.trend) {
    case 'improving': return '上升中'
    case 'declining': return '下降中'
    default: return '稳定'
  }
})

const trendColor = computed(() => {
  switch (prediction.value.trend) {
    case 'improving': return '#7dffc4'
    case 'declining': return '#ff8ab0'
    default: return '#8ab4f8'
  }
})

function getConfidenceLevel(confidence: number): { text: string; color: string } {
  if (confidence >= 80) return { text: '极高', color: '#ffd700' }
  if (confidence >= 60) return { text: '较高', color: '#c8a0ff' }
  if (confidence >= 40) return { text: '中等', color: '#8ab4f8' }
  return { text: '一般', color: '#8899bb' }
}

const confidenceInfo = computed(() => getConfidenceLevel(prediction.value.confidence))

const trendBars = computed(() => {
  const polarities = patternAnalysis.value.polarityTrend.slice(-7)
  if (polarities.length === 0) return []
  
  const max = Math.max(...polarities, 1)
  const min = Math.min(...polarities, -1)
  const range = max - min || 1
  
  return polarities.map((p, i) => ({
    height: Math.max(10, ((p - min) / range) * 100),
    active: i === polarities.length - 1
  }))
})

const dominantMoods = computed(() => {
  return patternAnalysis.value.dominantPattern.slice(0, 3).map(mood => ({
    name: getStateDescription(mood),
    icon: getMoodIcon(mood)
  }))
})

function getMoodIcon(mood: string): string {
  const icons: Record<string, string> = {
    tranquil: '☽',
    joyful: '✦',
    confused: '◇',
    anticipating: '◈',
    relieved: '○',
    contemplative: '◉',
    anxious: '◆',
    sorrowful: '☾'
  }
  return icons[mood] || '○'
}

function getDayName(day: number): string {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return days[day] || ''
}
</script>

<template>
  <div class="prediction-panel">
    <div class="flex items-center gap-3 mb-4">
      <span class="text-lg" :style="{ color: trendColor }">{{ trendIcon }}</span>
      <div>
        <div class="text-sm font-serif-sc text-[#c8a0ff]">情绪预测</div>
        <div class="text-xs text-[#8899bb]">
          基于 {{ records.length }} 次占卜数据
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <div class="p-4 rounded-lg" style="background: rgba(20, 15, 40, 0.5);">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-[#8899bb]">预测下一情绪</span>
          <span class="text-xs px-2 py-0.5 rounded" :style="{ background: `${confidenceInfo.color}30`, color: confidenceInfo.color }">
            置信度 {{ confidenceInfo.text }}
          </span>
        </div>
        
        <div class="flex items-center gap-3 mb-3">
          <span class="text-2xl">{{ getMoodIcon(prediction.nextEmotion) }}</span>
          <div>
            <div class="text-lg font-serif-sc text-[#f0e6d0]">
              {{ getStateDescription(prediction.nextEmotion) }}
            </div>
            <div class="text-xs" :style="{ color: trendColor }">
              趋势: {{ trendText }}
            </div>
          </div>
        </div>

        <p class="text-xs text-[#c8d5f0] font-serif-sc leading-relaxed opacity-80">
          {{ prediction.insight }}
        </p>
      </div>

      <div class="p-3 rounded-lg" style="background: rgba(20, 50, 40, 0.3);">
        <div class="text-xs text-[#7dffc4] mb-1">推荐关注</div>
        <div class="text-sm text-[#c8d5f0] font-serif-sc">
          {{ prediction.recommendedFocus }}
        </div>
      </div>

      <div v-if="trendBars.length > 1" class="p-4 rounded-lg" style="background: rgba(15, 15, 30, 0.5);">
        <div class="text-xs text-[#8899bb] mb-3">近期情绪趋势</div>
        <div class="flex items-end justify-between gap-1 h-16">
          <div
            v-for="(bar, index) in trendBars"
            :key="index"
            class="flex-1 rounded-t transition-all duration-300"
            :style="{
              height: `${bar.height}%`,
              background: bar.active ? 'rgba(200, 160, 255, 0.8)' : 'rgba(100, 150, 255, 0.4)',
              minWidth: '8px'
            }"
          />
        </div>
        <div class="flex justify-between mt-2 text-[10px] text-[#8899bb]">
          <span>较早</span>
          <span>最近</span>
        </div>
      </div>

      <div v-if="dominantMoods.length > 0" class="p-3 rounded-lg" style="background: rgba(30, 20, 50, 0.3);">
        <div class="text-xs text-[#c8a0ff] mb-2">主导情绪模式</div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="mood in dominantMoods"
            :key="mood.name"
            class="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
            style="background: rgba(180, 100, 255, 0.2); color: #c8a0ff;"
          >
            <span>{{ mood.icon }}</span>
            <span>{{ mood.name }}</span>
          </span>
        </div>
      </div>

      <div v-if="temporalPatterns.length > 0" class="p-3 rounded-lg" style="background: rgba(15, 25, 40, 0.3);">
        <div class="text-xs text-[#8ab4f8] mb-2">占卜活跃时段</div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="pattern in temporalPatterns.slice(0, 3)"
            :key="`${pattern.dayOfWeek}-${pattern.hourOfDay}`"
            class="text-xs text-[#8899bb]"
          >
            {{ getDayName(pattern.dayOfWeek) }} {{ pattern.hourOfDay }}:00
            <span class="text-[#8ab4f8]">({{ pattern.frequency }}次)</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prediction-panel {
  width: 100%;
}

.font-serif-sc {
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
}
</style>
