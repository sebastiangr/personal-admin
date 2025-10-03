// src/stores/auth.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// NOTA: No usamos useRouter aquí para evitar problemas de acoplamiento.
// La redirección la manejaremos en el componente o el router global.

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  // ref() hace que la variable sea reactiva.
  const token = ref<string | null>(localStorage.getItem('authToken'))
  
  // --- GETTERS (Estado Derivado) ---
  // computed() se recalcula automáticamente si 'token.value' cambia.
  const isAuthenticated = computed(() => !!token.value)

  // --- ACTIONS (Métodos) ---

  /**
   * Guarda el token en el estado de Pinia y en localStorage.
   * @param {string} newToken - El token JWT recibido de la API.
   */
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('authToken', newToken)
  }

  /**
   * Intenta hacer login llamando a la API.
   */
  async function login(username: string, password: string) {
    const LOGIN_URL = 'https://api.sebastiangonzalez.co/auth/login' // <-- AJUSTA TU URL AQUÍ

    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      // Si el código de estado no es 2xx, lanza un error.
      throw new Error('Invalid credentials')
    }

    const data = await response.json()
    setToken(data.token)
    // No redirigimos aquí. La vista será responsable de la navegación.
  }

  /**
   * Cierra la sesión del usuario.
   */
  function logout() {
    token.value = null
    localStorage.removeItem('authToken')
  }

  return { token, isAuthenticated, login, logout, setToken }
})