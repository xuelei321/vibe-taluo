<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import TarotCard from '@/components/tarot/TarotCard.vue'
import OracleDialog from '@/components/chat/OracleDialog.vue'
import SpreadInsight from '@/components/tarot/SpreadInsight.vue'
import type { DrawnCard } from '@/composables/tarot/useTarotSpread'
import type { DialogMessage } from '@/composables/ai/useOracleAI'
import { useSettings } from '@/composables/data/useSettings'

interface Props {
  drawnCards?: DrawnCard[]
  messages?: DialogMessage[]
  isGenerating?: boolean
  currentCardIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  drawnCards: () => [],
  messages: () => [],
  isGenerating: false,
  currentCardIndex: -1
})

const emit = defineEmits<{
  (e: 'complete'): void
  (e: 'reset'): void
  (e: 'redraw'): void
}>()

const displayCards = ref<DrawnCard[]>([])
const isShuffling = ref(false)
const shufflePhase = ref<'cut' | 'riffle' | 'spread' | 'done'>('done')
const showCards = ref(false)
const showDialog = ref(false)

const { settings } = useSettings()
const enableAnimations = computed(() => settings.value.enableAnimations)

watch(() => props.drawnCards, (newCards) => {
  displayCards.value = newCards
}, { immediate: true })

watch(() => props.isGenerating, (generating) => {
  if (generating && !showDialog.value) {
    setTimeout(() => { showDialog.value = true }, 300)
  }
})

function runShuffleSequence() {
  if (!enableAnimations.value) {
    isShuffling.value = false
    shufflePhase.value = 'done'
    showCards.value = true
    showDialog.value = false
    return
  }

  isShuffling.value = true
  showCards.value = false
  showDialog.value = false

  shufflePhase.value = 'cut'
  setTimeout(() => { shufflePhase.value = 'riffle' }, 600)
  setTimeout(() => { shufflePhase.value = 'spread' }, 1200)
  setTimeout(() => {
    shufflePhase.value = 'done'
    isShuffling.value = false
    setTimeout(() => { showCards.value = true }, 100)
  }, 1800)
}

const handleDraw = () => {
  runShuffleSequence()
  emit('redraw')
}

watch(() => props.drawnCards.length, (length, oldLength) => {
  if (length > 0 && oldLength === 0) {
    runShuffleSequence()
  }
})

onMounted(() => {
  if (props.drawnCards.length === 0) {
    isShuffling.value = true
    shufflePhase.value = 'cut'
  } else {
    showCards.value = true
    showDialog.value = true
  }
})

</script>

