<script setup>
import { useAuthStore } from '@/store/auth';
const authStore = useAuthStore();
</script>
<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-column flex-md-row">
      <div class="d-flex align-items-center">
        <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
          {{ (authStore.user?.username || 'U').charAt(0).toUpperCase() }}
        </div>
        <div>
          <h2 class="mb-0">Dashboard</h2>
          <small class="text-muted">Welcome back, {{ authStore.user?.username || 'User' }}.</small>
        </div>
      </div>
      <div class="mt-3 mt-md-0">
        <button class="btn btn-outline-danger" @click="authStore.logout">Logout</button>
      </div>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
      <div class="col">
        <router-link to="/products" class="card h-100 text-decoration-none text-dark">
          <div class="card-body d-flex align-items-start">
            <div class="me-3 display-6">📦</div>
            <div>
              <h5 class="card-title">Products</h5>
              <p class="card-text text-muted mb-0">View and manage product inventory.</p>
            </div>
          </div>
          <div class="card-footer bg-transparent border-0">
            <span class="text-primary">Manage products →</span>
          </div>
        </router-link>
      </div>

      <div class="col">
        <router-link to="/categories" class="card h-100 text-decoration-none text-dark">
          <div class="card-body d-flex align-items-start">
            <div class="me-3 display-6">🗂️</div>
            <div>
              <h5 class="card-title">Categories</h5>
              <p class="card-text text-muted mb-0">Organize products by category.</p>
            </div>
          </div>
          <div class="card-footer bg-transparent border-0">
            <span class="text-primary">Manage categories →</span>
          </div>
        </router-link>
      </div>

      <div class="col">
        <router-link to="/order" class="card h-100 text-decoration-none text-dark">
          <div class="card-body d-flex align-items-start">
            <div class="me-3 display-6">🧾</div>
            <div>
              <h5 class="card-title">Create Order</h5>
              <p class="card-text text-muted mb-0">Quickly create a new sales order.</p>
            </div>
          </div>
          <div class="card-footer bg-transparent border-0">
            <span class="text-primary">Create order →</span>
          </div>
        </router-link>
      </div>

      <div class="col">
        <router-link to="/customers" class="card h-100 text-decoration-none text-dark">
          <div class="card-body d-flex align-items-start">
            <div class="me-3 display-6">👥</div>
            <div>
              <h5 class="card-title">Customers</h5>
              <p class="card-text text-muted mb-0">Manage customer records and contacts.</p>
            </div>
          </div>
          <div class="card-footer bg-transparent border-0">
            <span class="text-primary">Manage customers →</span>
          </div>
        </router-link>
      </div>

      <div class="col">
        <router-link to="/analytics" class="card h-100 text-decoration-none text-dark">
          <div class="card-body d-flex align-items-start">
            <div class="me-3 display-6">📊</div>
            <div>
              <h5 class="card-title">Analytics</h5>
              <p class="card-text text-muted mb-0">View sales and performance metrics.</p>
            </div>
          </div>
          <div class="card-footer bg-transparent border-0">
            <span class="text-info">Open analytics →</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar {
  width: 48px;
  height: 48px;
  font-weight: 700;
  font-size: 1.1rem;
}
.card:hover {
  transform: translateY(-4px);
  transition: transform 0.15s ease-in-out;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
}
.card .display-6 {
  line-height: 1;
}
.card-footer span {
  font-weight: 600;
}
@media (max-width: 576px) {
  .avatar {
    width: 40px;
    height: 40px;
  }
}
</style>