import { useAuthStore } from '@/stores/auth'

const BASE_URL = 'https://api.sebastiangonzalez.co' // Tu URL base de la API

/**
 * Una función wrapper para el 'fetch' nativo que se encarga de:
 * 1. Añadir la URL base a cada petición.
 * 2. Adjuntar el token de autenticación si existe.
 * 3. Establecer las cabeceras comunes (Content-Type).
 * 4. Manejar las respuestas y los errores de forma consistente.
 */
async function apiClient(endpoint: string, options: RequestInit = {}) {
  const authStore = useAuthStore()
  const token = authStore.token

  // Configuración por defecto de las cabeceras
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }

  // Si tenemos un token, lo añadimos a la cabecera de Autorización
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  // Unimos las cabeceras por defecto con cualquier cabecera que se pase en las opciones
  const finalOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, finalOptions)

    // Si la respuesta no es OK (ej. 401, 404, 500), lanzamos un error
    if (!response.ok) {
      // Intentamos obtener más detalles del error desde el cuerpo de la respuesta
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
    }
    
    // Si la respuesta es OK, devolvemos los datos en formato JSON
    return await response.json()

  } catch (error) {
    console.error('API Client Error:', error)
    // Re-lanzamos el error para que el componente que hizo la llamada pueda manejarlo
    throw error
  }
}

// Exportamos métodos de conveniencia para los verbos HTTP más comunes
export default {
  get: (endpoint: string) => apiClient(endpoint),
  post: (endpoint: string, body: any) => apiClient(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint: string, body: any) => apiClient(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint: string) => apiClient(endpoint, { method: 'DELETE' }),
}