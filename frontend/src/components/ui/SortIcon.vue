<!-- src/components/ui/SortIcon.vue -->
<script setup lang="ts">
import { ChevronUp, ChevronDown } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  sortKey: string
  sortOrder: 'asc' | 'desc'
  currentKey: string
}>()

// La propiedad computada 'isActive' sigue siendo nuestra pieza central de lógica
const isActive = computed(() => props.sortKey === props.currentKey)
</script>

<template>
  <!-- 
    El contenedor principal ahora solo se encarga de la disposición vertical de los iconos.
    Ya no controla la opacidad general, lo haremos individualmente para un mejor efecto.
  -->
  <div class="flex flex-col">
    <!-- 
      CHEVRON ARRIBA (ASC)
      Siempre está en el DOM. Su clase cambia dinámicamente.
      - 'text-primary': Se aplica si esta es la columna activa Y el orden es ascendente.
      - 'text-base-content/30 hover:text-base-content/70': El estado por defecto (atenuado).
        Al pasar el ratón, se vuelve un poco más visible para dar feedback.
    -->
    <ChevronUp 
      :size="18" 
      class="-mb-1 transition-colors"
      :class="isActive && sortOrder === 'asc' ? 'text-base-content' : 'text-base-content/30 hover:text-base-content/100'" 
    />

    <!-- 
      CHEVRON ABAJO (DESC)
      Sigue la misma lógica que el de arriba, pero para el orden descendente.
    -->
    <ChevronDown 
      :size="18" 
      class="-mt-1 transition-colors"
      :class="isActive && sortOrder === 'desc' ? 'text-base-content' : 'text-base-content/30 hover:text-base-content/100'" 
    />
  </div>
</template>