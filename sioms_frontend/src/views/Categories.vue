<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const categories = ref([]);
const newCategory = ref({ name: '', description: '' });
const showAddForm = ref(false);
const isLoading = ref(false);
const authStore = useAuthStore();

const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/categories/');
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error.response || error);
    alert('Failed to load categories');
  }
};

const addCategory = async () => {
  isLoading.value = true;
  try {
    await axios.post('http://localhost:8000/api/categories/', newCategory.value);
    newCategory.value = { name: '', description: '' };
    showAddForm.value = false;
    await fetchCategories();
    alert('Category added successfully');
  } catch (error) {
    console.error('Error adding category:', error.response || error);
    alert('Failed to add category');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (authStore.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
  }
  fetchCategories();
});
</script>


<template>
  <div class="container mt-5">
    <h2>Categories</h2>
    <button class="btn btn-primary mb-3" @click="showAddForm = true">Add Category</button>
    <div v-if="showAddForm" class="card mb-3">
      <div class="card-body">
        <h5>Add Category</h5>
        <form @submit.prevent="addCategory">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input v-model="newCategory.name" type="text" class="form-control" id="name" required>
          </div>
          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea v-model="newCategory.description" class="form-control" id="description"></textarea>
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
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.id">
          <td>{{ category.id }}</td>
          <td>{{ category.name }}</td>
          <td>{{ category.description || 'None' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

