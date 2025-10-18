<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { RouterLink, useRouter, useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

  const username = ref('admin')
  const password = ref('admin')
  const errorMessage = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const isLoading = ref(false)
  
  onMounted(() => {
    if (route.query.registered === 'true') {
      successMessage.value = '¡Registro exitoso! Por favor, inicia sesión.'
    }
  })

  async function handleLogin() {
    isLoading.value = true
    errorMessage.value = null
    successMessage.value = null
    try {
      await authStore.login(username.value, password.value)
      router.push({ name: 'companies' })
    } catch (error) {
      errorMessage.value = 'Usuario o contraseña inválidos.'
    } finally {
      isLoading.value = false
    }
  }

  if (authStore.isAuthenticated) {
    router.push('/app/companies')
  }
</script>

<template>  

  <div class="flex items-center justify-center min-h-screen bg-base-200 p-4">
    <div class="card w-full max-w-sm shrink-0 bg-base-100 shadow-xl border border-base-300">
      <form class="card-body" @submit.prevent="handleLogin">
        <h1 class="card-title text-2xl mb-4 text-center block">Personal Admin</h1>
        
        <div v-if="successMessage" class="alert alert-success text-sm">
          <span>{{ successMessage }}</span>
        </div>
        <div v-if="errorMessage" class="alert alert-error text-sm">
          <span>{{ errorMessage }}</span>
        </div>
                
        <div class="form-control">
          <label class="label"><span class="label-text">Usuario</span></label>
          <input 
            v-model="username"
            type="text" 
            placeholder="admin" 
            class="input input-bordered w-full" 
            required 
          />
        </div>      
        
        <div class="form-control">
          <label class="label"><span class="label-text">Contraseña</span></label>
          <input 
            v-model="password"
            type="password" 
            placeholder="contraseña" 
            class="input input-bordered w-full" 
            required 
          />
        </div>        
        
        <div class="form-control mt-6">
          <button class="btn btn-primary" type="submit" :disabled="isLoading">
            <span v-if="isLoading" class="loading loading-spinner"></span>
            <span v-else>Iniciar Sesión</span>
          </button>
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

<style scoped>
/* Estilos específicos si se necesitan */
</style>