<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { RouterLink, useRouter, useRoute } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { Eye, EyeOff } from 'lucide-vue-next';

  import { useForm } from 'vee-validate';
  import { toTypedSchema } from '@vee-validate/zod';
  import { loginSchema } from '@/lib/schemas';
  import { usePasswordVisibility } from '@/composables/usePasswordVisibility';

  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  const successMessage = ref<string | null>(null);
  const serverError = ref<string | null>(null);

  const { errors, defineField, handleSubmit, isSubmitting } = useForm({
    validationSchema: toTypedSchema(loginSchema),
    initialValues: {
      username: '',
      password: '',
    },
  });

  const [username, usernameProps] = defineField('username');
  const [password, passwordProps] = defineField('password');

  const onSubmit = handleSubmit(async (values) => {
    serverError.value = null;
    successMessage.value = null;
    try {
      await authStore.login(values.username, values.password);
      router.push({ name: 'companies' });
    } catch (error) {
      serverError.value = 'Usuario o contraseña inválidos.';
    }
  });

  onMounted(() => {
    if (route.query.registered === 'true') {
      successMessage.value = '¡Registro exitoso! Por favor, inicia sesión.';
    }
  });

  if (authStore.isAuthenticated) {
    router.push('/app/companies');
  }

  const { isVisible: isPasswordVisible, fieldType: passwordFieldType, toggle: togglePassword } = usePasswordVisibility();
</script>

<template>  
  <div class="flex items-center justify-center min-h-screen bg-base-200 p-4">
    <div class="card w-full max-w-sm shrink-0 bg-base-100 shadow-xl border border-base-300">
      
      <form @submit="onSubmit" class="card-body">
        <h1 class="card-title text-2xl mb-4 text-center block">Personal Admin</h1>
        
        <div v-if="successMessage" class="alert alert-success text-sm">
          <span>{{ successMessage }}</span>
        </div>
        <div v-if="serverError" class="alert alert-error text-sm">
          <span>{{ serverError }}</span>
        </div>
                
        <div class="form-control">
          <label class="label"><span class="label-text">Usuario</span></label>
          <div class="relative">
            <input v-model="username" v-bind="usernameProps" type="text" placeholder="" class="input input-bordered w-full" />
            <span v-if="errors.username" class="text-error text-xs mt-1">{{ errors.username }}</span>
          </div>
        </div>              

        <div class="form-control">
          <label class="label"><span class="label-text">Contraseña</span></label>
          <div class="relative">
            <input 
              name="password"
              :type="passwordFieldType"
              class="input input-bordered w-full pr-10 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-pink-500 focus:invalid:outline-pink-500"
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
        
        <div class="form-control mt-6">
          <div class="relative">
            <button class="btn btn-primary w-full" type="submit" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="loading loading-spinner"></span>
              <span v-else>Iniciar Sesión</span>
            </button>
          </div>
        </div>
        
        <div class="text-center mt-4 text-sm">
          ¿No tienes una cuenta?
          <RouterLink :to="{ name: 'register' }" class="link link-primary">
            Regístrate aquí
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>