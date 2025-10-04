<script setup lang="ts">
  import { ref, watch } from 'vue';

  // --- PROPS ---
  const props = defineProps<{
    initialData?: Record<string, any> | null
  }>()

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

  // --- WATCHER ---
  // watch() observa cambios en una fuente (props.initialData).
  // Se ejecutará cada vez que el padre cambie el contacto a editar.
  watch(() => props.initialData, (newData) => {
    if (newData) {
      // Si hay datos iniciales, los copiamos a nuestro formulario.
      formData.value = {
        companyName: newData.companyName ?? '',
        contactName: newData.contactName ?? '',
        email: newData.email ?? '',
        website: newData.website ?? '',
        sector: newData.sector ?? '',
        notes: newData.notes ?? '',
        interestLevel: newData.interestLevel ?? 1,
        status: newData.status ?? 'BACKLOG',
      };
    } else {
      // Si no, reseteamos el formulario (para el modo "Crear").
      formData.value = {
        companyName: '',
        contactName: '',
        email: '',
        website: '',
        sector: '',
        notes: '',
        interestLevel: 1,
        status: 'BACKLOG',
      };
    }
  }, { immediate: true }); // immediate: true hace que se ejecute una vez al crearse.


  // --- MÉTODOS ---
  function handleSubmit() {
    // El padre ya sabrá si es una edición o creación.
    // El formulario solo emite los datos.
    emit('submit', formData.value);
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