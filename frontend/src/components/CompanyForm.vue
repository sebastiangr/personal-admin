<!-- src/components/CompanyForm.vue -->
<script setup lang="ts">
import { CompanyType, Status } from '@/types';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { createCompanySchema } from '@/lib/schemas';
import { watch } from 'vue';
import { companyTypeOptions } from '@/utils/companyTypeHelper';
import { statusOptions } from '@/utils/statusHelper';

const props = defineProps<{ initialData?: Record<string, any> | null }>();
const emit = defineEmits(['submit', 'cancel']);

// Opciones para los selects
const interestOptions = [
  { label: 'Bajo', value: 1 },
  { label: 'Medio', value: 2 },
  { label: 'Alto', value: 3 },
];

const { defineField, handleSubmit, isSubmitting, errors, setValues, resetForm } = useForm({
  validationSchema: toTypedSchema(createCompanySchema),
});

// Usamos defineField para cada campo. v-model es más limpio aquí.
const [name, nameProps] = defineField('name');
const [type, typeProps] = defineField('type');
const [country, countryProps] = defineField('country');
const [city, cityProps] = defineField('city');
const [email, emailProps] = defineField('email');
const [website, websiteProps] = defineField('website');
const [careerWebsite, careerWebsiteProps] = defineField('careerWebsite');
const [linkedinUrl, linkedinUrlProps] = defineField('linkedinUrl');
const [instagramUrl, instagramUrlProps] = defineField('instagramUrl');
const [behanceUrl, behanceUrlProps] = defineField('behanceUrl');
const [notes, notesProps] = defineField('notes');
const [interestLevel, interestLevelProps] = defineField('interestLevel');
const [status, statusProps] = defineField('status');

const onSubmit = handleSubmit((values) => {
  emit('submit', values);
});

const resetValues = {
  name: '',
  type: CompanyType.AGENCY_STUDIO,
  country: '', city: '', email: '', website: '', careerWebsite: '',
  linkedinUrl: '', instagramUrl: '', behanceUrl: '',
  notes: '',
  interestLevel: 2,
  status: Status.TO_CONTACT,
};

watch(() => props.initialData, (newData) => {
  if (newData) {
    const cleanData: Record<string, any> = {};

    for (const key of Object.keys(resetValues) as Array<keyof typeof resetValues>) {      
      cleanData[key] = newData[key] ?? resetValues[key];
    }
    setValues(cleanData);
  } else {
    resetForm({
      values: resetValues
    });
  }
}, { immediate: true, deep: true });


</script>

<template>
  <form @submit="onSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
      
      <!-- Campos Principales -->
      <div class="form-control col-span-2">
        <label class="label"><span class="label-text">Nombre de la Empresa*</span></label>
        <input v-model="name" v-bind="nameProps" type="text" class="input input-bordered" />
        <span v-if="errors.name" class="text-error text-xs mt-1">{{ errors.name }}</span>
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">Tipo de Empresa</span></label>
        <select v-model="type" v-bind="typeProps" class="select select-bordered">
          <!-- AHORA ITERAMOS SOBRE LAS OPCIONES -->
          <option v-for="opt in companyTypeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
      
      <div class="form-control">
        <label class="label"><span class="label-text">Email de Contacto</span></label>
        <input v-model="email" v-bind="emailProps" type="email" class="input input-bordered" />
        <span v-if="errors.email" class="text-error text-xs mt-1">{{ errors.email }}</span>
      </div>

      <!-- Ubicación -->
      <div class="form-control">
        <label class="label"><span class="label-text">País</span></label>
        <input v-model="country" v-bind="countryProps" type="text" class="input input-bordered" />
      </div>
      <div class="form-control">
        <label class="label"><span class="label-text">Ciudad</span></label>
        <input v-model="city" v-bind="cityProps" type="text" class="input input-bordered" />
      </div>
      
      <!-- URLs -->
      <div class="form-control col-span-2">
        <label class="label"><span class="label-text">Sitio Web</span></label>
        <input v-model="website" v-bind="websiteProps" type="text" placeholder="ej: google.com" class="input input-bordered" />
        <span v-if="errors.website" class="text-error text-xs mt-1">{{ errors.website }}</span>
      </div>
      <div class="form-control col-span-2">
        <label class="label"><span class="label-text">LinkedIn</span></label>
        <input v-model="linkedinUrl" v-bind="linkedinUrlProps" type="text" class="input input-bordered" />
        <span v-if="errors.linkedinUrl" class="text-error text-xs mt-1">{{ errors.linkedinUrl }}</span>
      </div>
      <div class="form-control col-span-2">
        <label class="label"><span class="label-text">Instagram</span></label>
        <input v-model="instagramUrl" v-bind="instagramUrlProps" type="text" class="input input-bordered" />
        <span v-if="errors.instagramUrl" class="text-error text-xs mt-1">{{ errors.instagramUrl }}</span>
      </div>
      <div class="form-control col-span-2">
        <label class="label"><span class="label-text">Behance</span></label>
        <input v-model="behanceUrl" v-bind="behanceUrlProps" type="text" class="input input-bordered" />
        <span v-if="errors.behanceUrl" class="text-error text-xs mt-1">{{ errors.behanceUrl }}</span>
      </div>
      
      <!-- Notas -->
      <div class="form-control col-span-2">
        <label class="label"><span class="label-text">Notas</span></label>
        <textarea v-model="notes" v-bind="notesProps" class="textarea textarea-bordered" rows="3"></textarea>
      </div>

      <!-- Interés y Estado -->
      <div class="form-control">
        <label class="label"><span class="label-text">Nivel de Interés</span></label>
        <select v-model="interestLevel" v-bind="interestLevelProps" class="select select-bordered">
          <option v-for="opt in interestOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
      <div class="form-control">
        <label class="label"><span class="label-text">Estado Inicial</span></label>
        <select v-model="status" v-bind="statusProps" class="select select-bordered">
          <!-- AHORA ITERAMOS SOBRE LAS OPCIONES -->
          <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

    </div>
    
    <div class="mt-8 flex justify-end gap-4">
      <button type="button" class="btn btn-ghost" @click="$emit('cancel')">Cancelar</button>
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="loading loading-spinner"></span>
        Guardar
      </button>
    </div>
  </form>
</template>