<template>
  <div class="w-full max-w-[1100px] mx-auto">
    <Transition name="fade-fast">
      <div v-if="isShuffling" class="flex items-center justify-center py-12">
        <div class="relative h-[260px] w-[380px]">
          <template v-if="shufflePhase === 'cut' || shufflePhase === 'riffle'">
            <div class="absolute left-0 top-0 w-[160px] h-[220px]"
              :class="shufflePhase === 'riffle' ? 'shuffle-cut-left-active' : 'shuffle-cut-left'">
              <div v-for="i in 4" :key="'left-'+i"
                class="absolute rounded-lg border"
                :style="{ left: `${(i - 1) * 3}px`, top: `${(i - 1) * 2}px`, width: '150px', height: '200px',
                  background: 'rgba(20, 15, 50, 0.9)', borderColor: 'rgba(120, 80, 200, 0.5)',
                  boxShadow: '0 0 10px rgba(100, 50, 200, 0.2)' }">
                <div class="w-full h-full flex items-center justify-center opacity-30 text-2xl">✦</div>
              </div>
            </div>
            <div class="absolute right-0 top-0 w-[160px] h-[220px]"
              :class="shufflePhase === 'riffle' ? 'shuffle-cut-right-active' : 'shuffle-cut-right'">
              <div v-for="i in 3" :key="'right-'+i"
                class="absolute rounded-lg border"
                :style="{ left: `${(i - 1) * 3}px`, top: `${(i - 1) * 2}px`, width: '150px', height: '200px',
                  background: 'rgba(20, 15, 50, 0.9)', borderColor: 'rgba(120, 80, 200, 0.5)',
                  boxShadow: '0 0 10px rgba(100, 50, 200, 0.2)' }">
                <div class="w-full h-full flex items-center justify-center opacity-30 text-2xl">✦</div>
              </div>
            </div>
          </template>
          <template v-if="shufflePhase === 'spread'">
            <div v-for="i in 3" :key="'spread-'+i"
              class="shuffle-spread-card absolute rounded-lg border"
              :class="`shuffle-spread-${i - 1}`"
              :style="{ width: '150px', height: '200px', left: `${(i - 1) * 115}px`, top: '30px',
                background: 'rgba(20, 15, 50, 0.9)', borderColor: 'rgba(120, 80, 200, 0.5)',
                boxShadow: '0 0 15px rgba(100, 50, 200, 0.3)' }">
              <div class="w-full h-full flex items-center justify-center opacity-30 text-2xl">✦</div>
            </div>
          </template>
          <div class="absolute -bottom-6 left-0 right-0 text-center">
            <span class="text-sm text-[#8899bb] font-serif-sc" :class="enableAnimations ? 'animate-pulse' : ''">
              {{ shufflePhase === 'cut' ? '切牌中...' : shufflePhase === 'riffle' ? '洗牌中...' : shufflePhase === 'spread' ? '展开牌阵...' : '' }}
            </span>
          </div>
        </div>
      </div>
    </Transition>

    <div v-if="displayCards.length > 0" class="space-y-4">
      <Transition name="fade-slow">
        <div v-if="showCards" class="text-center">
          <div class="text-xs text-[#8ab4f8] tracking-[0.3em] opacity-80 font-serif-sc">命运的三牌阵</div>
        </div>
      </Transition>

      <div class="hidden lg:flex gap-6 items-start">
        <div class="shrink-0" style="width: 480px;">
          <Transition name="card-enter">
            <div v-if="showCards" class="flex flex-row justify-center items-end gap-3">
              <div v-for="(card, index) in displayCards" :key="index"
                class="flex flex-col items-center gap-1.5"
                :class="index === 1 ? '-mt-2' : ''"
              >
                <TarotCard
                  :drawn-card="card"
                  :index="index"
                  oracle-text=""
                  :is-oracle-complete="false"
                  :is-oracle-generating="false"
                />
                <span class="text-[10px] text-[#8899bb] font-serif-sc opacity-60">{{ card.positionLabel }}</span>
              </div>
            </div>
          </Transition>
        </div>

        <div class="flex-1 min-w-0">
          <Transition name="fade-slow">
            <div
              v-if="showDialog && messages.length > 0"
              class="rounded-2xl overflow-hidden flex flex-col"
              style="background: rgba(8, 8, 30, 0.7); border: 1px solid rgba(139, 92, 246, 0.2); backdrop-filter: blur(12px); height: 520px;"
            >
              <OracleDialog
                :messages="messages"
                :is-generating="isGenerating"
                :current-card-index="currentCardIndex"
              />
            </div>
            <div
              v-else-if="showCards"
              class="flex items-center justify-center rounded-2xl"
              style="background: rgba(8, 8, 30, 0.4); border: 1px solid rgba(139, 92, 246, 0.1); height: 520px;"
            >
              <div class="text-center space-y-3">
                <div class="text-2xl opacity-20" :class="enableAnimations ? 'animate-pulse' : ''">◈ ✦ ◈</div>
                <p class="text-xs text-[#5a6a8a] font-serif-sc">翻开卡牌，唤醒神谕</p>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <div class="lg:hidden space-y-4">
        <Transition name="card-enter">
          <div v-if="showCards" class="flex flex-row justify-center items-end gap-2">
            <div v-for="(card, index) in displayCards" :key="index"
              class="flex flex-col items-center gap-1"
              :class="index === 1 ? '-mt-1' : ''"
            >
              <TarotCard
                :drawn-card="card"
                :index="index"
                oracle-text=""
                :is-oracle-complete="false"
                :is-oracle-generating="false"
                :compact="true"
              />
              <span class="text-[9px] text-[#8899bb] font-serif-sc opacity-60">{{ card.positionLabel }}</span>
            </div>
          </div>
        </Transition>

        <Transition name="fade-slow">
          <div
            v-if="showDialog && messages.length > 0"
            class="rounded-2xl overflow-hidden flex flex-col"
            style="background: rgba(8, 8, 30, 0.7); border: 1px solid rgba(139, 92, 246, 0.2); backdrop-filter: blur(12px); height: 60vh; max-height: 500px;"
          >
            <OracleDialog
              :messages="messages"
              :is-generating="isGenerating"
              :current-card-index="currentCardIndex"
            />
          </div>
          <div
            v-else-if="showCards"
            class="flex items-center justify-center rounded-2xl"
            style="background: rgba(8, 8, 30, 0.4); border: 1px solid rgba(139, 92, 246, 0.1); height: 200px;"
          >
            <div class="text-center space-y-3">
              <div class="text-2xl opacity-20" :class="enableAnimations ? 'animate-pulse' : ''">◈ ✦ ◈</div>
              <p class="text-xs text-[#5a6a8a] font-serif-sc">翻开卡牌，唤醒神谕</p>
            </div>
          </div>
        </Transition>
      </div>

      <Transition name="fade-slow">
        <div v-if="showDialog && !isGenerating && messages.length > 0">
          <SpreadInsight :cards="displayCards" />
        </div>
      </Transition>

      <div class="flex justify-center pt-2 pb-4">
        <button @click="handleDraw"
          class="px-8 py-3 rounded-xl border-2 text-sm font-serif-sc transition-all duration-300 hover:scale-105 active:scale-95"
          style="background: rgba(80, 60, 160, 0.3); border-color: rgba(150, 100, 255, 0.6); color: #c8a0ff; box-shadow: 0 0 20px rgba(150, 100, 255, 0.3);">
          ✦ 重新抽牌 ✦
        </button>
      </div>
    </div>

    <div v-if="!isShuffling && displayCards.length === 0" class="flex items-center justify-center py-16">
      <div class="text-center space-y-4">
        <div class="text-3xl" :class="enableAnimations ? 'animate-pulse' : ''">⬡ ✦ ⬡</div>
        <div class="text-sm text-[#8899bb] font-serif-sc">正在准备牌阵...</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-fast-enter-active, .fade-fast-leave-active { transition: opacity 0.3s ease; }
