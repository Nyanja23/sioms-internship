<script setup>
import AppHeader from './views/AppHeader.vue';

import { useAuthStore } from './store/auth';

const authStore = useAuthStore()

</script>

<template>
  <div id="app">
    <AppHeader v-if="authStore.token"/>
  
    <RouterView/>
  
    <footer v-if="authStore.token" class="bg-light text-center py-3 mt-5">
      <router-link to="/dashboard" class="btn btn-sm btn-outline-primary">
        ← Back to Home
      </router-link>
    </footer>


  </div>
</template>

<style scoped></style>
