<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DrawnCard } from '@/composables/tarot/useTarotSpread'
import { getSuitColor } from '@/data/tarotCards'
import { useCursorState } from '@/composables/ui/useCursorState'
import { useSettings } from '@/composables/data/useSettings'
import OracleTypewriter from '@/components/chat/OracleTypewriter.vue'

interface Props {
  drawnCard: DrawnCard
  index: number
  oracleText?: string
  isOracleComplete?: boolean
  isOracleGenerating?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  oracleText: '',
  isOracleComplete: false,
  isOracleGenerating: false,
  compact: false
})

const isFlipped = ref(false)
const isOracleExpanded = ref(false)
const { setCardHover } = useCursorState()
const { settings } = useSettings()

const enableAnimations = computed(() => settings.value.enableAnimations)

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

const toggleOracleExpand = (e: Event) => {
  e.stopPropagation()
  isOracleExpanded.value = !isOracleExpanded.value
}

const cardColors = computed(() => {
  const card = props.drawnCard.card
  if (card.arcana === 'major') {
    return {
      bg: 'rgba(120, 60, 180, 0.25)',
      border: 'rgba(180, 100, 255, 0.5)',
      glow: 'rgba(150, 80, 255, 0.4)',
      text: '#c8a0ff'
    }
  }
  return getSuitColor(card.suit)
})

const cardBackTheme = computed(() => {
  const card = props.drawnCard.card
  if (card.arcana === 'major') {
    return {
      bg: '#0d0820',
      border: 'rgba(150, 100, 255, 0.6)',
      accent: '#c9a84c',
      accent2: 'rgba(150, 100, 255, 0.4)',
      symbol: '✦'
    }
  }
  switch (card.suit) {
    case 'wands':
      return { bg: '#1a0c04', border: 'rgba(255, 150, 80, 0.6)', accent: '#ff9040', accent2: 'rgba(255, 120, 60, 0.4)', symbol: '🔥' }
    case 'cups':
      return { bg: '#040d1a', border: 'rgba(100, 150, 255, 0.6)', accent: '#6090ff', accent2: 'rgba(80, 130, 255, 0.4)', symbol: '💧' }
    case 'swords':
      return { bg: '#0a0d12', border: 'rgba(160, 190, 220, 0.55)', accent: '#a8c8e8', accent2: 'rgba(140, 180, 220, 0.35)', symbol: '🗡' }
    case 'pentacles':
      return { bg: '#08140a', border: 'rgba(120, 200, 150, 0.55)', accent: '#70c080', accent2: 'rgba(100, 180, 120, 0.35)', symbol: '⬠' }
    default:
      return { bg: '#0d0820', border: 'rgba(150, 100, 255, 0.6)', accent: '#c9a84c', accent2: 'rgba(150, 100, 255, 0.4)', symbol: '✦' }
  }
})

const orientationText = computed(() => props.drawnCard.isReversed ? '逆位' : '正位')
const orientationSymbol = computed(() => props.drawnCard.isReversed ? '⬡' : '◈')
const orientationColor = computed(() => props.drawnCard.isReversed ? '#ff8ab0' : '#7dffc4')

const cardRotation = computed(() => {
  const rotations = [-8, 0, 8]
  return rotations[props.index] || 0
})

const getMotionConfig = () => {
  const configs = [
    { x: -80, y: 60, rotate: -12, delay: 100 },
    { x: 0, y: 80, rotate: 0, delay: 400 },
    { x: 80, y: 60, rotate: 12, delay: 700 }
  ]
  return configs[props.index] || configs[1]
}
</script>

