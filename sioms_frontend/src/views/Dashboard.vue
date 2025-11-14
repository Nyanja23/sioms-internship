<script setup>
import { useAuthStore } from '@/store/auth';
const authtore = useAuthStore()
</script>

<template>
    <div class="container mt-5">
        <h2>Dashboard</h2>
        <p>Welcome, {{ authtore.user?.username ||  'User'}}!</p>
        <button class="btn btn-danger">Logout</button>
    </div>
</template>