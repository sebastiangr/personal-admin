<script setup lang="ts">
  // --- PROPS ---
  defineProps<{
    title?: string
    message: string 
    confirmText?: string
    cancelText?: string
    isLoading?: boolean
  }>()

  // --- EMITS ---
  const emit = defineEmits(['confirm', 'cancel'])

  // --- MODEL ---
  // defineModel para sincronizar la visibilidad con el padre
  const isOpen = defineModel<boolean>()
</script>

<template>
  <div v-if="isOpen">
    <div class="modal-backdrop" @click="$emit('cancel')"></div>
    <div role="dialog" class="modal modal-open">
      <div class="modal-box">
        <!-- Título -->
        <h3 class="font-bold text-lg">{{ title || 'Confirmación' }}</h3>
        
        <!-- Mensaje -->
        <p class="py-4">{{ message }}</p>

        <!-- Acciones -->
        <div class="modal-action">
          <button class="btn btn-ghost" @click="$emit('cancel')">
            {{ cancelText || 'Cancelar' }}
          </button>
          <button class="btn btn-error" @click="$emit('confirm')" :disabled="isLoading">
            <span v-if="isLoading" class="loading loading-spinner"></span>
            {{ confirmText || 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>