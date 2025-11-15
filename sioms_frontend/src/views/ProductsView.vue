<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const products = ref([]);
const categories = ref([]);
const newProduct = ref({ name: '', category_id: null, stock: 0, price: 0 });
const showAddForm = ref(false);
const isLoading = ref(false);
const authStore = useAuthStore();

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/products/');
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error.response || error);
    alert('Failed to load products');
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/categories/');
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error.response || error);
    alert('Failed to load categories');
  }
};

const addProduct = async () => {
  isLoading.value = true;
  try {
    await axios.post('http://localhost:8000/api/products/', newProduct.value);
    newProduct.value = { name: '', category_id: null, stock: 0, price: 0 };
    showAddForm.value = false;
    await fetchProducts();
    alert('Product added successfully');
  } catch (error) {
    console.error('Error adding product:', error.response || error);
    alert('Failed to add product');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (authStore.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
  }
  fetchProducts();
  fetchCategories();
});
</script>
<template>
  <div class="container mt-5">
    <h2>Products</h2>
    <button class="btn btn-primary mb-3" @click="showAddForm = true">Add Product</button>
    <div v-if="showAddForm" class="card mb-3">
      <div class="card-body">
        <h5>Add Product</h5>
        <div v-if="!categories.length" class="alert alert-warning">
          No categories available. <router-link to="/categories">Create a category</router-link> first.
        </div>
        <form v-else @submit.prevent="addProduct">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input v-model="newProduct.name" type="text" class="form-control" id="name" required>
          </div>
          <div class="mb-3">
            <label for="category" class="form-label">Category</label>
            <select v-model="newProduct.category_id" class="form-select" id="category" required>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="stock" class="form-label">Stock</label>
            <input v-model.number="newProduct.stock" type="number" class="form-control" id="stock" required>
          </div>
          <div class="mb-3">
            <label for="price" class="form-label">Price</label>
            <input v-model.number="newProduct.price" type="number" step="0.01" class="form-control" id="price" required>
          </div>
          <button type="submit" class="btn btn-success" :disabled="isLoading">Add</button>
          <button type="button" class="btn btn-secondary ms-2" @click="showAddForm = false">Cancel</button>
        </form>
      </div>
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Stock</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.category?.name || 'None' }}</td>
          <td>{{ product.stock }}</td>
          <td>UGX {{ product.price }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>