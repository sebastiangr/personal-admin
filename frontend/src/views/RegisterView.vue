<script setup lang="ts">
  import { ref, onUnmounted } from 'vue';
  import { RouterLink, useRouter } from 'vue-router';
  import apiClient from '@/utils/api';
  import { Eye, EyeOff } from 'lucide-vue-next';

  import { useForm } from 'vee-validate';
  import { toTypedSchema } from '@vee-validate/zod';
  import { registerSchema } from '@/lib/schemas';
  import { usePasswordVisibility } from '@/composables/usePasswordVisibility';

  const router = useRouter();
  const serverError = ref<string | null>(null);

  const { errors, defineField, handleSubmit, isSubmitting } = useForm({
    validationSchema: toTypedSchema(registerSchema),
  });

  const [username, usernameProps] = defineField('username');
  const [password, passwordProps] = defineField('password');
  const [confirmPassword, confirmPasswordProps] = defineField('confirmPassword');

  const onSubmit = handleSubmit(async (values) => {
    serverError.value = null;
    try {
      await apiClient.post('/auth/register', values);
      router.push({ name: 'login', query: { registered: 'true' } });
    } catch (error: any) {
      // serverError.value = error.message || 'Ocurrió un error en el servidor.';
      if (error.status === 409) {
        serverError.value = 'Este nombre de usuario ya está en uso.';
      } else {
        serverError.value = 'Ocurrió un error inesperado durante el registro.';
      }
      console.error(error);
    }
  });

  const { isVisible: isPasswordVisible, fieldType: passwordFieldType, toggle: togglePassword } = usePasswordVisibility();
  const { isVisible: isConfirmPasswordVisible, fieldType: confirmPasswordFieldType, toggle: toggleConfirmPassword } = usePasswordVisibility();
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-base-200 p-4">
    <div class="card w-full max-w-sm shrink-0 bg-base-100 shadow-xl border border-base-300">
            
      <form @submit="onSubmit" class="card-body w-full">
        <h1 class="card-title text-2xl mb-4 text-center block">Crear una Cuenta</h1>

        <div v-if="serverError" class="alert alert-error text-sm">
          <span>{{ serverError }}</span>
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text">Nombre de Usuario</span></label>
          <div class="relative">
            <input v-model="username" v-bind="usernameProps" type="text" placeholder="" class="input input-bordered w-full pr-10" />
            <span v-if="errors.username" class="text-error text-xs mt-1">
              {{ errors.username === 'Required' ? 'Ingresa un nombre de usuario' : errors.username }}
            </span>
          </div>
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text">Contraseña</span></label>
          <div class="relative">
            <input 
              name="password"
              :type="passwordFieldType"
              class="input input-bordered w-full pr-10"
              v-model="password"
              v-bind="passwordProps"
            />
            <button 
              type="button" 
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-base-content/50 hover:text-base-content z-10"
              @click="togglePassword"
            >
              <Eye v-if="!isPasswordVisible" :size="20" />
              <EyeOff v-else :size="20" />
            </button>
          </div>
          <span v-if="errors.password" class="text-error text-xs mt-1">            
            {{ errors.password === 'Required' ? 'Ingresa una contraseña' : errors.password }}            
          </span>
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text">Confirmar Contraseña</span></label>
          <div class="relative">
            <input               
              name="confirmPassword"
              :type="confirmPasswordFieldType"
              class="input input-bordered w-full pr-10" 
              v-model="confirmPassword" 
              v-bind="confirmPasswordProps"                             
            />
            <button 
              type="button" 
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-base-content/50 hover:text-base-content z-10"
              @click="toggleConfirmPassword"
            >
              <Eye v-if="!isConfirmPasswordVisible" :size="20" />
              <EyeOff v-else :size="20" />
            </button>
          </div>
          
          <span v-if="errors.confirmPassword" class="text-error text-xs mt-1">
            {{ errors.confirmPassword === 'Required' ? 'Ingresa una contraseña' : errors.confirmPassword }}
          </span>
        </div>

        <div class="form-control mt-6">
          <div class="relative">
            <button class="btn btn-primary w-full" type="submit" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="loading loading-spinner"></span>
              <span v-else>Crear cuenta</span>
            </button>
          </div>
        </div>

        <div class="text-center mt-4 text-sm">
          ¿Ya tienes una cuenta?
          <RouterLink :to="{ name: 'login' }" class="link link-primary">Inicia sesión</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>