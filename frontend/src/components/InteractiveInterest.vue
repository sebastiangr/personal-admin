<!-- src/components/InteractiveInterest.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import apiClient from '@/utils/api'

// --- PROPS Y EMITS ---
const props = defineProps<{
  contactId: string
  currentLevel: 1 | 2 | 3
}>()

const emit = defineEmits(['level-updated'])

// --- ESTADO ---
const isLoading = ref(false)
// hoverLevel guarda el nivel sobre el que está el ratón (0 si no está sobre ninguno)
const hoverLevel = ref(0)

// --- MÉTODOS ---
async function setInterestLevel(level: 1 | 2 | 3) {
  if (isLoading.value) return

  isLoading.value = true
  try {
    const updatedContact = await apiClient.put(`/api/contacts/${props.contactId}`, {
      interestLevel: level
    })
    emit('level-updated', updatedContact)
  } catch (error) {
    console.error('Error al actualizar el interés:', error)
  } finally {
    isLoading.value = false
  }
}

// Devuelve la clase de color correcta basada en el estado actual y el hover
function getDotClass(level: number): string {
  const effectiveLevel = hoverLevel.value > 0 ? hoverLevel.value : props.currentLevel
  
  if (level <= effectiveLevel) {
    if (level === 1) return 'bg-error'
    if (level === 2) return 'bg-warning'
    if (level === 3) return 'bg-success'
  }
  return 'bg-base-300 opacity-20'
}
</script>

<template>
  <div class="flex items-center justify-center gap-1.5 relative h-6 w-16">
    <!-- Spinner de Carga -->
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
      <span class="loading loading-spinner loading-xs"></span>
    </div>

    <!-- Los 3 Puntos Interactivos -->
    <div v-else class="flex items-center justify-center gap-1.5">
      <div 
        v-for="level in [1, 2, 3]"
        :key="level"
        class="h-4 w-4 rounded-full cursor-pointer transition-transform duration-150 ease-in-out hover:scale-125"
        :class="getDotClass(level)"
        @mouseenter="hoverLevel = level"
        @mouseleave="hoverLevel = 0"
        @click="setInterestLevel(level as 1 | 2 | 3)"
      ></div>
    </div>
  </div>
</template>