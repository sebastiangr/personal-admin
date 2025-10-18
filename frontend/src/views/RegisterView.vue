<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import apiClient from '@/utils/api'

// --- ESTADO ---
const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref<string | null>(null)
const isLoading = ref(false)

// --- MÉTODOS ---
async function handleRegister() {
  // Validación simple en el frontend
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden.'
    return
  }

  isLoading.value = true
  errorMessage.value = null

  try {
    // Llamamos al nuevo endpoint de registro en el backend
    await apiClient.post('/auth/register', {
      username: username.value,
      password: password.value,
    })

    // Si el registro es exitoso, redirigimos al usuario a la página de login
    // para que inicie sesión con sus nuevas credenciales.
    router.push({ name: 'login', query: { registered: 'true' } })

  } catch (error: any) {
    if (error.response?.data?.error) {
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = 'Ocurrió un error durante el registro.'
    }
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-base-200 p-4">
    <div class="card w-full max-w-sm shrink-0 bg-base-100 shadow-xl border border-base-300">
      <form class="card-body" @submit.prevent="handleRegister">
        <h1 class="card-title text-2xl mb-4">Crear una Cuenta</h1>

        <div v-if="errorMessage" class="alert alert-error text-sm">
          <span>{{ errorMessage }}</span>
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text">Nombre de Usuario</span></label>
          <input v-model="username" type="text" placeholder="usuario" class="input input-bordered" required />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text">Contraseña</span></label>
          <input v-model="password" type="password" placeholder="contraseña" class="input input-bordered" required />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text">Confirmar Contraseña</span></label>
          <input v-model="confirmPassword" type="password" placeholder="confirmar" class="input input-bordered" required />
        </div>

        <div class="form-control mt-6">
          <button class="btn btn-primary" type="submit" :disabled="isLoading">
            <span v-if="isLoading" class="loading loading-spinner"></span>
            <span v-else>Registrarse</span>
          </button>
        </div>

        <div class="text-center mt-4 text-sm">
          ¿Ya tienes una cuenta?
          <RouterLink :to="{ name: 'login' }" class="link link-primary">
            Inicia sesión
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>