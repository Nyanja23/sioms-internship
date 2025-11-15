import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/store/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',

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
    },
    {
      path: '/products',
      name: 'Products',
      component: ()=>import('../views/ProductsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/categories',
      name: 'Categories',
      meta: {requiresAuth:true},
      component: ()=> import('../views/Categories.vue')
    },
    {
      path: '/order',
      name: 'Orders',
      component: ()=> import('../views/Orders.vue')
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