<template>
  <div
    class="tarot-card-wrapper"
    v-motion
    :initial="enableAnimations ? { opacity: 0, x: getMotionConfig().x, y: getMotionConfig().y, rotate: getMotionConfig().rotate } : {}"
    :enter="enableAnimations ? { opacity: 1, x: 0, y: 0, rotate: cardRotation } : { opacity: 1 }"
    :delay="enableAnimations ? getMotionConfig().delay : 0"
    :duration="enableAnimations ? 800 : 0"
    :easing="(t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2"
    @mouseenter="setCardHover(true)"
    @mouseleave="setCardHover(false)"
  >
    <div
      class="tarot-card-container cursor-pointer perspective-1000"
      :class="compact
        ? 'w-[100px] h-[160px] md:w-[120px] md:h-[190px]'
        : 'w-[140px] h-[220px] md:w-[160px] md:h-[260px]'"
      @click="toggleFlip"
    >
      <div
        class="card-flip w-full h-full transition-transform duration-[800ms] ease-in-out transform-style-preserve-3d"
        :class="{ 'no-animation': !enableAnimations }"
        :style="{ 
          transform: `rotateY(${isFlipped ? 180 : 0}deg) rotate(${cardRotation}deg)`,
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        }"
      >
        <div class="card-back absolute w-full h-full backface-hidden rounded-xl overflow-hidden">
          <div class="absolute inset-0" :style="{ background: cardBackTheme.bg }"></div>
          <div class="absolute inset-0 rounded-xl" :style="{ border: `1.5px solid ${cardBackTheme.border}` }"></div>

          <div class="absolute inset-0 flex items-center justify-center">
            <div class="relative w-20 h-20 md:w-24 md:h-24">
              <div class="absolute inset-0 border opacity-30" :style="{ borderColor: cardBackTheme.accent }" style="transform: rotate(0deg);"></div>
              <div class="absolute inset-0 border opacity-30" :style="{ borderColor: cardBackTheme.accent }" style="transform: rotate(45deg);"></div>
              <div class="absolute inset-0 border opacity-20" :style="{ borderColor: cardBackTheme.accent }" style="transform: rotate(22.5deg);"></div>
              <div class="absolute inset-0 border opacity-20" :style="{ borderColor: cardBackTheme.accent }" style="transform: rotate(67.5deg);"></div>
              <div class="absolute inset-3 border" :style="{ borderColor: cardBackTheme.accent2 }" style="transform: rotate(0deg);"></div>
              <div class="absolute inset-3 border" :style="{ borderColor: cardBackTheme.accent2 }" style="transform: rotate(90deg);"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xl md:text-2xl opacity-50" :class="{ 'animate-spin': enableAnimations }" :style="{ color: cardBackTheme.accent, animationDuration: '20s' }">{{ cardBackTheme.symbol }}</span>
              </div>
            </div>
          </div>

          <div class="absolute inset-2 rounded-lg pointer-events-none">
            <svg class="w-full h-full opacity-25" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 5 15 L 5 5 L 15 5" fill="none" :stroke="cardBackTheme.accent" stroke-width="0.5" />
              <path d="M 95 5 L 85 5 L 85 15" fill="none" :stroke="cardBackTheme.accent" stroke-width="0.5" />
              <path d="M 5 85 L 5 95 L 15 95" fill="none" :stroke="cardBackTheme.accent" stroke-width="0.5" />
              <path d="M 95 95 L 85 95 L 85 85" fill="none" :stroke="cardBackTheme.accent" stroke-width="0.5" />
            </svg>
          </div>

          <div class="absolute bottom-2 md:bottom-3 left-0 right-0 text-center">
            <span class="text-[10px] md:text-xs font-serif-sc opacity-40 tracking-[0.2em] md:tracking-[0.3em]" :style="{ color: cardBackTheme.accent }">TAROT</span>
          </div>

          <div class="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none"
            :style="{ boxShadow: `0 0 35px ${cardBackTheme.accent2}, inset 0 0 35px ${cardBackTheme.accent2}` }"></div>
        </div>

        <div class="card-front absolute w-full h-full backface-hidden rounded-xl overflow-hidden"
          style="transform: rotateY(180deg);">
          <div class="absolute inset-0" style="background: linear-gradient(180deg, #080820 0%, #0d0f30 100%);"></div>
          <div class="absolute inset-0 rounded-xl pointer-events-none" style="border: 1.5px solid rgba(200, 160, 80, 0.7);"></div>

          <div class="relative w-full h-full flex flex-col items-center justify-center p-3 md:p-4 space-y-1 md:space-y-2">
            <div class="text-[10px] md:text-xs text-[#8ab4f8] opacity-90 font-serif-sc tracking-wide">
              {{ drawnCard.positionLabel }}
            </div>
            <div class="text-3xl md:text-4xl text-[#c9a84c] drop-shadow-lg">{{ drawnCard.card.icon }}</div>
            <div class="text-sm md:text-base font-serif-sc text-[#f0e6d0] text-center leading-tight">{{ drawnCard.card.name }}</div>
            <div class="text-[10px] md:text-xs text-[#8899bb] tracking-[0.15em] md:tracking-[0.2em] text-center">{{ drawnCard.card.nameEn }}</div>

            <div class="flex items-center gap-1 text-xs">
              <span :style="{ color: orientationColor }">{{ orientationSymbol }}</span>
              <span class="font-serif-sc" :style="{ color: orientationColor }">{{ orientationText }}</span>
            </div>

            <div class="w-3/4 h-px opacity-40" style="background: linear-gradient(90deg, transparent, rgba(200, 160, 80, 0.5), transparent);"></div>

            <div class="flex flex-wrap justify-center gap-1">
              <span v-for="(keyword, kwIndex) in drawnCard.card.keywords" :key="kwIndex"
                class="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full"
                :style="{ background: cardColors.bg, border: `1px solid ${cardColors.border}`, color: cardColors.text }">
                {{ keyword }}
              </span>
            </div>

            <div v-if="!compact" class="absolute bottom-0 left-0 right-0 p-1.5 md:p-2 bg-black bg-opacity-60">
              <div class="relative">
                <OracleTypewriter :text="oracleText" :is-complete="isOracleComplete" :is-generating="isOracleGenerating" />
                <button
                  v-if="isOracleComplete && oracleText"
                  class="md:hidden absolute -top-5 right-1 text-[10px] text-[#8ab4f8] opacity-60 font-serif-sc"
                  @click="toggleOracleExpand"
                >
                  {{ isOracleExpanded ? '收起' : '展开' }}
                </button>
              </div>
            </div>
          </div>

          <div class="absolute inset-0 rounded-xl pointer-events-none opacity-40"
            :style="`box-shadow: 0 0 20px ${cardColors.glow}, 0 0 40px ${cardColors.glow}40;`"></div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="oracle-overlay">
        <div v-if="isOracleExpanded" class="fixed inset-0 z-[80] flex items-end md:hidden">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="isOracleExpanded = false"></div>
          <div class="relative w-full max-h-[70vh] overflow-y-auto rounded-t-2xl p-5 pb-8"
            style="background: rgba(12, 8, 30, 0.98); border-top: 1px solid rgba(150, 100, 255, 0.4);">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-xl">{{ drawnCard.card.icon }}</span>
                <span class="text-sm font-serif-sc text-[#c8a0ff]">{{ drawnCard.card.name }} · {{ drawnCard.positionLabel }}</span>
              </div>
              <button class="text-[#8899bb] text-lg" @click="isOracleExpanded = false">✕</button>
            </div>
            <p class="text-sm text-[#c8d5f0] font-serif-sc leading-[2] whitespace-pre-wrap">{{ oracleText }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.perspective-1000 { perspective: 1000px; }
.transform-style-preserve-3d { transform-style: preserve-3d; }
.backface-hidden { backface-visibility: hidden; }

.tarot-card-container:hover { filter: brightness(1.1); }
.tarot-card-container { transition: filter 0.3s ease; }
.tarot-card-wrapper { will-change: transform, opacity; }

.no-animation { transition: none !important; }

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin { animation: spin-slow 20s linear infinite; }

.oracle-overlay-enter-active { transition: all 0.3s ease; }
.oracle-overlay-leave-active { transition: all 0.25s ease; }
.oracle-overlay-enter-from,
.oracle-overlay-leave-to { opacity: 0; }
.oracle-overlay-enter-from .relative,
.oracle-overlay-leave-to .relative { transform: translateY(100%); }

.font-serif-sc {
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
}
</style>
