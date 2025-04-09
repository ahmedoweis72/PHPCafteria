<template>
  <div class="container-fluid p-4 bg-light min-vh-100">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2 fw-bold text-primary">Product Management</h1>
      <router-link 
        to="/add-product" 
        class="btn btn-primary btn-lg"
      >
        <i class="bi bi-plus-circle me-2"></i>Add Product
      </router-link>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-white border-bottom">
        <h2 class="h5 mb-0 text-secondary">Product Inventory</h2>
      </div>
      
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th class="align-middle">Product</th>
              <th class="align-middle">Price</th>
              <th class="align-middle text-center">Image</th>
              <th class="align-middle text-center">Status</th>
              <th class="align-middle text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td class="align-middle fw-semibold">{{ product.name }}</td>
              <td class="align-middle">{{ product.price }} EGP</td>
              <td class="align-middle text-center">
                <div class="d-flex justify-content-center">
                  <img 
                    v-if="product.image" 
                    :src="product.image" 
                    class="img-thumbnail rounded" 
                    style="max-width: 80px; height: auto"
                    alt="Product image"
                  >
                  <span v-else class="text-muted fs-4">📦</span>
                </div>
              </td>
              <td class="align-middle text-center">
                <span 
                  :class="product.status === 'available' 
                    ? 'badge bg-success-subtle text-success' 
                    : 'badge bg-danger-subtle text-danger'"
                  style="font-size: 0.9em"
                >
                  {{ product.status }}
                </span>
              </td>
              <td class="align-middle text-end">
                <div class="d-flex gap-2 justify-content-end">
                  <button 
                    @click="editProduct(product.id)" 
                    class="btn btn-sm btn-outline-primary"
                  >
                    <i class="bi bi-pencil-square me-2"></i>Edit
                  </button>
                  <button 
                    @click="deleteProduct(product.id)" 
                    class="btn btn-sm btn-outline-danger"
                  >
                    <i class="bi bi-trash3 me-2"></i>Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="products.length === 0" class="card-body text-center py-5">
        <div class="text-muted mb-3">No products found</div>
        <router-link to="/add-product" class="btn btn-primary">
          Add Your First Product
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const products = ref([])
const router = useRouter()

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost/PHP_Cafeteria_Backend/public/products')
    products.value = response.data;
    
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await axios.delete(`http://localhost/PHP_Cafeteria_Backend/public/products/${id}`)
      products.value = products.value.filter(product => product.id !== id)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }
}

const editProduct = (id) => {
  router.push(`/edit-product/${id}`)
}

onMounted(fetchProducts)
</script>

<style scoped>
.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
}
.card {
  border-radius: 0.75rem;
}
.img-thumbnail {
  padding: 0.25rem;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
}
</style>