.fade-fast-enter-from, .fade-fast-leave-to { opacity: 0; }

.fade-slow-enter-active, .fade-slow-leave-active { transition: opacity 0.5s ease, transform 0.5s ease; }
.fade-slow-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slow-enter-to { opacity: 1; transform: translateY(0); }
.fade-slow-leave-from { opacity: 1; transform: translateY(0); }
.fade-slow-leave-to { opacity: 0; transform: translateY(-10px); }

.card-enter-enter-active { transition: opacity 0.6s ease, transform 0.6s ease; }
.card-enter-enter-from { opacity: 0; transform: translateY(30px); }
.card-enter-enter-to { opacity: 1; transform: translateY(0); }

@keyframes cutLeft {
  0% { transform: translateX(0); }
  30% { transform: translateX(-30px); }
  100% { transform: translateX(-50px) rotate(-5deg); }
}

@keyframes cutRight {
  0% { transform: translateX(0); }
  30% { transform: translateX(30px); }
  100% { transform: translateX(50px) rotate(5deg); }
}

@keyframes riffleLeft {
  0%, 100% { transform: translateX(-50px) rotate(-5deg); }
  25% { transform: translateX(-10px) rotate(0deg); }
  50% { transform: translateX(20px) rotate(3deg); }
  75% { transform: translateX(-30px) rotate(-3deg); }
}

@keyframes riffleRight {
  0%, 100% { transform: translateX(50px) rotate(5deg); }
  25% { transform: translateX(10px) rotate(0deg); }
  50% { transform: translateX(-20px) rotate(-3deg); }
  75% { transform: translateX(30px) rotate(3deg); }
}

@keyframes spreadCard {
  0% { transform: translateY(-40px) scale(0.9); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}

.shuffle-cut-left { animation: cutLeft 0.5s ease-in-out forwards; }
.shuffle-cut-right { animation: cutRight 0.5s ease-in-out forwards; }
.shuffle-cut-left-active { animation: riffleLeft 0.6s ease-in-out 2; }
.shuffle-cut-right-active { animation: riffleRight 0.6s ease-in-out 2; }

.shuffle-spread-card { animation: spreadCard 0.5s ease-out forwards; opacity: 0; }
.shuffle-spread-0 { animation-delay: 0.15s; }
.shuffle-spread-1 { animation-delay: 0.3s; }
.shuffle-spread-2 { animation-delay: 0.45s; }

.font-serif-sc {
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
}
</style>
