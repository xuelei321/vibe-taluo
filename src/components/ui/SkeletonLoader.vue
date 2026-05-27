<script setup lang="ts">
interface Props {
  type?: 'diary' | 'tarot'
}

withDefaults(defineProps<Props>(), {
  type: 'diary'
})
</script>

<template>
  <div class="skeleton-loader space-y-4 p-4">
    <div class="space-y-2">
      <div
        class="h-3 w-24 rounded-full animate-pulse"
        style="background: linear-gradient(90deg, rgba(40,50,80,0.4) 0%, rgba(80,100,160,0.3) 50%, rgba(40,50,80,0.4) 100%);"
      ></div>
      <div
        class="h-4 w-32 rounded-full animate-pulse"
        style="background: linear-gradient(90deg, rgba(40,50,80,0.4) 0%, rgba(80,100,160,0.3) 50%, rgba(40,50,80,0.4) 100%); animation-delay: 0.1s;"
      ></div>
    </div>

    <div
      class="h-px w-full rounded animate-pulse"
      style="background: linear-gradient(90deg, transparent, rgba(100,150,255,0.2), transparent);"
    ></div>

    <div v-if="type === 'diary'" class="space-y-3">
      <div
        class="h-2 w-full rounded animate-pulse"
        style="background: linear-gradient(90deg, rgba(40,50,80,0.4) 0%, rgba(80,100,160,0.3) 50%, rgba(40,50,80,0.4) 100%);"
      ></div>
      <div
        class="h-2 w-full rounded animate-pulse"
        style="background: linear-gradient(90deg, rgba(40,50,80,0.4) 0%, rgba(80,100,160,0.3) 50%, rgba(40,50,80,0.4) 100%); animation-delay: 0.15s;"
      ></div>
      <div
        class="h-2 w-3/4 rounded animate-pulse"
        style="background: linear-gradient(90deg, rgba(40,50,80,0.4) 0%, rgba(80,100,160,0.3) 50%, rgba(40,50,80,0.4) 100%); animation-delay: 0.3s;"
      ></div>
    </div>

    <div v-if="type === 'tarot'" class="flex justify-center gap-4 py-6">
      <div
        v-for="i in 3"
        :key="i"
        class="w-[140px] h-[220px] rounded-xl animate-pulse"
        :style="{
          background: 'linear-gradient(180deg, rgba(40,30,80,0.5) 0%, rgba(60,40,100,0.3) 50%, rgba(40,30,80,0.5) 100%)',
          border: '1px solid rgba(100,80,160,0.3)',
          animationDelay: `${i * 0.1}s`
        }"
      >
        <div class="w-full h-full flex items-center justify-center">
          <div
            class="text-3xl opacity-30 animate-pulse"
            :style="{ animationDelay: `${i * 0.2}s` }"
          >
            ✦
          </div>
        </div>
      </div>
    </div>

    <div class="text-center pt-2">
      <div
        class="h-2 w-24 mx-auto rounded-full animate-pulse"
        style="background: linear-gradient(90deg, rgba(40,50,80,0.3) 0%, rgba(80,100,160,0.2) 50%, rgba(40,50,80,0.3) 100%); animation-delay: 0.5s;"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-loader {
  max-width: 560px;
  margin: 0 auto;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}
</style>
