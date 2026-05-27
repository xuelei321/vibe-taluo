import { ref, computed } from 'vue'
import type { DrawnCard } from '@/composables/tarot/useTarotSpread'

export interface ReadingRecord {
  id: string
  timestamp: number
  diaryExcerpt: string
  drawnCards: DrawnCard[]
  oracleTexts: Record<number, string>
  emotionIntensity: number
  dominantMood: string
}

const STORAGE_KEY = 'tarothistory'
const MAX_RECORDS = 30

function loadFromStorage(): ReadingRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (error) {
    console.warn('读取历史记录失败，使用空数组初始化:', error)
  }
  return []
}

function saveToStorage(records: ReadingRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch (error) {
    console.error('保存历史记录失败:', error)
  }
}

export function useReadingHistory() {
  const records = ref<ReadingRecord[]>(loadFromStorage())
  
  console.log('[ReadingHistory] 初始化完成，当前记录数:', records.value.length)

  function addRecord(record: Omit<ReadingRecord, 'id' | 'timestamp'>): void {
    const newRecord: ReadingRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: Date.now()
    }

    records.value = [newRecord, ...records.value]

    if (records.value.length > MAX_RECORDS) {
      records.value = records.value.slice(0, MAX_RECORDS)
    }

    saveToStorage(records.value)
    console.log('[ReadingHistory] 记录保存成功:', {
      id: newRecord.id,
      diaryLength: newRecord.diaryExcerpt.length,
      cardCount: newRecord.drawnCards.length,
      totalRecords: records.value.length
    })
  }

  function deleteRecord(id: string): void {
    records.value = records.value.filter(record => record.id !== id)
    saveToStorage(records.value)
  }

  function clearAll(): void {
    records.value = []
    saveToStorage(records.value)
  }

  const totalCount = computed(() => records.value.length)

  return {
    records,
    totalCount,
    addRecord,
    deleteRecord,
    clearAll
  }
}
