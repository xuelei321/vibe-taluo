<script setup lang="ts">
import { ref } from 'vue'
import StarField from './components/background/StarField.vue'
import AuraNebula from './components/background/AuraNebula.vue'
import ChatView from './components/chat/ChatView.vue'
import HistoryDrawer from './components/history/HistoryDrawer.vue'
import SettingsDrawer from './components/settings/SettingsDrawer.vue'
import SettingsButton from './components/settings/SettingsButton.vue'
import CustomCursor from './components/ui/CustomCursor.vue'
import { useSettings } from './composables/data/useSettings'

// 确保应用启动时立即同步模型配置到 window.__VITE_TALUO_CONFIG__
useSettings()

const isDrawerOpen = ref(false)
const isSettingsOpen = ref(false)

function openDrawer() {
  isDrawerOpen.value = true
}

function closeDrawer() {
  isDrawerOpen.value = false
}

function openSettings() {
  isSettingsOpen.value = true
}

function closeSettings() {
  isSettingsOpen.value = false
}
</script>

<template>
  <div class="w-screen h-screen overflow-hidden bg-[#050510] flex flex-col">
    <CustomCursor />
    <StarField />
    <AuraNebula />

    <!-- 右上角按钮组 -->
    <div class="fixed top-6 right-6 z-30 flex items-center gap-3">
      <SettingsButton :on-click="openSettings" />

      <button
        class="flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(100,150,255,0.3)] bg-[rgba(8,8,25,0.6)] backdrop-blur-md text-[#8b9dc3] text-xs font-serif-sc transition-all duration-300 hover:border-[rgba(100,150,255,0.6)] hover:text-[#a8c0ff] hover:shadow-[0_0_20px_rgba(100,150,255,0.2)]"
        @click="openDrawer">
        <span class="text-sm">✦</span>
        <span>情绪星档</span>
      </button>
    </div>

    <!-- 历史抽屉 -->
    <HistoryDrawer :is-open="isDrawerOpen" @close="closeDrawer" />

    <!-- 设置抽屉 -->
    <SettingsDrawer :is-open="isSettingsOpen" @close="closeSettings" />

    <!-- 主聊天区域 -->
    <div class="relative z-10 flex-1 flex flex-col min-h-0">
      <ChatView @open-drawer="openDrawer" />
    </div>
  </div>
</template>

<style>
.font-serif-sc {
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
}
</style>
