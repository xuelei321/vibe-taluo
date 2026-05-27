<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSettings, type ModelConfig, type ModelProvider, validateModelConfig, createModelConfig } from '@/composables/data/useSettings'

interface Props {
  isOpen: boolean
}

const emit = defineEmits<{
  close: []
}>()

const { settings, models, activeModel, addModel, updateModel, deleteModel, setActiveModel } = useSettings()

const editingModel = ref<ModelConfig | null>(null)
const isCreating = ref(false)
const validationErrors = ref<string[]>([])
const toast = ref<{ show: boolean; message: string; type: 'success' | 'error' }>({
  show: false,
  message: '',
  type: 'success'
})
const showDeleteConfirm = ref(false)
const modelToDelete = ref<string | null>(null)
const activeTab = ref<'models' | 'general'>('models')

const providerOptions: { value: ModelProvider; label: string }[] = [
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'custom', label: '自定义' }
]

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

function handleClose() {
  emit('close')
  setTimeout(() => {
    editingModel.value = null
    isCreating.value = false
    validationErrors.value = []
  }, 300)
}

function handleCreateModel() {
  editingModel.value = createModelConfig()
  isCreating.value = true
  validationErrors.value = []
}

function handleEditModel(model: ModelConfig) {
  editingModel.value = { ...model }
  isCreating.value = false
  validationErrors.value = []
}

function handleCancelEdit() {
  editingModel.value = null
  isCreating.value = false
  validationErrors.value = []
}

function handleSaveModel() {
  if (!editingModel.value) return

  const validation = validateModelConfig(editingModel.value)
  if (!validation.valid) {
    validationErrors.value = validation.errors
    showToast(validation.errors[0], 'error')
    return
  }

  if (isCreating.value) {
    addModel(editingModel.value)
    showToast('模型创建成功')
  } else {
    updateModel(editingModel.value.id, editingModel.value)
    showToast('模型更新成功')
  }

  editingModel.value = null
  isCreating.value = false
  validationErrors.value = []
}

function handleDeleteClick(id: string) {
  modelToDelete.value = id
  showDeleteConfirm.value = true
}

function handleConfirmDelete() {
  if (modelToDelete.value) {
    deleteModel(modelToDelete.value)
    showToast('模型已删除')
    modelToDelete.value = null
    showDeleteConfirm.value = false
  }
}

function handleCancelDelete() {
  modelToDelete.value = null
  showDeleteConfirm.value = false
}

function handleSetActive(id: string) {
  setActiveModel(id)
  showToast('已切换为当前使用模型')
}

function updateSliderValue(field: 'temperature' | 'maxTokens' | 'topP', event: Event) {
  if (!editingModel.value) return
  const value = parseFloat((event.target as HTMLInputElement).value)
  editingModel.value[field] = value
}

function getProviderLabel(provider: ModelProvider): string {
  return providerOptions.find(p => p.value === provider)?.label || provider
}

