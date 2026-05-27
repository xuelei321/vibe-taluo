<script setup lang="ts">
interface Props {
  onClick?: () => void
}

defineProps<Props>()
</script>

<template>
  <button
    class="fixed top-6 right-[140px] z-30 flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(139,92,246,0.3)] bg-[rgba(8,8,25,0.6)] backdrop-blur-md text-[#a78bfa] text-xs font-serif-sc transition-all duration-300 hover:border-[rgba(139,92,246,0.6)] hover:text-[#c4b5fd] hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
    @click="onClick"
  >
    <span class="text-sm">⚙</span>
    <span>神谕配置</span>
  </button>
</template>
