import { useAuthStore } from '@/stores/auth'
import type { Router } from 'vue-router'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3300'

let routerInstance: Router | null = null;

export function setRouter(router: Router) {
  routerInstance = router;
}


class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

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
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  const finalOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const cleanBase = BASE_URL.replace(/\/$/, '');

    const apiPrefix = 'api'; 

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Une las tres partes. El resultado siempre será correcto.
    // Ej: "http://localhost:3300" + "/api" + "/auth/register"
    const url = `${cleanBase}/${apiPrefix}${cleanEndpoint}`;

    const response = await fetch(url, finalOptions);
    
    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {

      if (response.status === 401 || response.status === 403) {
        const authStore = useAuthStore();
        authStore.logout();

        if (routerInstance) {                    
          routerInstance.push({ 
            name: 'login', 
            query: { sessionExpired: 'true' } 
          });
        }
                
        throw new ApiError('Session expired', response.status, {});
      }

      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(errorData.error || `Error: ${response.status}`, response.status, errorData);
    }
    
    return await response.json()

  } catch (error) {
    console.error('API Client Error:', error)
    if (error instanceof ApiError) {      
      if (error.status === 401 || error.status === 403) {
        console.warn("Redirecting to login due to session expiration.");
      }
      throw error;
    }    
    throw new ApiError((error as Error)?.message || 'Unknown error', 0, {});
  }
}

export default {
  get: (endpoint: string) => apiClient(endpoint),
  post: (endpoint: string, body: any) => apiClient(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint: string, body: any) => apiClient(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint: string) => apiClient(endpoint, { method: 'DELETE' }),
}