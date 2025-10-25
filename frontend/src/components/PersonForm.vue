<script setup lang="ts">
  import { useForm } from 'vee-validate';
  import { toTypedSchema } from '@vee-validate/zod';
  import { createPersonSchema } from '@/lib/schemas';
  import { watch } from 'vue';

  const props = defineProps<{ initialData?: Record<string, any> | null }>();
  const emit = defineEmits(['submit', 'cancel']);

  const { defineField, handleSubmit, isSubmitting, errors, setValues, resetForm } = useForm({
    validationSchema: toTypedSchema(createPersonSchema),
  });

  const [name, nameProps] = defineField('name');
  const [email, emailProps] = defineField('email');
  const [linkedinUrl, linkedinUrlProps] = defineField('linkedinUrl');
  const [notes, notesProps] = defineField('notes');

  const onSubmit = handleSubmit((values) => {
    emit('submit', values);
  });
  
  const resetValues = {
    name: '',
    email: '',
    linkedinUrl: '',
    notes: '',
  };

  watch(() => props.initialData, (newData) => {
    if (newData) {
      const cleanData: Record<string, any> = {};
      for (const key in resetValues) {
        cleanData[key] = newData[key as keyof typeof newData] ?? resetValues[key as keyof typeof resetValues];
      }
      setValues(cleanData);
    } else {
      resetForm({ values: resetValues });
    }
  }, { immediate: true });
  </script>

<template>
  <form @submit="onSubmit">
    <div class="grid grid-cols-1 gap-y-3">
      
      <div class="form-control">
        <label class="label"><span class="label-text">Nombre Completo*</span></label>
        <input v-model="name" v-bind="nameProps" type="text" class="input input-bordered" />
        <span v-if="errors.name" class="text-error text-xs mt-1">{{ errors.name }}</span>
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">Email</span></label>
        <input v-model="email" v-bind="emailProps" type="email" class="input input-bordered" />
        <span v-if="errors.email" class="text-error text-xs mt-1">{{ errors.email }}</span>
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">URL de LinkedIn</span></label>
        <input v-model="linkedinUrl" v-bind="linkedinUrlProps" type="text" class="input input-bordered" />
        <span v-if="errors.linkedinUrl" class="text-error text-xs mt-1">{{ errors.linkedinUrl }}</span>
      </div>
      
      <div class="form-control">
        <label class="label"><span class="label-text">Notas</span></label>
        <textarea v-model="notes" v-bind="notesProps" class="textarea textarea-bordered" rows="3"></textarea>
      </div>
    </div>
    
    <div class="mt-8 flex justify-end gap-4">
      <button type="button" class="btn btn-ghost" @click="$emit('cancel')">Cancelar</button>
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="loading loading-spinner"></span>
        Guardar Persona
      </button>
    </div>
  </form>
</template>