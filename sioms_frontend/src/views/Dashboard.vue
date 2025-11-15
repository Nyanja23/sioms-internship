<script setup>
import { useAuthStore } from '@/store/auth';
const authtore = useAuthStore()
</script>

<template>
    <div class="container mt-5">
        <h2>Dashboard</h2>
        <p>Welcome, {{ authtore.user?.username ||  'User'}}!</p>
        <router-link to="/products" class="btn btn-primary mt-3 p-3">Manage Products</router-link>
        
        <button @click="authtore.logout" class="btn btn-danger">Logout</button>
    </div>
</template>