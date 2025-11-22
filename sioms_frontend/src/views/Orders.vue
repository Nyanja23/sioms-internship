<script setup>
import {ref, onMounted } from 'vue'
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const orders = ref([]);
const customers = ref([])
const products = ref([])
const newOrder = ref({
    customer_id: null,
    status: 'pending',
    total: 0,
    items: []
})

const showAddForm = ref(false);
const isLoading = ref(false);
const authStore = useAuthStore()

const fetchOrders = async ()=>{
    try{
        const response = await axios.get('https://sioms-internship.onrender.com/api/orders/');
        
        orders.value = response.data;

        console.log(orders.value)

    }catch(error){
        console.error('Error Fetching Orders: ', error.response || error);
        alert('Failed to load Orders')
    }
}

const fetchCustomers = async ()=>{
    try{
        const response = await axios.get('https://sioms-internship.onrender.com/api/customers/');
        customers.value = response.data;

    }catch(error){
        console.error('Failed to Load Customers: ', error.response || error)
        alert('Failed to Load Customers')
    }
}

const fetchProducts = async ()=>{
    try{
        const response = await axios.get('https://sioms-internship.onrender.com/api/products/')
        products.value = response.data;
    }catch(error){
        alert('Failed to Load Products')
    }
}
const addItem = ()=>{
    newOrder.value.items.push({
        product_id: null,
        quantity: 1,
        price: 0
    })
}

const removeItem = (index)=>{
    newOrder.value.items.splice(index, 1);
}

const addOrder = async ()=>{
    isLoading.value = true;
    try{
        newOrder.value.total = newOrder.value.items.reduce((sum, item)=> sum + item.quantity *  item.price , 0);

        await axios.post('https://sioms-internship.onrender.com/api/orders/',newOrder.value);

        newOrder.value = { 
            customer_id: null,
            status: 'pending',
            total: 0,
            items: [] ,
        };

        showAddForm.value = false;

        await fetchOrders();

        alert('Order Created Successfully');

    }catch(error){
        alert('Failed to Add Order')
    }finally{
        isLoading.value = false;
    }
}

onMounted(() => {
  if (authStore.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
  }
  fetchOrders();
  fetchCustomers();
  fetchProducts();
});
</script>


<template>
  <div class="container mt-5">
    <h2>Orders</h2>
    <button class="btn btn-primary mb-3" @click="showAddForm = true">Create Order</button>

    <div v-if="showAddForm" class="card mb-3">
      <div class="card-body">
        <h5>Create Order</h5>
        <div v-if="!customers.length || !products.length" class="alert alert-warning">
          {{ !customers.length ? 'No customers available. ' : '' }}
          {{ !products.length ? 'No products available. ' : '' }}
          <router-link to="/customers">Manage Customers</router-link> or
          <router-link to="/products">Manage Products</router-link>
        </div>
        <form v-else @submit.prevent="addOrder">
          <div class="mb-3">
            <label for="customer" class="form-label">Customer</label>
            <select v-model="newOrder.customer_id" class="form-select" id="customer" required>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.name }} ({{ customer.email }})
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Order Items</label>
            <div v-for="(item, index) in newOrder.items" :key="index" class="card mb-2 p-3">
              <div class="row">
                <div class="col-md-4">
                  <label :for="'product-' + index" class="form-label">Product</label>
                  <select v-model="item.product_id" :id="'product-' + index" class="form-select" required>
                    <option v-for="product in products" :key="product.id" :value="product.id">
                      {{ product.name }} (${{ product.price }})
                    </option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label :for="'quantity-' + index" class="form-label">Quantity</label>
                  <input v-model.number="item.quantity" :id="'quantity-' + index" type="number" class="form-control" min="1" required>
                </div>
                <div class="col-md-3">
                  <label :for="'price-' + index" class="form-label">Price</label>
                  <input v-model.number="item.price" :id="'price-' + index" type="number" step="0.01" class="form-control" required>
                </div>
                <div class="col-md-2 d-flex align-items-end">
                  <button type="button" class="btn btn-danger" @click="removeItem(index)">Remove</button>
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-secondary mb-3" @click="addItem">Add Item</button>
          </div>
          <div class="mb-3">
            <label for="status" class="form-label">Status</label>
            <select v-model="newOrder.status" class="form-select" id="status" required>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button type="submit" class="btn btn-success" :disabled="isLoading">Create</button>
          <button type="button" class="btn btn-secondary ms-2" @click="showAddForm = false">Cancel</button>
        </form>
      </div>
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Status</th>
          <th>Total</th>
          <th>Items</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.customer?.name || 'Unknown' }}</td>
          <td>{{ order.status }}</td>
          <td>${{ order.total }}</td>
          <td>
            <ul>
              <li v-for="item in order.items" :key="item.id">
                {{ item.product?.name }} x{{ item.quantity }} @ UGX {{ item.price }}
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>