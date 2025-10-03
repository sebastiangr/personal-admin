<script setup lang="ts">
import { ref } from 'vue';

// --- EMITS ---
// defineEmits declara los eventos personalizados que este componente puede "emitir"
// hacia su componente padre.
const emit = defineEmits<{
  (e: 'submit', formData: Record<string, any>): void
  (e: 'cancel'): void
}>()

// --- ESTADO DEL FORMULARIO ---
// Usamos ref() para cada campo del formulario.
const formData = ref({
  companyName: '',
  contactName: '',
  email: '',
  website: '',
  sector: '',
  notes: '',
  interestLevel: 1, // Valor por defecto
  status: 'BACKLOG', // Valor por defecto
});

// --- MÉTODOS ---
function handleSubmit() {
  // Cuando el formulario se envía, emitimos el evento 'submit'
  // y pasamos una copia de los datos del formulario como carga útil (payload).
  emit('submit', { ...formData.value });
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Campo Nombre de la Empresa -->
      <div class="form-control col-span-2">
        <label class="label"><span class="label-text">Nombre de la Empresa*</span></label>
        <input v-model="formData.companyName" type="text" class="input input-bordered" required />
      </div>
      <!-- Campo Nombre del Contacto -->
      <div class="form-control">
        <label class="label"><span class="label-text">Nombre del Contacto</span></label>
        <input v-model="formData.contactName" type="text" class="input input-bordered" />
      </div>
      <!-- Campo Email -->
      <div class="form-control">
        <label class="label"><span class="label-text">Email</span></label>
        <input v-model="formData.email" type="email" class="input input-bordered" />
      </div>
      <!-- ... (más campos) ... -->
      <div class="form-control col-span-2">
        <label class="label"><span class="label-text">Sitio Web</span></label>
        <input v-model="formData.website" type="url" class="input input-bordered" />
      </div>
      <div class="form-control col-span-2">
        <label class="label"><span class="label-text">Notas</span></label>
        <textarea v-model="formData.notes" class="textarea textarea-bordered" rows="3"></textarea>
      </div>
    </div>
    
    <!-- Slot para las acciones (se pasará al slot 'actions' del modal) -->
    <div class="mt-6 flex justify-end gap-4">
      <button type="button" class="btn btn-ghost" @click="$emit('cancel')">Cancelar</button>
      <button type="submit" class="btn btn-primary">Guardar Contacto</button>
    </div>
  </form>
</template>