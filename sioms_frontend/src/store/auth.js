import { defineStore } from "pinia";
import { ref } from 'vue'
import axios from "axios";

export const useAuthStore = defineStore('auth', ()=>{
    const user = ref(null)
    const token = ref(null)

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
            throw new Error('Login Failed')
        }
    }


    async function register(username, password, email, role) {
        try{
           const response = await axios.post('http://localhost:8000/api/accounts/register/', {
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
            throw new Error('Registration Failed')
        }
    }

    function logout(){
        user.value = null;
        token.value = null;
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    }

    return { user, token, login, register, logout}
})