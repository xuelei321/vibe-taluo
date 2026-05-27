import { ref } from 'vue'

const isOverCard = ref(false)

export function useCursorState() {
  function setCardHover(hovering: boolean) {
    isOverCard.value = hovering
  }

  return {
    isOverCard,
    setCardHover
  }
}
