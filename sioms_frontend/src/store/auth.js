import { defineStore } from "pinia";
import { ref } from 'vue'
import axios from "axios";
import router from "@/router";

export const useAuthStore = defineStore('auth', ()=>{
    const user = ref(null)
    const token = ref(null)

    // Keep storage keys consistent: access_token & refresh_token
    const loadFromStorage = () => {
      const savedToken = localStorage.getItem('access_token')
      if (savedToken) {
        token.value = savedToken
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
        // Optional: fetch user info if you store more than username
        user.value = { username: 'Restored' } // or decode JWT if needed
      }
    }

    async function login(username, password){
        try{
            const response = await axios.post('http://localhost:8000/api/token/', {
                username, password
            })
            token.value = response.data.access; // access token
            user.value = {username};

            localStorage.setItem('access_token', token.value);
            if (response.data.refresh) {
              localStorage.setItem('refresh_token', response.data.refresh)
            }
            axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;

        }catch(error){
            console.error('Login error:', error.response || error);
            throw new Error('Login Failed')
        }
    }

    async function register(username, password, email, role) {
        try{
           const response = await axios.post('http://localhost:8000/api/auth/register/', {
             username,
             password,
             email,
             role
           })
           // If registration returns tokens, set them; otherwise just set user
           if (response.data?.access) {
             token.value = response.data.access;
             localStorage.setItem('access_token', token.value);
             axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
           }
           user.value = { username, email, role}

        }catch(err){
            console.error('Register error:', err.response || err);
            throw new Error('Registration Failed')
        }
    }

    const refreshAccessToken = async ()=>{
        const refresh = localStorage.getItem('refresh_token')
        if(!refresh){
            throw new Error('No Refresh Token!')
        }
        try{
            const res  = await axios.post('http://localhost:8000/api/token/refresh/', {
                refresh
            })

            // Expecting { access: '...' }
            if (!res.data?.access) throw new Error('Invalid refresh response')

            localStorage.setItem('access_token', res.data.access)
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`

            token.value = res.data.access
            return res.data.access

        }catch(error){
            // Clear local auth and navigate to login
            logout()
            try { router.push('/login'); } catch(e) { /* silent */ }
            throw error
        }
    }

    function logout(){
        user.value = null;
        token.value = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete axios.defaults.headers.common['Authorization'];
        try { router.push('/login'); } catch(e) { /* silent */ }
    }

    // ←← CALL this IMMEDIATELY so store is ready before router guard
    loadFromStorage()

    return { user, token, login, register, logout, refreshAccessToken }
})