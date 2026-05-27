<script setup lang="ts">
import { computed } from 'vue'
import type { ReadingRecord } from '@/composables/data/useReadingHistory'

interface Props {
  records: ReadingRecord[]
}

const props = defineProps<Props>()

const MAX_DISPLAY_RECORDS = 15

const SVG_HEIGHT = 160
const PADDING_VERTICAL = 20
const INNER_HEIGHT = SVG_HEIGHT - PADDING_VERTICAL * 2

const displayRecords = computed(() => {
  return props.records.slice(0, MAX_DISPLAY_RECORDS)
})

const hasRecords = computed(() => displayRecords.value.length > 0)

const averageIntensity = computed(() => {
  if (displayRecords.value.length === 0) return 0
  const sum = displayRecords.value.reduce((acc, record) => acc + record.emotionIntensity, 0)
  return Math.round(sum / displayRecords.value.length)
})

const lineColor = computed(() => {
  if (averageIntensity.value <= 30) {
    return '#7eb8f7'
  } else if (averageIntensity.value <= 60) {
    return '#c084fc'
  } else {
    return '#f87171'
  }
})

const gradientId = computed(() => `emotion-gradient-${Math.random().toString(36).slice(2, 9)}`)

const areaPath = computed(() => {
  if (displayRecords.value.length === 0) return ''

  const records = displayRecords.value
  const count = records.length
  const width = 100
  const stepX = width / (count - 1 || 1)

  let path = ''

  records.forEach((record, index) => {
    const x = index * stepX
    const y = PADDING_VERTICAL + INNER_HEIGHT - (record.emotionIntensity / 100) * INNER_HEIGHT

    if (index === 0) {
      path += `M ${x} ${SVG_HEIGHT} L ${x} ${y}`
    } else {
      path += ` L ${x} ${y}`
    }
  })

  const lastX = (count - 1) * stepX
  path += ` L ${lastX} ${SVG_HEIGHT} Z`

  return path
})

const linePath = computed(() => {
  if (displayRecords.value.length === 0) return ''

  const records = displayRecords.value
  const count = records.length
  const width = 100
  const stepX = width / (count - 1 || 1)

  let path = ''

  records.forEach((record, index) => {
    const x = index * stepX
    const y = PADDING_VERTICAL + INNER_HEIGHT - (record.emotionIntensity / 100) * INNER_HEIGHT

    if (index === 0) {
      path += `M ${x} ${y}`
    } else {
      path += ` L ${x} ${y}`
    }
  })

  return path
})

const circleData = computed(() => {
  if (displayRecords.value.length === 0) return []

  const records = displayRecords.value
  const count = records.length
  const width = 100
  const stepX = width / (count - 1 || 1)

  return records.map((record, index) => {
    const x = index * stepX
    const y = PADDING_VERTICAL + INNER_HEIGHT - (record.emotionIntensity / 100) * INNER_HEIGHT
    return {
      cx: x,
      cy: y,
      record
    }
  })
})

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}/${day} ${hours}:${minutes}`
}

function formatTooltip(record: ReadingRecord): string {
  return `${formatDate(record.timestamp)}\n情绪强度: ${record.emotionIntensity}`
}
</script>

<template>
  <div class="emotion-star-map">
    <svg
      v-if="hasRecords"
      viewBox="0 0 100 160"
      preserveAspectRatio="none"
      class="star-map-svg"
    >
      <defs>
        <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="lineColor" stop-opacity="0.3" />
          <stop offset="100%" :stop-color="lineColor" stop-opacity="0" />
        </linearGradient>
      </defs>

      <path
        :d="areaPath"
        :fill="`url(#${gradientId})`"
        class="area-path"
      />

      <path
        :d="linePath"
        :stroke="lineColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="line-path"
      />

      <g class="nodes-group">
        <circle
          v-for="(circle, index) in circleData"
          :key="index"
          :cx="circle.cx"
          :cy="circle.cy"
          r="4"
          :fill="lineColor"
          stroke="#ffffff"
          stroke-width="0.5"
          class="node-circle"
        >
          <title>{{ formatTooltip(circle.record) }}</title>
        </circle>
      </g>
    </svg>

    <div v-else class="empty-state">
      <span class="empty-text">尚无星档，等待你的第一次占卜...</span>
    </div>
  </div>
</template>

<style scoped>
.emotion-star-map {
  width: 100%;
  height: 160px;
  position: relative;
}

.star-map-svg {
  width: 100%;
  height: 100%;
}

.line-path {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: draw-line 1.5s ease-out forwards;
}

@keyframes draw-line {
  to {
    stroke-dashoffset: 0;
  }
}

.area-path {
  opacity: 0;
  animation: fade-in 0.5s ease-out 1s forwards;
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}

.node-circle {
  transition: r 0.2s ease;
  cursor: pointer;
}

.node-circle:hover {
  r: 6;
}

.empty-state {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-text {
  color: #8899bb;
  font-size: 12px;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
  opacity: 0.6;
}
</style>
