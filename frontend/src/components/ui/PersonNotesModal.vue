<script setup lang="ts">
  import { ref, watch, computed, nextTick } from 'vue';
  import apiClient from '@/utils/api';
  import Modal from '@/components/ui/Modal.vue';
  import { Check } from 'lucide-vue-next';

  const props = defineProps<{
    person: any | null 
  }>();

  const emit = defineEmits(['notes-updated']);

  // --- ESTADO ---
  const isOpen = defineModel<boolean>();
  const isInEditMode = ref(false);
  const notesContent = ref('');
  const isLoading = ref(false);
  const showSuccess = ref(false);
  const textareaRef = ref<HTMLTextAreaElement | null>(null);

  // --- PROPIEDADES COMPUTADAS ---
  const hasChanges = computed(() => (props.person?.notes || '') !== notesContent.value);

  // --- WATCHER ---
  watch(isOpen, (newVal) => {
    if (newVal && props.person) {
      isInEditMode.value = false;
      showSuccess.value = false;
      notesContent.value = props.person.notes || '';
    }
  });

  // --- MÉTODOS ---
  function switchToEditMode() {
    isInEditMode.value = true;
    nextTick(() => textareaRef.value?.focus());
  }

  async function saveNotes() {
    if (!props.person || isLoading.value) return;
    isLoading.value = true;
    try {
      
      const updatedPerson = await apiClient.put(`/people/${props.person.id}`, {
        notes: notesContent.value,
      });
      
      isInEditMode.value = false;
      emit('notes-updated', updatedPerson);

      showSuccess.value = true;
      setTimeout(() => showSuccess.value = false, 2000);
    } catch (error) {
      console.error("Error al guardar las notas:", error);
    } finally {
      isLoading.value = false;
    }
  }

  function cancelEdit() {
    notesContent.value = props.person?.notes || '';
    isInEditMode.value = false;
  }
</script>

<template>
  <Modal v-model="isOpen" :title="'Añadir Nota'">
    <div v-if="person">
      
      <div class="flex justify-between items-center mb-4">        
        <div class="mb-4 mt-4">
          <h2 class="text-xl font-bold text-primary">{{ person.name }}</h2>
          <p v-if="person.email" class="text-sm text-base-content/60 italic">
            {{ person.email }}
          </p>
        </div>        
      </div>

      <!-- <div class="mb-4 -mt-4">
        <h2 class="text-xl font-bold text-primary">{{ person.name }}</h2>
        <p v-if="person.email" class="text-sm text-base-content/60 italic">
          {{ person.email }}
        </p>
      </div> -->
      
      <div>
        <div v-if="!isInEditMode" class="prose max-w-none bg-base-200 p-4 rounded-lg min-h-[200px] whitespace-pre-wrap">
          <p v-if="notesContent">{{ notesContent }}</p>
          <p v-else class="italic text-base-content/50">No hay notas para esta persona.</p>
        </div>
        
        <div v-else>
          <textarea
            ref="textareaRef"
            v-model="notesContent"
            class="textarea textarea-bordered w-full"
            rows="8"
            placeholder="Escribe tus notas aquí..."
          ></textarea>
        </div>
      </div>
    </div>

    <template #actions>
      <div v-if="person" class="w-full">
        <div v-if="!isInEditMode" class="flex justify-between w-full">
          <button class="btn btn-ghost" @click="isOpen = false">Cerrar</button>
          <button class="btn btn-primary" @click="switchToEditMode">Editar Notas</button>
        </div>
        
        <div v-else class="flex justify-between w-full items-center">
          <button class="btn btn-ghost" @click="cancelEdit">Cancelar</button>
          
          <button 
            class="btn"
            :class="{ 'btn-success': showSuccess, 'btn-primary': !showSuccess }"
            @click="saveNotes" 
            :disabled="!hasChanges || isLoading"
          >
            <span v-if="isLoading" class="loading loading-spinner"></span>
            <Check v-else-if="showSuccess" />
            <span v-else>Guardar Cambios</span>
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>