<!-- src/views/LoginView.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // El alias '@/' apunta a 'src/'

// --- LÓGICA DEL COMPONENTE ---

const router = useRouter()
const authStore = useAuthStore()

// Estado reactivo para el formulario y el UI
const username = ref('admin') // Relleno previo para pruebas
const password = ref('admin')
const errorMessage = ref<string | null>(null)
const isLoading = ref(false)

async function handleLogin() {
  isLoading.value = true
  errorMessage.value = null
  try {
    await authStore.login(username.value, password.value)
    
    // ¡Login exitoso! Redirigimos a la app principal.
    router.push('/app/contacts') 
    
  } catch (error) {
    // Manejo de errores de la API o de la red.
    errorMessage.value = 'Usuario o contraseña inválidos o error de conexión.'
  } finally {
    isLoading.value = false
  }
}

// Si el usuario ya está autenticado (ej: viene de otra URL), lo enviamos al app.
if (authStore.isAuthenticated) {
  router.push('/app/contacts')
}
</script>

<template>
  <!-- ESTRUCTURA HTML (Utiliza DaisyUI y Tailwind para el responsive) -->
  <div class="flex items-center justify-center min-h-screen bg-base-200 p-4">
    <div class="card w-full max-w-sm shrink-0 bg-base-100 shadow-xl border border-base-300">
      <form class="card-body" @submit.prevent="handleLogin">
        <h1 class="card-title text-2xl mb-4 text-center block">JobSpear Admin</h1>
        
        <!-- Mensaje de Error (v-if para mostrar/ocultar) -->
        <div v-if="errorMessage" class="alert alert-error text-sm">
            {{ errorMessage }}
        </div>
        
        <!-- Campo de Usuario -->
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

        <!-- Campo de Contraseña -->
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

        <!-- Botón de Envío -->
        <div class="form-control mt-6">
          <button 
            class="btn btn-primary" 
            type="submit" 
            :disabled="isLoading"
          >
            <!-- v-if/v-else para alternar el texto y el spinner -->
            <span v-if="isLoading" class="loading loading-spinner"></span>
            <span v-else>Iniciar Sesión</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Estilos específicos si se necesitan */
</style>