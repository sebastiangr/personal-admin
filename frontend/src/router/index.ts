import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

// const CompaniesView = () => import('@/views/app/CompaniesView.vue')
// const HistoryView = () => import('@/views/app/HistoryView.vue')



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/app/companies' },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    
    // --- RUTAS PROTEGIDAS ---
    {
      path: '/app',
      name: 'app',
      redirect: '/app/companies',      
      component: () => import('@/views/AppLayout.vue'),
      children: [
        {
          path: 'companies',
          name: 'companies',          
          component: () => import('@/views/app/CompaniesView.vue'), // ¡Apunta al nuevo archivo!
          meta: { requiresAuth: true }
        },
        // {
        //   path: 'history',
        //   name: 'history',
        //   component: HistoryView,
        //   meta: { requiresAuth: true }
        // },
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
