// src/utils/axios.js or in main.js
import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/store/auth'

// Response interceptor to attempt refresh on 401
axios.interceptors.response.use(
  (response) => response,                         // success → just return
  async (error) => {
    // lazy-get the store so Pinia is initialized
    const authStore = useAuthStore()
    const originalRequest = error.config

    // Only try once per request
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true                     // prevent infinite loop
      try {
        const newToken = await authStore.refreshAccessToken()
        // ensure headers exist and set Authorization for the retried request
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`

        return axios(originalRequest)                   // retry original request
      } catch (refreshError) {
        // if refresh fails, make sure user is redirected to login
        try { authStore.logout && authStore.logout() } catch(e) {}
        try { router.push('/login') } catch(e) {}
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)