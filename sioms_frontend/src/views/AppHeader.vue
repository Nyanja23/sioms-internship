<script setup>
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
 (router.push('/login'))
}
</script>


<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
    <div class="container-fluid">
      <!-- Brand / Home Link -->
      <router-link class="navbar-brand fw-bold" to="/dashboard">
        🏠 SIOMS
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item ">
            <router-link class="nav-link " to="/dashboard">Dashboard</router-link>
          </li>
        </ul>

        <ul class="navbar-nav">
          <li class="nav-item">
            <button class="btn btn-outline-light" @click="logout">
              Logout ({{ authStore.user?.username || 'User' }})
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

