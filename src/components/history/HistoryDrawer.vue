<script setup lang="ts">
import { computed, ref } from 'vue'
import { useReadingHistory } from '@/composables/data/useReadingHistory'
import EmotionStarMap from '@/components/emotion/EmotionStarMap.vue'
import EmotionPrediction from '@/components/emotion/EmotionPrediction.vue'
import HistoryEntry from '@/components/history/HistoryEntry.vue'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const { records, totalCount, clearAll, deleteRecord } = useReadingHistory()

const showConfirm = ref(false)

const hasRecords = computed(() => records.value.length > 0)

function handleClose() {
  emit('close')
}

function handleClearClick() {
  showConfirm.value = true
}

function handleConfirmClear() {
  clearAll()
  showConfirm.value = false
}

function handleCancelClear() {
  showConfirm.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div
        v-show="isOpen"
        class="fixed inset-0 z-40 bg-black/40"
        @click="handleClose"
      />
    </Transition>

    <Transition name="drawer">
      <div
        v-if="isOpen"
        class="fixed right-0 top-0 h-full z-50 flex flex-col"
        :class="[
          'w-[380px] max-md:w-full',
          'bg-[rgba(8,8,25,0.85)] backdrop-blur-[20px]',
          'border-l border-[rgba(100,150,255,0.3)]'
        ]"
      >
        <div class="md:hidden pt-2 pb-1 flex justify-center">
          <div class="w-10 h-1 rounded-full bg-[rgba(150,160,200,0.4)]"></div>
        </div>

        <div class="flex justify-between items-start p-5 pb-3">
          <div>
            <h2 class="text-lg font-cinzel text-[#a8c0ff] tracking-wider" style="text-shadow: 0 0 20px rgba(168, 192, 255, 0.6)">
              ◈ 情绪星档
            </h2>
            <p class="text-[10px] text-[#5a6a8a] mt-1 font-mono">{ {{ totalCount }} } 次占卜轨迹</p>
          </div>
          <button
            class="text-xl leading-none transition-all duration-200 hover:text-red-400 hover:shadow-[0_0_15px_rgba(255,100,100,0.6)]"
            @click="handleClose"
          >
            ✕
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-5 pb-4">
          <div class="mb-4">
            <EmotionStarMap :records="records" />
          </div>

          <div v-if="totalCount >= 3" class="mb-4">
            <EmotionPrediction />
          </div>

          <div class="border-t border-[rgba(100,120,180,0.2)] mb-4" />

          <h3 class="text-xs text-[#6b7a99] font-serif-sc mb-3 tracking-widest">占卜记录</h3>

          <div v-if="hasRecords" class="space-y-0">
            <HistoryEntry
              v-for="(record, idx) in records"
              :key="record.id"
              :record="record"
              :index="idx"
              @delete="(id) => deleteRecord(id)"
              @expand="() => { /* expand handler */ }"
            />
          </div>

          <div v-else class="flex flex-col items-center justify-center py-16 text-center">
            <div class="text-6xl mb-4 opacity-40">
              <span style="filter: blur(1px)">👻</span>
              <span style="filter: blur(0.5px); margin-left: -8px">✨</span>
            </div>
            <p class="text-sm text-[#5a6a8a]">暂无占卜轨迹</p>
            <p class="text-xs text-[#3a4a6a] mt-1">开始你的第一次占卜吧</p>
          </div>
        </div>

        <div v-if="hasRecords" class="p-4 border-t border-[rgba(100,120,180,0.15)]">
          <button
            class="w-full py-2 text-xs font-serif-sc text-[#5a6a8a] border border-[rgba(100,120,180,0.3)] rounded-lg transition-all duration-200 hover:border-[rgba(255,100,100,0.4)] hover:text-red-400/70 hover:bg-[rgba(255,100,100,0.05)]"
            @click="handleClearClick"
          >
            清除所有记录
          </button>
        </div>

        <Transition name="fade">
          <div
            v-if="showConfirm"
            class="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div class="bg-[rgba(15,15,35,0.95)] border border-[rgba(100,150,255,0.3)] rounded-xl p-5 mx-4 max-w-[280px] text-center">
              <p class="text-sm text-[#a8c0ff] mb-4">确定要清除所有记录吗？</p>
              <p class="text-xs text-[#5a6a8a] mb-4">此操作不可撤销</p>
              <div class="flex gap-3">
                <button
                  class="flex-1 py-2 text-xs text-[#5a6a8a] border border-[rgba(100,120,180,0.3)] rounded-lg transition-all hover:bg-[rgba(100,120,180,0.1)]"
                  @click="handleCancelClear"
                >
                  取消
                </button>
                <button
                  class="flex-1 py-2 text-xs text-[#ff8a9a] border border-[rgba(255,100,120,0.4)] rounded-lg transition-all hover:bg-[rgba(255,100,120,0.1)]"
                  @click="handleConfirmClear"
                >
                  确认清除
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.35s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
