<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Sun, Moon, SearchCode } from 'lucide-vue-next'

// --- LÓGICA DEL LAYOUT ---
const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  // 1. Llama a la acción del store para limpiar el estado y el token.
  authStore.logout()
  
  // 2. Redirige al usuario a la página de login.
  // Usamos router.push() para navegar programáticamente.
  router.push({ name: 'login' })
}


// Theme selection
const getInitialTheme = (): 'nord' | 'business' => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'nord' || savedTheme === 'business') {
    return savedTheme
  }
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'business'
  }
  return 'nord'
}

const theme = ref<'nord' | 'business'>(getInitialTheme())

function toggleTheme() {
  theme.value = theme.value === 'nord' ? 'business' : 'nord'
}

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('theme', theme.value)
})

</script>

<template>
  <div class="flex flex-col min-h-screen bg-base-200">
    <!-- BARRA DE NAVEGACIÓN SUPERIOR -->
    <header class="navbar bg-base-100 shadow-md sticky top-0 z-50">
      
      <!-- Lado Izquierdo: Título de la App -->
      <div class="navbar-start ml-6">
        <SearchCode
          color="grey"
          :size="32"
          :stroke-width="1.25"
        />        
        <RouterLink to="/app" class="btn btn-ghost text-xl">
          Personal Admin
        </RouterLink>
      </div>

      <!-- TODO: Improve nav links -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li>
            <!-- 
              RouterLink es el componente de Vue Router para crear enlaces.
              Es como una etiqueta <a> pero integrada con el historial del navegador.
              La clase 'router-link-active' se añade automáticamente al enlace
              de la página actual, lo que nos permite estilizarlo.
            -->
            <RouterLink to="/app/companies">Compañías</RouterLink>
          </li>
          <li>
            <RouterLink to="/app/people">Personas</RouterLink>
          </li>
          <li>
            <RouterLink to="/app/history">Historial</RouterLink>
          </li>
        </ul>
      </div>

      <!-- Lado Derecho: Acciones de Usuario -->
      <div class="navbar-end">

        <label class="swap swap-rotate btn btn-ghost btn-circle mr-2">
          <!-- 
            Este checkbox invisible sigue siendo necesario. Es el "motor" del componente swap.
            DaisyUI se encarga de ocultarlo visualmente.
          -->
          <input 
            type="checkbox" 
            @change="toggleTheme"
            :checked="theme === business"
          />
          
          <!-- Icono de Luna: se muestra cuando el tema es 'dark' (checkbox 'checked') -->
          <Moon class="swap-on h-5 w-5" />
          
          <!-- Icono de Sol: se muestra cuando el tema es 'light' (checkbox 'unchecked') -->
          <Sun class="swap-off h-5 w-5" />
        </label>

        <!-- Placeholder: Botón de Settings -->
        <button class="btn btn-ghost btn-circle">
          <div class="indicator">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span class="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
        
        <!-- Dropdown de Usuario -->
        <div class="dropdown dropdown-end ml-2">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <!-- Placeholder: Avatar de Usuario -->
              <img alt="User Avatar" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a class="justify-between">Perfil <span class="badge">Nuevo</span></a></li>
            <li><a>Configuración</a></li>
            <div class="divider my-1"></div>
            <li><a @click="handleLogout">Cerrar Sesión</a></li>
          </ul>
        </div>
      </div>
    </header>

    <!-- CONTENIDO PRINCIPAL DE LA PÁGINA -->
    <main class="flex-grow p-4 md:p-8">
      <!-- 
        RouterView aquí renderizará el componente de la ruta hija actual.
        Si la URL es /app/contacts, aquí se mostrará ContactsView.vue.
        Si la URL es /app/history, aquí se mostrará HistoryView.vue.
      -->
      <RouterView />
    </main>
  </div>
</template>

<style>
  /* 
    Añadimos un estilo global para los enlaces activos del router.
    Este estilo no es 'scoped' para que se aplique a los RouterLink.
  */
  .menu a.router-link-active {
    background-color: green;
  }
</style>