<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const products = ref([]);
const categories = ref([]);
const newProduct = ref({
    name: '',
    category_id: null,
    stock: 0,
    price: 0,
})
const isLoading = ref(false)
const showAddForm = ref(false);
const authStore = useAuthStore()

const fetchProducts = async ()=>{
    try{
        const response = await axios.get('http://localhost:8000/api/products/');
        products.value = response.data
    }catch(error){
        console.error('Error while fetching Products: ', error.response || error);
        alert('Failed to load Products')
    }
}

const fetchCategories = async ()=>{
    try{
        const response = await axios.get('http://localhost:8000/api/categories/');

        categories.value = response.data;

    }catch(error){
        console.error("Error Occured while fetching Categories: ", error.response || error);
        alert('Failed to load Categories');
    }
}

const addProduct = async ()=>{
    isLoading = true;

    try{
        const response = await axios.post('http://localhost:8000/api/products/', newProduct.value);

        newProduct.value = {
              name: '',
            category_id: null,
            stock: 0,
            price: 0,
        }

        showAddForm = false;

        await fetchProducts()

        alert('Product Added Successfully')

    }catch(error){
        console.error('Failed to Add Product: ', error.response || error);
        alert('Failed to add Product')
    }
}

onMounted(()=>{
    if(authStore.token){
        axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`
    }
    fetchProducts();
    fetchCategories();
})
</script>

<template>
    <div class="container mt-5">
        <h2>Products</h2>
        <button class="btn btn-primary mb-3" @click="showAddForm = true">Add Product</button>

        <div v-if="showAddForm" class="card mb-3">
            <div class="card-body">
                <h5>Add Product</h5>
                <form @submit.prevent="addProduct" >

                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input v-model="newProduct.name" type="text" class="form-control" id="name" required>
                    </div>

                    <div class="mb-3">
                        <label for="category" class="form-label">Category</label>

                        <select v-model="newProduct.category_id" id="category" class="form-select" required>
                            <option v-for="category in categories"  :key="category.id" :value="category.id">
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

                    <!-- Form btns -->
                    <button type="submit" class="btn btn-success mt-3">Add</button>
                    <button type="button" class="btn btn-secondary ms-2"> Cancel</button>


                </form>
            </div>
        </div>

        <!-- table -->
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

            </tbody>
         </table>
    </div>
</template>