const props = defineProps<Props>()
watch(() => props.isOpen, (open) => {
  if (open) {
    editingModel.value = null
    isCreating.value = false
    validationErrors.value = []
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-show="isOpen" class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" @click="handleClose" />
    </Transition>

    <Transition name="drawer">
      <div v-if="isOpen" class="fixed right-0 top-0 h-full z-50 flex flex-col" :class="[
        'w-[480px] max-lg:w-[90vw] max-md:w-full',
        'bg-[rgba(8,8,25,0.95)] backdrop-blur-[20px]',
        'border-l border-[rgba(139,92,246,0.3)]'
      ]">
        <div class="lg:hidden pt-2 pb-1 flex justify-center">
          <div class="w-10 h-1 rounded-full bg-[rgba(150,160,200,0.4)]"></div>
        </div>

        <div class="flex justify-between items-start p-5 pb-3 border-b border-[rgba(139,92,246,0.2)]">
          <div>
            <h2 class="text-lg font-cinzel text-[#c4b5fd] tracking-wider"
              style="text-shadow: 0 0 20px rgba(196,181,253,0.4)">
              ◈ 神谕配置
            </h2>
            <p class="text-[10px] text-[#5a6a8a] mt-1 font-mono">配置 AI 模型与占卜参数</p>
          </div>
          <button
            class="text-xl leading-none text-[#8b9dc3] transition-all duration-200 hover:text-[#c4b5fd] hover:shadow-[0_0_15px_rgba(196,181,253,0.4)]"
            @click="handleClose">
            ✕
          </button>
        </div>

        <div class="flex border-b border-[rgba(139,92,246,0.2)]">
          <button class="flex-1 py-3 text-xs font-serif-sc transition-all duration-200"
            :class="activeTab === 'models' ? 'text-[#c4b5fd] border-b-2 border-[#c4b5fd]' : 'text-[#5a6a8a] hover:text-[#8b9dc3]'"
            @click="activeTab = 'models'">
            模型配置
          </button>
          <button class="flex-1 py-3 text-xs font-serif-sc transition-all duration-200"
            :class="activeTab === 'general' ? 'text-[#c4b5fd] border-b-2 border-[#c4b5fd]' : 'text-[#5a6a8a] hover:text-[#8b9dc3]'"
            @click="activeTab = 'general'">
            通用设置
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-5 py-4">
          <div v-if="activeTab === 'models'" class="space-y-4">
            <div v-if="!editingModel" class="space-y-3">
              <div class="flex justify-between items-center">
                <h3 class="text-xs text-[#6b7a99] font-serif-sc tracking-widest">已配置模型</h3>
                <button
                  class="px-3 py-1.5 rounded-lg border border-[rgba(139,92,246,0.4)] text-[#a78bfa] text-xs font-serif-sc transition-all duration-200 hover:border-[rgba(139,92,246,0.7)] hover:bg-[rgba(139,92,246,0.1)]"
                  @click="handleCreateModel">
                  + 添加模型
                </button>
              </div>

              <div class="space-y-2">
                <div v-for="model in models" :key="model.id"
                  class="p-4 rounded-xl border transition-all duration-200 cursor-pointer group" :class="[
                    activeModel?.id === model.id
                      ? 'border-[rgba(139,92,246,0.6)] bg-[rgba(139,92,246,0.1)]'
                      : 'border-[rgba(100,120,180,0.2)] bg-[rgba(10,10,20,0.5)] hover:border-[rgba(139,92,246,0.4)]'
                  ]" @click="handleSetActive(model.id)">
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-serif-sc text-[#c4b5fd]">{{ model.name }}</span>
                      <span v-if="model.isDefault"
                        class="px-2 py-0.5 rounded-full bg-[rgba(139,92,246,0.3)] text-[#a78bfa] text-[10px]">
                        默认
                      </span>
                      <span v-if="activeModel?.id === model.id"
                        class="px-2 py-0.5 rounded-full bg-[rgba(100,200,150,0.3)] text-[#6ee7b7] text-[10px]">
                        使用中
                      </span>
                    </div>
                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        class="p-1.5 rounded-lg text-[#8b9dc3] hover:text-[#c4b5fd] hover:bg-[rgba(139,92,246,0.2)] transition-all"
                        @click.stop="handleEditModel(model)">
                        ✎
                      </button>
                      <button v-if="models.length > 1"
                        class="p-1.5 rounded-lg text-[#8b9dc3] hover:text-red-400 hover:bg-[rgba(255,100,100,0.2)] transition-all"
                        @click.stop="handleDeleteClick(model.id)">
                        🗑
                      </button>
                    </div>
                  </div>
                  <div class="text-[10px] text-[#5a6a8a] font-mono space-y-1">
                    <div>提供商: {{ getProviderLabel(model.provider) }}</div>
                    <div>模型: {{ model.model }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="space-y-4">
              <div class="flex items-center gap-2 mb-4">
                <button class="text-[#8b9dc3] hover:text-[#c4b5fd] transition-colors" @click="handleCancelEdit">
                  ← 返回
                </button>
                <h3 class="text-sm text-[#c4b5fd] font-serif-sc">
                  {{ isCreating ? '添加新模型' : '编辑模型' }}
                </h3>
              </div>

              <div class="space-y-4">
                <div class="space-y-1.5">
                  <label class="text-xs text-[#8b9dc3] font-serif-sc">模型名称</label>
                  <input v-model="editingModel.name" type="text" placeholder="例如：DeepSeek V4"
                    class="w-full px-3 py-2 rounded-lg bg-[rgba(10,10,20,0.8)] border border-[rgba(139,92,246,0.3)] text-[#c4b5fd] text-sm placeholder-[#4a5a7a] focus:border-[rgba(139,92,246,0.6)] focus:outline-none transition-colors" />
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs text-[#8b9dc3] font-serif-sc">模型提供商</label>
                  <select v-model="editingModel.provider"
                    class="w-full px-3 py-2 rounded-lg bg-[rgba(10,10,20,0.8)] border border-[rgba(139,92,246,0.3)] text-[#c4b5fd] text-sm focus:border-[rgba(139,92,246,0.6)] focus:outline-none transition-colors">
                    <option v-for="opt in providerOptions" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs text-[#8b9dc3] font-serif-sc">模型标识</label>
                  <input v-model="editingModel.model" type="text" placeholder="例如：DeepSeek-V4-Flash"
                    class="w-full px-3 py-2 rounded-lg bg-[rgba(10,10,20,0.8)] border border-[rgba(139,92,246,0.3)] text-[#c4b5fd] text-sm placeholder-[#4a5a7a] focus:border-[rgba(139,92,246,0.6)] focus:outline-none transition-colors" />
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs text-[#8b9dc3] font-serif-sc">API 地址</label>
                  <input v-model="editingModel.apiUrl" type="text" placeholder="https://api.example.com/v1"
                    class="w-full px-3 py-2 rounded-lg bg-[rgba(10,10,20,0.8)] border border-[rgba(139,92,246,0.3)] text-[#c4b5fd] text-sm placeholder-[#4a5a7a] focus:border-[rgba(139,92,246,0.6)] focus:outline-none transition-colors" />
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs text-[#8b9dc3] font-serif-sc">API 密钥</label>
                  <input v-model="editingModel.apiKey" type="password" placeholder="sk-..."
                    class="w-full px-3 py-2 rounded-lg bg-[rgba(10,10,20,0.8)] border border-[rgba(139,92,246,0.3)] text-[#c4b5fd] text-sm placeholder-[#4a5a7a] focus:border-[rgba(139,92,246,0.6)] focus:outline-none transition-colors" />
                </div>

                <div class="space-y-4 pt-2 border-t border-[rgba(139,92,246,0.2)]">
                  <h4 class="text-xs text-[#6b7a99] font-serif-sc">生成参数</h4>

                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-[#8b9dc3]">Temperature</span>
                      <span class="text-[#c4b5fd] font-mono">{{ editingModel.temperature }}</span>
                    </div>
                    <input type="range" :value="editingModel.temperature" min="0" max="2" step="0.1"
                      class="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-[rgba(139,92,246,0.2)] accent-[#a78bfa]"
                      @input="updateSliderValue('temperature', $event)" />
                    <p class="text-[10px] text-[#5a6a8a]">控制输出的随机性，值越高创造性越强</p>
                  </div>

                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-[#8b9dc3]">Max Tokens</span>
                      <span class="text-[#c4b5fd] font-mono">{{ editingModel.maxTokens }}</span>
                    </div>
                    <input type="range" :value="editingModel.maxTokens" min="256" max="4096" step="256"
                      class="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-[rgba(139,92,246,0.2)] accent-[#a78bfa]"
                      @input="updateSliderValue('maxTokens', $event)" />
                    <p class="text-[10px] text-[#5a6a8a]">单次生成最大 token 数量</p>
                  </div>

                  <div class="space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-[#8b9dc3]">Top P</span>
                      <span class="text-[#c4b5fd] font-mono">{{ editingModel.topP }}</span>
                    </div>
                    <input type="range" :value="editingModel.topP" min="0" max="1" step="0.05"
                      class="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-[rgba(139,92,246,0.2)] accent-[#a78bfa]"
                      @input="updateSliderValue('topP', $event)" />
                    <p class="text-[10px] text-[#5a6a8a]">核采样概率阈值</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 pt-2">
                  <input :checked="editingModel.isDefault" type="checkbox"
                    class="w-4 h-4 rounded border-[rgba(139,92,246,0.4)] bg-[rgba(10,10,20,0.8)] text-[#a78bfa] focus:ring-[#a78bfa] focus:ring-offset-0"
                    @change="editingModel.isDefault = !editingModel.isDefault" />
                  <span class="text-xs text-[#8b9dc3] font-serif-sc">设为默认模型</span>
                </div>

                <div v-if="validationErrors.length > 0"
                  class="p-3 rounded-lg bg-[rgba(255,100,100,0.1)] border border-[rgba(255,100,100,0.3)]">
                  <div class="text-xs text-red-400 font-serif-sc space-y-1">
                    <div v-for="error in validationErrors" :key="error">• {{ error }}</div>
                  </div>
                </div>

                <div class="flex gap-2 pt-2">
                  <button
                    class="flex-1 py-2.5 rounded-lg border border-[rgba(139,92,246,0.4)] text-[#a78bfa] text-sm font-serif-sc transition-all duration-200 hover:border-[rgba(139,92,246,0.7)] hover:bg-[rgba(139,92,246,0.1)]"
                    @click="handleCancelEdit">
                    取消
                  </button>
                  <button
                    class="flex-1 py-2.5 rounded-lg bg-[rgba(139,92,246,0.3)] border border-[rgba(139,92,246,0.5)] text-[#c4b5fd] text-sm font-serif-sc transition-all duration-200 hover:bg-[rgba(139,92,246,0.4)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                    @click="handleSaveModel">
                    保存
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="space-y-6">
            <div
              class="flex items-center justify-between p-4 rounded-xl border border-[rgba(100,120,180,0.2)] bg-[rgba(10,10,20,0.5)]">
              <div>
                <div class="text-sm text-[#c4b5fd] font-serif-sc">动画效果</div>
                <div class="text-[10px] text-[#5a6a8a] mt-0.5">启用界面过渡动画和视觉效果</div>
              </div>
              <button class="relative w-12 h-6 rounded-full transition-colors duration-200"
                :class="settings.enableAnimations ? 'bg-[rgba(139,92,246,0.5)]' : 'bg-[rgba(100,120,180,0.3)]'"
                @click="settings.enableAnimations = !settings.enableAnimations">
                <span class="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200"
                  :class="settings.enableAnimations ? 'left-7' : 'left-1'" />
              </button>
            </div>

            <div
              class="flex items-center justify-between p-4 rounded-xl border border-[rgba(100,120,180,0.2)] bg-[rgba(10,10,20,0.5)]">
              <div>
                <div class="text-sm text-[#c4b5fd] font-serif-sc">自动保存</div>
                <div class="text-[10px] text-[#5a6a8a] mt-0.5">自动保存占卜记录到本地</div>
              </div>
              <button class="relative w-12 h-6 rounded-full transition-colors duration-200"
                :class="settings.autoSave ? 'bg-[rgba(139,92,246,0.5)]' : 'bg-[rgba(100,120,180,0.3)]'"
                @click="settings.autoSave = !settings.autoSave">
                <span class="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200"
                  :class="settings.autoSave ? 'left-7' : 'left-1'" />
              </button>
            </div>

            <div class="pt-4 border-t border-[rgba(139,92,246,0.2)]">
              <h4 class="text-xs text-[#6b7a99] font-serif-sc mb-3">当前使用模型</h4>
              <div v-if="activeModel"
                class="p-4 rounded-xl border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.05)]">
                <div class="text-sm text-[#c4b5fd] font-serif-sc mb-1">{{ activeModel.name }}</div>
                <div class="text-[10px] text-[#5a6a8a] font-mono space-y-0.5">
                  <div>模型: {{ activeModel.model }}</div>
                  <div>Temperature: {{ activeModel.temperature }}</div>
                  <div>Max Tokens: {{ activeModel.maxTokens }}</div>
                </div>
              </div>
              <div v-else class="p-4 rounded-xl border border-[rgba(255,100,100,0.3)] bg-[rgba(255,100,100,0.05)]">
                <div class="text-xs text-red-400 font-serif-sc">未选择模型，请配置后使用</div>
              </div>
            </div>
          </div>
        </div>

        <Teleport to="body">
          <Transition name="fade">
            <div v-if="showDeleteConfirm"
              class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div
                class="w-full max-w-sm p-6 rounded-2xl border border-[rgba(255,100,100,0.3)] bg-[rgba(15,10,15,0.95)]">
                <div class="text-center mb-4">
                  <span class="text-2xl">⚠</span>
                </div>
                <h3 class="text-center text-sm text-[#c4b5fd] font-serif-sc mb-2">确认删除模型?</h3>
                <p class="text-center text-xs text-[#5a6a8a] font-serif-sc mb-6">此操作不可撤销，该模型的配置将被永久删除</p>
                <div class="flex gap-3">
                  <button
                    class="flex-1 py-2.5 rounded-lg border border-[rgba(100,120,180,0.4)] text-[#8b9dc3] text-sm font-serif-sc transition-all duration-200 hover:border-[rgba(100,120,180,0.7)]"
                    @click="handleCancelDelete">
                    取消
                  </button>
                  <button
                    class="flex-1 py-2.5 rounded-lg bg-[rgba(255,100,100,0.2)] border border-[rgba(255,100,100,0.4)] text-red-400 text-sm font-serif-sc transition-all duration-200 hover:bg-[rgba(255,100,100,0.3)]"
                    @click="handleConfirmDelete">
                    删除
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>

        <Teleport to="body">
          <Transition name="toast">
            <div v-if="toast.show"
              class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] px-6 py-3 rounded-full text-sm font-serif-sc transition-all"
              :class="[
                toast.type === 'success'
                  ? 'bg-[rgba(100,200,150,0.9)] text-white'
                  : 'bg-[rgba(255,100,100,0.9)] text-white'
              ]">
              {{ toast.message }}
            </div>
          </Transition>
        </Teleport>
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
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #a78bfa;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #a78bfa;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
}
</style>
