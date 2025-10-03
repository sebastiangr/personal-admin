<script setup lang="ts">
// --- PROPS Y EMITS ---
// defineProps define las "propiedades" que el componente padre puede pasarle.
defineProps<{
  title?: string // Un título opcional para el modal
}>()

// defineModel es la forma moderna (Vue 3.4+) de crear un v-model.
// 'isOpen' será una variable reactiva que está sincronizada bidireccionalmente
// con la variable que el padre le pase a través de v-model.
const isOpen = defineModel<boolean>()
</script>

<template>
  <!-- Usamos v-if para montar o desmontar el modal del DOM -->
  <div v-if="isOpen">
    <!-- El backdrop de DaisyUI -->
    <div class="modal-backdrop" @click="isOpen = false"></div>
    
    <!-- El contenedor principal del modal -->
    <div role="dialog" class="modal modal-open">
      <div class="modal-box">
        <!-- Título y Botón de Cierre -->
        <div class="flex justify-between items-center mb-4">
          <h3 v-if="title" class="font-bold text-lg">{{ title }}</h3>
          <button class="btn btn-sm btn-circle btn-ghost" @click="isOpen = false">✕</button>
        </div>

        <!-- 
          SLOTS: Aquí es donde reside la magia de la reutilización.
          Vue reemplazará esta etiqueta <slot> con cualquier contenido
          que el componente padre ponga DENTRO de nuestro componente <Modal>.
        -->
        <slot></slot>
        
        <!-- 
          Named Slot: Un slot con nombre para acciones.
          Permite al padre pasar contenido específico para el footer.
        -->
        <div class="modal-action">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </div>
</template>