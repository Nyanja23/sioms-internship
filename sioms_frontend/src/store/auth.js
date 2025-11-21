import { defineStore } from "pinia";
import { ref } from 'vue'
import axios from "axios";

export const useAuthStore = defineStore('auth', ()=>{
    const user = ref(null)
    const token = ref(null)

    const loadFromStorage = () => {
    const savedToken = localStorage.getItem('token')
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
            token.value = response.data.access;
            user.value = {username};

            localStorage.setItem('token', token.value);
            
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
           token.value = response.data.access;
           user.value = { username, email, role}

           localStorage.setItem('token', token.value);

           axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
           
        }catch(err){
            console.error('Register error:', err.response || err);
            throw new Error('Registration Failed')
        }
    }

    function logout(){
        user.value = null;
        token.value = null;
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    }

    // ←← CALL this IMMEDIATELY so store is ready before router guard
    loadFromStorage()

    return { user, token, login, register, logout}
})