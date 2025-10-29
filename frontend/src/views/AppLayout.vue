<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';
  import { RouterLink, RouterView, useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';

  // Importa todos los iconos de Lucide que necesitaremos
  import { 
    Building2, 
    UsersRound, 
    History, 
    ChevronsLeft, 
    ChevronsRight, 
    Sun, 
    Moon 
  } from 'lucide-vue-next';

  // --- ESTADO ---
  const authStore = useAuthStore();
  const router = useRouter();

  // ¡ESTADO CLAVE! 'isCollapsed' controlará el estado de la barra lateral.
  // Leemos el valor guardado en localStorage al iniciar, con 'true' (colapsado) como valor por defecto.
  const isCollapsed = ref(JSON.parse(localStorage.getItem('sidebarCollapsed') || 'true'));

  // --- LÓGICA DE TEMA (SIN CAMBIOS) ---
  const theme = ref(localStorage.getItem('theme') || 'business');
  watch(theme, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }, { immediate: true });
  function toggleTheme() {
    theme.value = theme.value === 'corporate' ? 'business' : 'corporate';
  }

  // OLD
//   const getInitialTheme = (): 'nord' | 'business' => {
//   const savedTheme = localStorage.getItem('theme')
//   if (savedTheme === 'nord' || savedTheme === 'business') {
//     return savedTheme
//   }
//   if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
//     return 'business'
//   }
//   return 'nord'
// }


  // --- MÉTODOS ---
  function handleLogout() {
    authStore.logout();
    router.push({ name: 'login' });
  }

  // Función para alternar el estado de la barra lateral
  function toggleSidebar() {
    isCollapsed.value = !isCollapsed.value;
    // Guardamos la preferencia del usuario en localStorage
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed.value));
  }
</script>

<template>
  <div class="flex bg-base-200 min-h-screen">
    
    <!-- ======================================= -->
    <!--          BARRA LATERAL (ASIDE)          -->
    <!-- ======================================= -->
    <aside 
      class="fixed top-4 bottom-4 left-4 transition-all duration-300 ease-in-out z-50"
      :class="isCollapsed ? 'w-20' : 'w-64'"
    >
      <div class="h-full flex flex-col bg-base-100 rounded-lg shadow-lg p-2">
        
        <!-- Logo y Botón de Colapsar -->
        <div class="flex items-center" :class="isCollapsed ? 'justify-center' : 'justify-between'">
          <!-- Placeholder de Logo (solo visible cuando está expandido) -->
          <div v-if="!isCollapsed" class="avatar">
            <div class="w-10 rounded-full bg-primary flex items-center justify-center text-primary-content">
              <span>PA</span>
            </div>
          </div>
          <button @click="toggleSidebar" class="btn btn-ghost btn-square">
            <ChevronsLeft v-if="!isCollapsed" />
            <ChevronsRight v-else />
          </button>
        </div>

        <div class="divider my-2"></div>

        <!-- Menú de Navegación Principal -->
        <ul class="menu w-full flex flex-col m-0 p-0 relative z-50">
          <!-- Enlace a Compañías -->
          <li class="flex w-full relative focus-within:z-100">
            <div class="tooltip tooltip-right" :data-tip="isCollapsed ? 'Compañías' : ''">
              <RouterLink to="/app/companies" class="flex items-center h-12" :class="{ 'justify-center': isCollapsed }">
                <Building2 />
                <span v-if="!isCollapsed" class="ml-3">Compañías</span>
              </RouterLink>
            </div>
          </li>
          <!-- Enlace a Personas -->
          <li>
            <div class="tooltip tooltip-right" :data-tip="isCollapsed ? 'Personas' : ''">
              <RouterLink to="/app/people" class="flex items-center h-12" :class="{ 'justify-center': isCollapsed }">
                <UsersRound />
                <span v-if="!isCollapsed" class="ml-3">Personas</span>
              </RouterLink>
            </div>
          </li>
          <!-- Enlace a Historial -->
          <li>
            <div class="tooltip tooltip-right" :data-tip="isCollapsed ? 'Historial' : ''">
              <RouterLink to="/app/history" class="flex items-center h-12" :class="{ 'justify-center': isCollapsed }">
                <History />
                <span v-if="!isCollapsed" class="ml-3">Historial</span>
              </RouterLink>
            </div>
          </li>
        </ul>

        <!-- Acciones Inferiores (empujadas al final) -->
        <div class="mt-auto">
          <!-- Switch de Tema -->
          <div class="tooltip tooltip-right" :data-tip="isCollapsed ? 'Cambiar Tema' : ''">
            <label class="swap swap-rotate btn btn-ghost btn-block" :class="{ 'btn-square': isCollapsed }">
              <input type="checkbox" @change="toggleTheme" :checked="theme === 'dark'" />
              <Moon class="swap-on" />
              <Sun class="swap-off" />
            </label>
          </div>
          
          <!-- Menú de Usuario -->
          <div class="dropdown dropdown-top dropdown-right w-full mt-2">
            <div tabindex="0" role="button" class="btn btn-ghost btn-block h-12" :class="{ 'btn-square': isCollapsed }">
              <div class="avatar">
                <div class="w-8 rounded-full">
                  <img alt="User Avatar" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
              </div>
            </div>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-1">
              <li><a>Perfil</a></li>
              <li><a>Configuración</a></li>
              <div class="divider my-1"></div>
              <li><a @click="handleLogout">Cerrar Sesión</a></li>
            </ul>
          </div>
        </div>
      </div>
    </aside>

    <!-- ======================================= -->
    <!--        CONTENIDO PRINCIPAL (MAIN)       -->
    <!-- ======================================= -->
    <main 
      class="grow transition-all duration-300 ease-in-out p-4 md:p-10"
      :class="isCollapsed ? 'ml-24' : 'ml-68'"
    >
      <RouterView />
    </main>
    
  </div>
</template>

<style>
.menu a.router-link-active {
  /*
    '--p' es la variable para el color 'primary'.
    '--pc' es la variable para el color 'primary-content' (el texto).
    'hsl()' es necesario porque DaisyUI almacena los colores como valores HSL.
  */
  background-color: hsl(var(--p));
  color: hsl(var(--pc));
}
</style>

