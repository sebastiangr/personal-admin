import { useAuthStore } from '@/stores/auth'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3300'

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
    // const response = await fetch(`${BASE_URL}${endpoint}`, finalOptions)
    // const url = `${BASE_URL}/api${endpoint}`;
    // --- CONSTRUCCIÓN DE URL ROBUSTA ---

    // 1. Limpia la URL base para que NUNCA tenga una barra al final.
    const cleanBase = BASE_URL.replace(/\/$/, '');

    // 2. Limpia el prefijo de la API para que NUNCA tenga una barra al principio.
    const apiPrefix = 'api'; 

    // 3. Limpia el endpoint para que SIEMPRE tenga una barra al principio.
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // 4. Une las tres partes. El resultado siempre será correcto.
    // Ej: "http://localhost:3300" + "/api" + "/auth/register"
    const url = `${cleanBase}/${apiPrefix}${cleanEndpoint}`;

    // --- FIN DE LA CONSTRUCCIÓN DE URL ---

    const response = await fetch(url, finalOptions);
    
    if (response.status === 204) {
      return null;
    }

    // Si la respuesta no es OK (ej. 401, 404, 500), lanzamos un error
    if (!response.ok) {
      // Intentamos obtener más detalles del error desde el cuerpo de la respuesta
      const errorData = await response.json().catch(() => ({}))
      // throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
      throw new ApiError(errorData.error || `Error: ${response.status}`, response.status, errorData);
    }
    
    // Si la respuesta es OK, devolvemos los datos en formato JSON
    return await response.json()

  } catch (error) {
    console.error('API Client Error:', error)
    if (error instanceof ApiError) {
      throw error;
    }    
    // Re-lanzamos el error para que el componente que hizo la llamada pueda manejarlo
    throw new ApiError((error as Error)?.message || 'Unknown error', 0, {});
  }
}

// Exportamos métodos de conveniencia para los verbos HTTP más comunes
export default {
  get: (endpoint: string) => apiClient(endpoint),
  post: (endpoint: string, body: any) => apiClient(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint: string, body: any) => apiClient(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint: string) => apiClient(endpoint, { method: 'DELETE' }),
}