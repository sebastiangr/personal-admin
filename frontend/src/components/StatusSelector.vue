<script setup lang="ts">
  import { ref, computed } from 'vue'
  import apiClient from '@/utils/api'
  import { statusMap, selectableStatuses, type ContactStatus } from '@/utils/statusHelper'
  import { Check } from 'lucide-vue-next'

  // --- PROPS Y EMITS ---
  const props = defineProps<{
    contactId: string
    currentStatus: ContactStatus
  }>()

  const emit = defineEmits(['status-updated'])

  // --- ESTADO ---
  const isLoading = ref(false)

  // --- PROPIEDADES COMPUTADAS ---
  // Calcula dinámicamente el texto y color del badge actual
  const currentStatusInfo = computed(() => statusMap[props.currentStatus] || statusMap.BACKLOG)

  // --- MÉTODOS ---
  async function updateStatus(newStatus: ContactStatus) {
    if (newStatus === props.currentStatus || isLoading.value) {
      return // No hacer nada si se selecciona el mismo estado o si ya está cargando
    }

    isLoading.value = true
    try {
      const updatedContact = await apiClient.put(`/companies/${props.contactId}`, {
        status: newStatus,
      })
      // Emite el evento con el contacto actualizado para que el padre actualice su lista
      emit('status-updated', updatedContact)
    } catch (error) {
      console.error('Error al actualizar el estado:', error)
      // Aquí podríamos mostrar una notificación de error al usuario
    } finally {
      isLoading.value = false
      // Cierra el dropdown desenfocando el elemento activo
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    }
  }
</script>

<template>
  <div class="dropdown dropdown-end dropdown-hover">
    <!-- El badge que se muestra siempre y que activa el dropdown -->
    <div tabindex="0" role="button" class="badge cursor-pointer" :class="currentStatusInfo.colorClass">
      <span v-if="isLoading" class="loading loading-spinner loading-xs mr-1"></span>
      {{ currentStatusInfo.text }}
    </div>

    <!-- El contenido del dropdown que se muestra al hacer clic -->
    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
      <li v-for="status in selectableStatuses" :key="status" @click="updateStatus(status)">
        <a :class="{ 'bg-base-300': status === currentStatus }">
          <Check v-if="status === currentStatus" :size="16" class="text-primary" />
          <span v-else class="w-4"></span> <!-- Espaciador para alinear -->
          {{ statusMap[status].text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  .badge {
    border-radius: 5px;
  }
</style>