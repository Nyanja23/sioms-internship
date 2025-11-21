
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Chart } from 'chart.js/auto'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const stats = ref({
  totalRevenue: 0,
  totalOrders: 0,
  pendingOrders: 0
})

const statusChart = ref(null)
const monthlyChart = ref(null)
const topProductsChart = ref(null)

const fetchAnalytics = async () => {
  try {
    const [ordersRes, productsRes] = await Promise.all([
      axios.get('http://localhost:8000/api/orders/'),
      axios.get('http://localhost:8000/api/products/')
    ])

    const orders = ordersRes.data
    const products = productsRes.data

    // Basic stats
    stats.value.totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total), 0)
    stats.value.totalOrders = orders.length
    stats.value.pendingOrders = orders.filter(o => o.status === 'pending').length

    // Orders by status
    const statusCounts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1
      return acc
    }, {})

    new Chart(statusChart.value, {
      type: 'pie',
      data: {
        labels: Object.keys(statusCounts),
        datasets: [{
          data: Object.values(statusCounts),
          backgroundColor: ['#28a745', '#ffc107', '#007bff', '#dc3545']
        }]
      }
    })

    // Monthly trend (simplified - group by month)
    const monthly = orders.reduce((acc, o) => {
      const month = new Date(o.created_at).toLocaleString('default', { month: 'short', year: 'numeric' })
      acc[month] = (acc[month] || 0) + parseFloat(o.total)
      return acc
    }, {})

    new Chart(monthlyChart.value, {
      type: 'line',
      data: {
        labels: Object.keys(monthly),
        datasets: [{
          label: 'Revenue',
          data: Object.values(monthly),
          borderColor: '#28a745',
          fill: false
        }]
      }
    })

    // Top 5 products (by quantity sold)
    const productSales = {}
    orders.forEach(order => {
      order.items.forEach(item => {
        const name = item.product?.name || 'Unknown'
        productSales[name] = (productSales[name] || 0) + item.quantity
      })
    })

    const top5 = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    new Chart(topProductsChart.value, {
      type: 'bar',
      data: {
        labels: top5.map(p => p[0]),
        datasets: [{
          label: 'Units Sold',
          data: top5.map(p => p[1]),
          backgroundColor: '#007bff'
        }]
      }
    })

  } catch (error) {
    console.error('Analytics error:', error)
    alert('Failed to load analytics')
  }
}

onMounted(() => {
  if (authStore.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`
  }
  fetchAnalytics()
})
</script>

<template>
  <div class="container mt-5">
    <h2>Sales Analytics</h2>
    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Total Revenue</h5>
            <h3 class="text-success">${{ stats.totalRevenue.toFixed(2) }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Total Orders</h5>
            <h3 class="text-primary">{{ stats.totalOrders }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Pending Orders</h5>
            <h3 class="text-warning">{{ stats.pendingOrders }}</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 mb-4">
        <h4>Orders by Status</h4>
        <canvas ref="statusChart"></canvas>
      </div>
      <div class="col-md-6 mb-4">
        <h4>Monthly Sales Trend</h4>
        <canvas ref="monthlyChart"></canvas>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <h4>Top 5 Selling Products</h4>
        <canvas ref="topProductsChart"></canvas>
      </div>
    </div>
  </div>
</template>
