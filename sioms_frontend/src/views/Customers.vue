<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const customers = ref([])
const loading = ref(false)
const showAddForm = ref(false)
const searchQuery = ref('')

const filteredCustomers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return customers.value
  return customers.value.filter((c) => {
    return [c.name, c.email, c.phone, c.address].some((field) =>
      field ? String(field).toLowerCase().includes(q) : false
    )
  })
})

const form = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

const editingCustomer = ref(null)

const fetchCustomers = async () => {
  try {
    const res = await axios.get('https://sioms-internship.onrender.com/api/customers/')
    customers.value = res.data
  } catch (err) {
    console.error(err)
    alert('Failed to load customers')
  }
}

const saveCustomer = async () => {
  loading.value = true
  try {
    if (editingCustomer.value?.id) {
      await axios.put(
        `https://sioms-internship.onrender.com/api/customers/${editingCustomer.value.id}/`,
        form.value
      )
    } else {
      await axios.post('https://sioms-internship.onrender.com/api/customers/', form.value)
    }
    resetForm()
    await fetchCustomers()
  } catch (err) {
    console.error(err)
    alert('Save failed')
  } finally {
    loading.value = false
  }
}

const editCustomer = (customer) => {
  editingCustomer.value = customer
  form.value = { ...customer }
  showAddForm.value = true
}

const deleteCustomer = async (id) => {
  if (!confirm('Delete this customer?')) return
  try {
    await axios.delete(`https://sioms-internship.onrender.com/api/customers/${id}/`)
    await fetchCustomers()
  } catch (err) {
    alert('Delete failed')
  }
}

const cancelForm = () => {
  resetForm()
}

const resetForm = () => {
  form.value = { name: '', email: '', phone: '', address: '' }
  editingCustomer.value = null
  showAddForm.value = false
}

onMounted(() => {
  if (authStore.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`
  }
  fetchCustomers()
})
</script>

<template>
  <div class="container mt-5">
    <h2>Customers</h2>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="w-50 me-3">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control"
          placeholder="Search customers by name, email, phone or address"
        />
      </div>

      <button class="btn btn-primary" @click="showAddForm = true">
        Add Customer
      </button>
    </div>

    <!-- Add / Edit Form -->
    <div v-if="showAddForm" class="card mb-4">
      <div class="card-body">
        <h5>{{ editingCustomer?.id ? 'Edit' : 'Add' }} Customer</h5>
        <form @submit.prevent="saveCustomer">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input v-model="form.name" type="text" class="form-control" id="name" required />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" id="email" required />
          </div>
          <div class="mb-3">
            <label for="phone" class="form-label">Phone</label>
            <input v-model="form.phone" type="text" class="form-control" id="phone" />
          </div>
          <div class="mb-3">
            <label for="address" class="form-label">Address</label>
            <textarea v-model="form.address" class="form-control" id="address" rows="3"></textarea>
          </div>

          <button type="submit" class="btn btn-success me-2" :disabled="loading">
            {{ editingCustomer?.id ? 'Update' : 'Create' }}
          </button>
          <button type="button" class="btn btn-secondary" @click="cancelForm">
            Cancel
          </button>
        </form>
      </div>
    </div>

    <!-- Customers Table -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in filteredCustomers" :key="customer.id">
          <td>{{ customer.id }}</td>
          <td>{{ customer.name }}</td>
          <td>{{ customer.email }}</td>
          <td>{{ customer.phone || '-' }}</td>
          <td>{{ customer.address || '-' }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-1" @click="editCustomer(customer)">
              Edit
            </button>
            <button class="btn btn-sm btn-danger" @click="deleteCustomer(customer.id)">
              Delete
            </button>
          </td>
        </tr>
        <tr v-if="filteredCustomers.length === 0">
          <td colspan="6" class="text-center text-muted">
            No customers found.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

