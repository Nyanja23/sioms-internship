<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
const email = ref('');
const username = ref('');
const password = ref('');
const role = ref('');
const router = useRouter()
const authStore = useAuthStore();

const handleRegister = async ()=>{
    try{
        await authStore.register(username.value, password.value, email.value, role.value)
    }catch(error){
        alert('Registration Failed: '+ error.message);
    }
}
</script>

<template>
    <div class="container mt-5">
        <h2>Register</h2>
        <form @submit.prevent="handleRegister">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input v-model="username" type="text" class="form-control" id="username" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input v-model="email" type="email" class="form-control" id="email" required>
            </div>

            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input v-model="password" type="password" class="form-control" id="password" required>
            </div>

            <div class="mb-3">
                <label for="role" class="form-label">Role</label>
                <select v-model="role" class="form-select" id="role" required>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <button type="submit" class="btn btn-lg btn-primary mt-3">Register</button>
        </form>

        <p class="3">
            Already have a account? <router-link to="/login">Login</router-link>
        </p>
    </div>
</template>