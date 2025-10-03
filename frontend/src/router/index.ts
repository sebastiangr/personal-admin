// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'

// Importación dinámica de la vista protegida
const ContactsView = () => import('@/views/app/ContactsView.vue')
const HistoryView = () => import('@/views/app/HistoryView.vue') // Aún no existe, pero la dejamos

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/app/contacts' }, // Redirige la raíz a la app
    { path: '/login', name: 'login', component: LoginView },
    
    // --- RUTAS PROTEGIDAS ---
    {
      path: '/app',
      name: 'app',
      redirect: '/app/contacts',
      // Este es el layout principal de la aplicación, donde irá el Navbar/Sidebar
      component: () => import('@/views/AppLayout.vue'), // PRÓXIMAMENTE: Creamos este AppLayout.vue
      children: [
        {
          path: 'contacts',
          name: 'contacts',
          component: ContactsView,
          meta: { requiresAuth: true } // ¡La etiqueta de seguridad!
        },
        {
          path: 'history',
          name: 'history',
          component: HistoryView,
          meta: { requiresAuth: true }
        },
        // ... otras rutas protegidas
      ]
    },
    // PRÓXIMAMENTE: Ruta 404
    // { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }
  ]
})

// --- GUARDIÁN DE RUTA (Navigation Guard) ---
// Se ejecuta ANTES de que cualquier ruta cambie.
router.beforeEach((to, from, next) => {
  next();
  const authStore = useAuthStore()
  
  // 1. Si la ruta requiere autenticación y NO estamos autenticados...
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirige a la página de login.
    next({ name: 'login' })
  } 
  // 2. Si la ruta es el login y SÍ estamos autenticados...
  else if (to.name === 'login' && authStore.isAuthenticated) {
    // Redirige a la página principal de la app.
    next({ name: 'contacts' })
  } 
  // 3. En cualquier otro caso, permite la navegación.
  else {
    next()
  }
})

export default router
// **NOTA IMPORTANTE:** El `router.beforeEach` es el **Guardián de Ruta**. Es el código que se ejecuta en cada navegación para comprobar la seguridad.

// import { createRouter, createWebHistory } from 'vue-router'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [],
// })

// export default router
