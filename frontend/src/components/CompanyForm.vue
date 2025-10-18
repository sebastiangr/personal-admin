<!-- src/components/CompanyForm.vue -->
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { CompanyType, Status } from '@/types';    

  const props = defineProps<{ initialData?: Record<string, any> | null }>()
  const emit = defineEmits(['submit', 'cancel'])
  
  const formData = ref({
    name: '',
    type: CompanyType.AGENCY_STUDIO,
    country: '',
    city: '',
    email: '',
    website: '',
    careerWebsite: '',
    linkedinUrl: '',
    instagramUrl: '',
    behanceUrl: '',
    notes: '',
    interestLevel: 1,
    status: Status.TO_CONTACT,
  });

  // Watcher para poblar el formulario en modo de edición
  watch(() => props.initialData, (newData) => {
    if (newData) {
      formData.value = { ...formData.value, ...newData };
    } else {
      // Resetea a los valores por defecto para el modo de creación
      formData.value = {
        name: '', type: CompanyType.AGENCY_STUDIO, country: '', city: '',
        email: '', website: '', careerWebsite: '', linkedinUrl: '', 
        instagramUrl: '', behanceUrl: '', notes: '', interestLevel: 1, 
        status: Status.TO_CONTACT,
      };
    }
  }, { immediate: true });

  function handleSubmit() {
    emit('submit', formData.value);
  }
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-control col-span-2">
        <label class="label"><span class="label-text">Nombre de la Empresa*</span></label>
        <input v-model="formData.name" type="text" class="input input-bordered" required />
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">Tipo de Empresa</span></label>
        <select v-model="formData.type" class="select select-bordered">
          <option v-for="type in Object.values(CompanyType)" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">Email de Contacto</span></label>
        <input v-model="formData.email" type="email" class="input input-bordered" />
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">País</span></label>
        <input v-model="formData.country" type="text" class="input input-bordered" />
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">Ciudad</span></label>
        <input v-model="formData.city" type="text" class="input input-bordered" />
      </div>

      <div class="form-control col-span-2">
        <label class="label"><span class="label-text">Sitio Web Principal</span></label>
        <input v-model="formData.website" type="url" class="input input-bordered" />
      </div>
      
      <div class="form-control col-span-2">
        <label class="label"><span class="label-text">Sitio Web de Empleo</span></label>
        <input v-model="formData.careerWebsite" type="url" class="input input-bordered" />
      </div>
      
      <div class="form-control col-span-2">
        <label class="label"><span class="label-text">URL de LinkedIn</span></label>
        <input v-model="formData.linkedinUrl" type="url" class="input input-bordered" />
      </div>

      <div class="form-control col-span-2">
        <label class="label"><span class="label-text">Notas</span></label>
        <textarea v-model="formData.notes" class="textarea textarea-bordered" rows="4"></textarea>
      </div>
    </div>
    
    <div class="mt-6 flex justify-end gap-4">
      <button type="button" class="btn btn-ghost" @click="$emit('cancel')">Cancelar</button>
      <button type="submit" class="btn btn-primary">Guardar</button>
    </div>
  </form>
</template>


<!-- <script setup lang="ts">
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
</script> -->

<!-- <template>
  <form @submit.prevent="handleSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex flex-col col-span-2 w-full">
        <label class="mb-1 font-semibold text-sm">Nombre de la Empresa*</label>
        <input v-model="formData.companyName" type="text" class="input input-bordered w-full" required />
      </div>
      <div class="flex flex-col w-full">
        <label class="mb-1 font-semibold text-sm">Nombre del Contacto</label>
        <input v-model="formData.contactName" type="text" class="input input-bordered w-full" />
      </div>
      <div class="flex flex-col w-full">
        <label class="mb-1 font-semibold text-sm">Email</label>
        <input v-model="formData.email" type="email" class="input input-bordered w-full" />
      </div>
      <div class="flex flex-col col-span-2 w-full">
        <label class="mb-1 font-semibold text-sm">Sitio Web</label>
        <input v-model="formData.website" type="url" class="input input-bordered w-full" />
      </div>
      <div class="flex flex-col col-span-2 w-full">
        <label class="mb-1 font-semibold text-sm">Notas</label>
        <textarea v-model="formData.notes" class="textarea textarea-bordered w-full" rows="3"></textarea>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <button type="button" class="btn btn-secondary w-full" @click="$emit('cancel')">Cancelar</button>
      <button type="submit" class="btn btn-primary w-full">Guardar Contacto</button>
    </div>
  </form>
</template> -->