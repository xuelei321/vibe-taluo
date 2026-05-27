<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DrawnCard } from '@/composables/tarot/useTarotSpread'
import { analyzeSpread, ELEMENT_DESCRIPTIONS, type SpreadAnalysis } from '@/composables/tarot/useSpreadAnalysis'

interface Props {
  cards: DrawnCard[]
}

const props = defineProps<Props>()

const isExpanded = ref(false)

const analysis = computed<SpreadAnalysis | null>(() => {
  if (props.cards.length < 3) return null
  return analyzeSpread(props.cards)
})

const energyFlowIcon = computed(() => {
  if (!analysis.value) return ''
  switch (analysis.value.energyFlow) {
    case 'ascending': return '⬆'
    case 'descending': return '⬇'
    case 'balanced': return '⚖'
    case 'blocked': return '⊘'
    default: return '○'
  }
})

const energyFlowText = computed(() => {
  if (!analysis.value) return ''
  switch (analysis.value.energyFlow) {
    case 'ascending': return '上升能量'
    case 'descending': return '下降能量'
    case 'balanced': return '平衡流动'
    case 'blocked': return '能量阻滞'
    default: return '未知'
  }
})

const trendIndicator = computed(() => {
  if (!analysis.value) return { icon: '○', text: '未知', color: '#888' }
  
  const score = analysis.value.synchronicityScore
  if (score >= 80) return { icon: '✦', text: '极高', color: '#ffd700' }
  if (score >= 60) return { icon: '◈', text: '较高', color: '#c8a0ff' }
  if (score >= 40) return { icon: '◇', text: '中等', color: '#8ab4f8' }
  return { icon: '○', text: '一般', color: '#8899bb' }
})

function getElementIcon(element: string): string {
  const icons: Record<string, string> = {
    fire: '🔥',
    water: '💧',
    air: '💨',
    earth: '🌍',
    spirit: '✨'
  }
  return icons[element] || '✦'
}

function getRelationIcon(type: 'supporting' | 'challenging' | 'neutral'): string {
  switch (type) {
    case 'supporting': return '◈'
    case 'challenging': return '◆'
    case 'neutral': return '◇'
    default: return '○'
  }
}
</script>

