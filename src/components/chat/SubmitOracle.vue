<script setup lang="ts">
interface Props {
  onClick?: () => void
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false
})
</script>

<template>
  <button
    class="px-6 py-3 rounded-xl border border-[rgba(139,92,246,0.5)] bg-[rgba(139,92,246,0.2)] text-[#c8a0ff] text-sm font-serif-sc transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-[rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
    :disabled="disabled"
    @click="onClick"
  >
    ✦ 提交神谕 ✦
  </button>
</template>
