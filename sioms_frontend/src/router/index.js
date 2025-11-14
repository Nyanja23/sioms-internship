import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/store/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',

    },
    {
      path: '/login',
      name: 'Login',
      component: ()=> import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: ()=> import('../views/RegisterView.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashoard',
      component: ()=> import('../views/Dashboard.vue'),
      meta: {requiresAuth: true}
    }
  ],
})

router.beforeEach((to, from, next)=>{
  const authStore = useAuthStore();
  if(to.meta.requiresAuth && !authStore.token){
    next('/login')
  }else {
    next()
  }
})

export default router
