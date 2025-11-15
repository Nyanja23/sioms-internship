<script setup>
import { useAuthStore } from '@/store/auth';
const authtore = useAuthStore()
</script>

vue<template>
  <div class="container mt-5">
    <h2>Dashboard</h2>
    <p>Welcome, {{ authStore.user?.username || 'User' }}!</p>
    <router-link to="/products" class="btn btn-primary">Manage Products</router-link>
    <router-link to="/categories" class="btn btn-primary ms-2">Manage Categories</router-link>
    <button class="btn btn-danger ms-2" @click="authStore.logout">Logout</button>
  </div>
</template>