<script setup lang="ts">
import { useMotion } from '@vueuse/motion'
import { ref } from 'vue'

const cardRef = ref<HTMLElement | null>(null)

useMotion(cardRef, {
  initial: { opacity: 0, y: 30 },
  enter: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOutCubic' }
})
</script>

<template>
  <div ref="cardRef" class="max-w-[560px] w-[95vw] sm:w-[90vw] min-h-[320px] glass neon-border rounded-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden">
    <div class="text-xs text-blue-400/60 text-center mb-4 font-cinzel tracking-[0.3em]">
      ⬡ ✦ ⬡
    </div>
    
    <h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-cinzel font-bold text-center mb-2 text-mystic glow-text tracking-wider">
      THE MOOD MIRROR TAROT
    </h1>
    
    <p class="text-sm text-blue-300/70 text-center mb-6 font-noto-serif-sc tracking-widest">
      情绪镜像 · 潜意识解析
    </p>
    
    <div class="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mb-6"></div>
    
    <slot />
    
    <div class="mt-6 text-center">
      <p class="text-xs text-slate-500 animate-pulse font-noto-serif-sc">
        ✧ 触碰卡片开始占卜 ✧
      </p>
    </div>
  </div>
</template>
