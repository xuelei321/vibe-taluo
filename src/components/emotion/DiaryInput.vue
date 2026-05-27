<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import EmotionBadge from '@/components/emotion/EmotionBadge.vue'
import { useEmotionDetector } from '@/composables/emotion/useEmotionDetector'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'submit': []
}>()

const maxLength = 500
const minLengthToSubmit = 20

const diaryText = ref(props.modelValue)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const isFocused = ref(false)

const { detectedEmotions, emotionIntensity } = useEmotionDetector(diaryText)

const charCount = computed(() => diaryText.value.length)

const charCountColor = computed(() => {
  if (charCount.value > 500) return '#ff4466'
  if (charCount.value > 400) return '#ff4466'
  if (charCount.value > 200) return '#ff9f40'
  return '#445566'
})

const canSubmit = computed(() => charCount.value >= minLengthToSubmit)

const showEmotions = computed(() => detectedEmotions.value.length > 0)

const progressBarColor = computed(() => {
  const intensity = emotionIntensity.value
  if (intensity < 33) return 'from-blue-500 to-blue-400'
  if (intensity < 66) return 'from-blue-500 via-purple-500 to-purple-400'
  return 'from-purple-500 via-pink-500 to-red-400'
})

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  const value = target.value

  if (value.length > maxLength) {
    diaryText.value = value.slice(0, maxLength)
    emit('update:modelValue', diaryText.value)
  } else {
    diaryText.value = value
    emit('update:modelValue', value)
  }

  autoResize()
}

function autoResize() {
  const textarea = textareaRef.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`
  }
}

function handleFocus() {
  isFocused.value = true
}

function handleBlur() {
  isFocused.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && event.ctrlKey && canSubmit.value) {
    event.preventDefault()
    emit('submit')
  }
}

watch(() => props.modelValue, (newValue) => {
  diaryText.value = newValue
  nextTick(autoResize)
})

onMounted(() => {
  nextTick(autoResize)
})

function handleSubmit() {
  if (canSubmit.value) {
    emit('submit')
  }
}

defineExpose({
  focus: () => textareaRef.value?.focus(),
  submit: handleSubmit,
})
</script>

<template>
  <div class="relative space-y-3">
    <div
      class="relative transition-all duration-300"
      :class="{
        'shadow-[0_0_20px_rgba(100,150,255,0.3)]': isFocused,
      }"
    >
      <textarea
        ref="textareaRef"
        :value="diaryText"
        :placeholder="`今天，你的内心在经历什么？\n写下任何感受——喜悦、疲倦、迷茫、愤怒，或者只是一种你说不清楚的情绪...`"
        class="w-full bg-transparent outline-none border-none border-b-2 py-3 px-1 text-[#c8d5f0] text-xs sm:text-sm leading-[1.8] resize-none font-serif-sc min-h-[100px] sm:min-h-[120px] transition-colors duration-300"
        :class="{
          'border-[rgba(100,150,255,0.3)]': !isFocused,
          'border-[rgba(100,150,255,0.8)]': isFocused,
        }"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />

      <div
        class="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300"
        :class="{
          'opacity-0': !isFocused,
          'opacity-100': isFocused,
        }"
        style="box-shadow: 0 0 10px rgba(100,150,255,0.8), 0 0 20px rgba(100,150,255,0.4);"
      />
    </div>

    <div class="flex justify-end">
      <span
        class="text-xs font-serif-sc transition-colors duration-200"
        :style="{ color: charCountColor }"
      >
        {{ charCount }}/{{ maxLength }}
      </span>
    </div>

    <TransitionGroup
      v-if="showEmotions"
      name="badge"
      tag="div"
      class="space-y-2"
    >
      <div
        key="title"
        class="text-xs text-[rgba(100,180,255,0.6)] font-serif-sc"
      >
        感应到的情绪波动：
      </div>

      <div
        key="badges"
        class="flex flex-wrap gap-2"
      >
        <EmotionBadge
          v-for="(emotion, index) in detectedEmotions"
          :key="index"
          :word="emotion.word"
          :type="emotion.type"
          :color="emotion.color"
        />
      </div>

      <div
        key="progress"
        class="pt-2"
      >
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500/50 font-serif-sc">情绪强度</span>
          <div class="flex-1 h-1 bg-void-700/50 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out"
              :class="progressBarColor"
              :style="{ width: `${emotionIntensity}%` }"
            />
          </div>
          <span class="text-xs text-gray-400/60">{{ emotionIntensity }}%</span>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
textarea::placeholder {
  color: rgba(60, 80, 100, 0.6);
}

textarea::-webkit-scrollbar {
  width: 4px;
}

textarea::-webkit-scrollbar-track {
  background: transparent;
}

textarea::-webkit-scrollbar-thumb {
  background: rgba(100, 150, 255, 0.3);
  border-radius: 2px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 150, 255, 0.5);
}

.badge-enter-active {
  transition: all 0.3s ease-out;
}

.badge-leave-active {
  transition: all 0.2s ease-in;
}

.badge-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.badge-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.badge-move {
  transition: transform 0.3s ease;
}
</style>
