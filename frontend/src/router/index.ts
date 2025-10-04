import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'

const ContactsView = () => import('@/views/app/ContactsView.vue')
const HistoryView = () => import('@/views/app/HistoryView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/app/contacts' },
    { path: '/login', name: 'login', component: LoginView },
    
    // --- RUTAS PROTEGIDAS ---
    {
      path: '/app',
      name: 'app',
      redirect: '/app/contacts',
      // Este es el layout principal de la aplicación, donde irá el Navbar/Sidebar
      component: () => import('@/views/AppLayout.vue'),
      children: [
        {
          path: 'contacts',
          name: 'contacts',
          component: ContactsView,
          meta: { requiresAuth: true }
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
  // Primero, obtenemos el store
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Definimos qué rutas requieren autenticación
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // 1. Si la ruta requiere autenticación y el usuario NO está logueado
  if (requiresAuth && !isAuthenticated) {
    // Lo enviamos al login
    next({ name: 'login' })
  } 
  // 2. Si el usuario intenta ir al login pero YA está logueado
  else if (to.name === 'login' && isAuthenticated) {
    // Lo enviamos a la página principal de la app
    next({ name: 'contacts' })
  } 
  // 3. En todos los demás casos (ruta pública o ruta protegida con usuario logueado)
  else {
    // Permitimos que continúe a su destino
    next() 
  }
})

export default router