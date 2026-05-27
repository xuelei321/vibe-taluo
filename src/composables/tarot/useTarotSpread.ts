import { ref, computed } from 'vue';
import type { TarotCard } from '@/data/tarotCards';
import { allTarotCards } from '@/data/tarotCards';

export interface DrawnCard {
  card: TarotCard;
  position: 'past' | 'present' | 'future';
  isReversed: boolean;
  positionLabel: string;
}

export function useTarotSpread() {
  const drawnCards = ref<DrawnCard[]>([]);

  const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const drawSpread = (): void => {
    const shuffled = shuffleArray(allTarotCards);
    const selectedCards = shuffled.slice(0, 3);

    const positions: Array<{ key: 'past' | 'present' | 'future'; label: string }> = [
      { key: 'past', label: '过去 · 根源' },
      { key: 'present', label: '当下 · 核心' },
      { key: 'future', label: '将来 · 潜力' }
    ];

    drawnCards.value = selectedCards.map((card, index) => ({
      card,
      position: positions[index].key,
      isReversed: Math.random() < 0.5,
      positionLabel: positions[index].label
    }));
  };

  const isDrawn = computed(() => drawnCards.value.length === 3);

  const resetSpread = (): void => {
    drawnCards.value = [];
  };

  return {
    drawnCards,
    drawSpread,
    isDrawn,
    resetSpread
  };
}
