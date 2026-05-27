<script setup lang="ts">
</script>

<template>
  <div class="fixed inset-0 z-1 pointer-events-none flex items-center justify-center">
    <div class="relative">
      <div class="absolute w-[600px] h-[300px] rounded-full bg-gradient-to-r from-purple-900/20 to-indigo-900/20 blur-3xl"></div>
      
      <div class="absolute w-[400px] h-[200px] rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-2xl animate-breathe"></div>
      
      <div 
        class="absolute w-[200px] h-[100px] rounded-full bg-gradient-to-r from-indigo-400/30 to-blue-400/30 blur-xl animate-breathe"
        style="animation-delay: 1s"
      ></div>
    </div>
  </div>
</template>