<template>
  <div v-if="analysis" class="spread-analysis-container">
    <button
      @click="isExpanded = !isExpanded"
      class="w-full py-3 px-4 rounded-lg border transition-all duration-300 flex items-center justify-between"
      :style="{
        background: 'rgba(20, 15, 40, 0.6)',
        borderColor: isExpanded ? 'rgba(200, 160, 255, 0.5)' : 'rgba(100, 150, 255, 0.3)'
      }"
    >
      <div class="flex items-center gap-3">
        <span class="text-lg" :style="{ color: trendIndicator.color }">{{ trendIndicator.icon }}</span>
        <div class="text-left">
          <div class="text-sm font-serif-sc text-[#c8a0ff]">牌阵深度分析</div>
          <div class="text-xs text-[#8899bb] opacity-70">
            共时性评分: {{ analysis.synchronicityScore }}/100 · {{ energyFlowText }}
          </div>
        </div>
      </div>
      <span
        class="text-[#8899bb] transition-transform duration-300"
        :class="{ 'rotate-180': isExpanded }"
      >
        ▼
      </span>
    </button>

    <Transition name="expand">
      <div v-if="isExpanded" class="mt-4 space-y-4 insight-content">
        <div class="insight-item p-4 rounded-lg" style="background: rgba(15, 20, 40, 0.5); animation-delay: 0.05s;">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-xl">{{ energyFlowIcon }}</span>
            <span class="text-sm font-serif-sc text-[#8ab4f8]">能量流动分析</span>
          </div>
          
          <div class="flex flex-wrap gap-2 mb-3">
            <div
              v-for="(count, element) in analysis.elementDistribution"
              :key="element"
              class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              :style="{
                background: `${ELEMENT_DESCRIPTIONS[element].color}20`,
                borderColor: `${ELEMENT_DESCRIPTIONS[element].color}50`
              }"
              :class="analysis.dominantElement === element ? 'ring-2' : ''"
            >
              <span>{{ getElementIcon(element) }}</span>
              <span :style="{ color: ELEMENT_DESCRIPTIONS[element].color }">
                {{ ELEMENT_DESCRIPTIONS[element].name }}
              </span>
              <span class="text-[#8899bb]">×{{ count }}</span>
            </div>
          </div>

          <div v-if="analysis.cardRelations.length > 0" class="space-y-2">
            <div class="text-xs text-[#8899bb] mb-2">牌阵关系</div>
            <div
              v-for="(relation, index) in analysis.cardRelations"
              :key="index"
              class="flex items-start gap-2 p-2 rounded"
              style="background: rgba(0,0,0,0.2);"
            >
              <span
                class="mt-0.5"
                :style="{ color: relation.type === 'supporting' ? '#7dffc4' : relation.type === 'challenging' ? '#ff8ab0' : '#8899bb' }"
              >
                {{ getRelationIcon(relation.type) }}
              </span>
              <div class="flex-1 text-xs">
                <div class="text-[#c8d5f0] font-serif-sc">
                  {{ relation.fromCard.card.name }} → {{ relation.toCard.card.name }}
                </div>
                <div class="text-[#8899bb] opacity-70">{{ relation.relationship }}</div>
              </div>
              <span class="text-[10px] text-[#8899bb]">{{ relation.strength }}%</span>
            </div>
          </div>
        </div>

        <div class="insight-item p-4 rounded-lg" style="background: rgba(30, 20, 50, 0.5); animation-delay: 0.15s;">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-lg">◈</span>
            <span class="text-sm font-serif-sc text-[#c8a0ff]">叙事弧线</span>
          </div>
          <p class="text-sm text-[#c8d5f0] font-serif-sc leading-relaxed">
            {{ analysis.narrativeArc }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="insight-item p-4 rounded-lg" style="background: rgba(20, 50, 40, 0.5); animation-delay: 0.25s;">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-lg text-[#7dffc4]">✦</span>
              <span class="text-sm font-serif-sc text-[#7dffc4]">行动建议</span>
            </div>
            <p class="text-sm text-[#c8d5f0] font-serif-sc leading-relaxed">
              {{ analysis.advice }}
            </p>
          </div>

          <div v-if="analysis.warnings.length > 0" class="insight-item p-4 rounded-lg" style="background: rgba(50, 20, 30, 0.5); animation-delay: 0.35s;">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-lg text-[#ff8ab0]">◆</span>
              <span class="text-sm font-serif-sc text-[#ff8ab0]">需要注意</span>
            </div>
            <ul class="space-y-1">
              <li
                v-for="(warning, index) in analysis.warnings"
                :key="index"
                class="text-xs text-[#ffb0c0] font-serif-sc"
              >
                · {{ warning }}
              </li>
            </ul>
          </div>
        </div>

        <div v-if="analysis.dominantElement" class="insight-item p-4 rounded-lg" style="background: rgba(15, 15, 30, 0.5); animation-delay: 0.45s;">
          <div class="text-xs text-[#8899bb] mb-2">{{ analysis.dominantElement }} 主导能量特质</div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="trait in ELEMENT_DESCRIPTIONS[analysis.dominantElement].traits"
              :key="trait"
              class="text-xs px-2 py-1 rounded"
              :style="{
                background: `${ELEMENT_DESCRIPTIONS[analysis.dominantElement].color}20`,
                color: ELEMENT_DESCRIPTIONS[analysis.dominantElement].color
              }"
            >
              {{ trait }}
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px;
}

.insight-content .insight-item {
  opacity: 0;
  transform: translateY(16px);
  animation: insight-stagger 0.5s ease-out forwards;
}

.insight-content .insight-item:nth-child(1) { animation-delay: 0.05s; }
.insight-content .insight-item:nth-child(2) { animation-delay: 0.15s; }
.insight-content .insight-item:nth-child(3) { animation-delay: 0.25s; }
.insight-content :nth-child(3) .insight-item:last-child { animation-delay: 0.35s; }
.insight-content .insight-item:nth-child(4) { animation-delay: 0.45s; }

@keyframes insight-stagger {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.font-serif-sc {
  font-family: 'Noto Serif SC', 'Source Han Serif SC', serif;
}
</style>
