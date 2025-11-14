<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const username = ref('')
const password = ref('')
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async ()=>{
    try{
        await authStore.login(username.value, password.value);
        router.push('/dashboard');
    }catch(error){
        alert('Login Failed: '+ error.message)
    }
}

</script>


<template>
    <div class="container mt-5">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input class="form-control" type="text" v-model="username" id="username" required>
            </div>

            <div class="b-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" v-model="password" id="password" class="form-control" required>
            </div>

            <button type="submit" class="btn btn-lg mt-3 btn-primary">Login</button>
        </form>
        <p class="mt-3">
            No account? <RouterLink to="/register">Register</RouterLink>
        </p>
    </div>
</template>