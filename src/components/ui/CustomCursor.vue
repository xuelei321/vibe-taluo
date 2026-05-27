<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useCursorState } from '@/composables/ui/useCursorState'

const cursorX = ref(0)
const cursorY = ref(0)
const followerX = ref(0)
const followerY = ref(0)
const isClicked = ref(false)
const isVisible = ref(false)
const isTouch = ref(false)

const { isOverCard } = useCursorState()

let rafId: number | null = null

const LERP = 0.22

const showCursor = computed(() => !isTouch.value)

const cursorSize = computed(() => isOverCard.value ? 28 : 16)
const cursorColor = computed(() => isOverCard.value ? 'rgba(180, 140, 255, 0.9)' : 'rgba(150, 200, 255, 0.9)')
const followerSize = computed(() => isOverCard.value ? 40 : 24)
const followerBorder = computed(() => isOverCard.value ? 'rgba(180, 140, 255, 0.6)' : 'rgba(150, 200, 255, 0.4)')
const followerShadow = computed(() => isOverCard.value ? '0 0 20px rgba(150, 80, 255, 0.5)' : 'none')

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function tick() {
  followerX.value = lerp(followerX.value, cursorX.value, LERP)
  followerY.value = lerp(followerY.value, cursorY.value, LERP)
  rafId = requestAnimationFrame(tick)
}

function onMove(e: MouseEvent) {
  cursorX.value = e.clientX
  cursorY.value = e.clientY
  isVisible.value = true
}

function onDown() { isClicked.value = true }
function onUp() { isClicked.value = false }
function onLeave() { isVisible.value = false }

onMounted(() => {
  isTouch.value = 'ontouchstart' in window
  if (isTouch.value) return

  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('mousedown', onDown, { passive: true })
  window.addEventListener('mouseup', onUp, { passive: true })
  document.addEventListener('mouseleave', onLeave)

  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mousedown', onDown)
  window.removeEventListener('mouseup', onUp)
  document.removeEventListener('mouseleave', onLeave)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div
    v-if="showCursor"
    class="cursor-root pointer-events-none fixed inset-0 z-[9999]"
    :style="{ opacity: isVisible ? 1 : 0 }"
  >
    <div
      class="cursor-main"
      :class="{ 'cursor-main--click': isClicked, 'cursor-main--glow': isOverCard }"
      :style="{
        left: `${cursorX}px`,
        top: `${cursorY}px`,
        width: `${cursorSize}px`,
        height: `${cursorSize}px`
      }"
    >
      <div class="cursor-line cursor-line-h" :style="{ background: cursorColor }" />
      <div class="cursor-line cursor-line-v" :style="{ background: cursorColor }" />
    </div>

    <div
      class="cursor-ring"
      :style="{
        left: `${followerX}px`,
        top: `${followerY}px`,
        width: `${followerSize}px`,
        height: `${followerSize}px`,
        borderColor: followerBorder,
        boxShadow: followerShadow
      }"
    />
  </div>
</template>

<style scoped>
.cursor-root {
  transition: opacity 0.15s ease;
}

.cursor-main {
  position: absolute;
  transform: translate(-50%, -50%);
  will-change: left, top;
}

.cursor-main--click {
  transform: translate(-50%, -50%) scale(1.25);
}

.cursor-main--glow {
  transform: translate(-50%, -50%) scale(1.5);
}

.cursor-line {
  position: absolute;
  transition: background 0.25s ease;
}

.cursor-line-h {
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  transform: translateY(-0.5px);
}

.cursor-line-v {
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  transform: translateX(-0.5px);
}

.cursor-ring {
  position: absolute;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1px solid;
  will-change: left, top;
  transition: width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
</style>
