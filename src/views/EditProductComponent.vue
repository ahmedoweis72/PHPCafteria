<template>
    <div class="product-edit">
      <h2>Edit Product</h2>
      
      <div v-if="loading" class="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div v-if="errorMsg" class="error alert alert-danger">{{ errorMsg }}</div>
      
      <form v-if="!loading && !errorMsg" @submit.prevent="updateProduct" enctype="multipart/form-data">
        <div class="form-group mb-3">
          <label for="name" class="form-label">Product Name</label>
          <input type="text" id="name" v-model="product.name" class="form-control" required>
        </div>
        
        <div class="form-group mb-3">
          <label for="price" class="form-label">Price</label>
          <input type="number" id="price" v-model="product.price" step="0.01" class="form-control" required>
        </div>
        
        <div class="form-group mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea id="description" v-model="product.description" rows="4" class="form-control"></textarea>
        </div>
        
        <div class="form-group mb-3">
          <label for="quantity" class="form-label">Quantity</label>
          <input type="number" id="quantity" v-model="product.quantity" min="0" class="form-control" required>
        </div>
        
        <div class="form-group mb-3">
          <label for="category" class="form-label">Category</label>
          <select id="category" v-model="product.categoryId" class="form-select" required>
            <option v-if="categoryStore.isLoading" value="" disabled>Loading categories...</option>
            <option v-for="category in categoryStore.categories" 
                    :key="category.id" 
                    :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group mb-4">
          <label for="image" class="form-label">Product Image</label>
          <div class="image-preview mb-2" v-if="product.image || imagePreview">
            <img 
              :src="imagePreview || `http://localhost/PHP_Cafeteria_Backend/public/images/${product.image}`" 
              alt="Product preview" 
              class="preview-img img-thumbnail"
            >
          </div>
          <input 
            type="file" 
            id="image" 
            class="form-control"
            accept="image/*"
            @change="handleImageChange"
          >
        </div>
        
        <div class="form-actions d-flex gap-2 justify-content-end">
          <button type="button" @click="router.back()" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <span v-if="submitting">
              <span class="spinner-border spinner-border-sm" role="status"></span>
              Updating...
            </span>
            <span v-else>Update Product</span>
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { toast } from 'vue3-toastify'
  import 'vue3-toastify/dist/index.css'
  import { useProductStore } from '../stores/productStore'
  import { useCategoryStore } from '../stores/categoryStore'
  
  const router = useRouter()
  const route = useRoute()
  const productId = route.params.id
  
  const productStore = useProductStore()
  const categoryStore = useCategoryStore()
  
  const product = ref({
    id: null,
    name: '',
    price: 0,
    description: '',
    quantity: 0,
    categoryId: null,
    image: ''
  })
  
  const imageFile = ref(null)
  const imagePreview = ref(null)
  const loading = ref(true)
  const submitting = ref(false)
  const errorMsg = ref(null)
  
  onMounted(async () => {
    try {
      await Promise.all([
        loadProduct(),
        categoryStore.fetchCategories()
      ])
    } catch (err) {
      handleError(err, 'Failed to load data')
    } finally {
      loading.value = false
    }
  })
  
  const loadProduct = async () => {
    try {
      const data = await productStore.fetchProduct(productId)
      product.value = { 
        ...data,
        categoryId: data.category_id || data.categoryId // Handle both naming conventions
      }
    } catch (err) {
      throw err
    }
  }
  
  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      imageFile.value = file
      const reader = new FileReader()
      reader.onload = () => imagePreview.value = reader.result
      reader.readAsDataURL(file)
    } else {
      imageFile.value = null
      imagePreview.value = null
    }
  }
  
  const updateProduct = async () => {
  submitting.value = true;
  errorMsg.value = null;
  
  try {
    const formData = new FormData();
    
    // Validate required fields before sending
    if (!product.value.name || !product.value.price || !product.value.categoryId) {
      throw new Error('Missing required fields: name, price, or category');
    }

    // Append required fields
    formData.append('name', product.value.name.trim());
    formData.append('price', Number(product.value.price).toFixed(2)); // Ensure 2 decimal places
    formData.append('categoryId', String(product.value.categoryId)); // Convert to string for PHP casting

    // Append optional fields only if they exist
    if (product.value.description) {
      formData.append('description', product.value.description.trim());
    }
    if (product.value.quantity) {
      formData.append('quantity', String(product.value.quantity));
    }
    
    // Handle file upload
    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }

    // Use POST with correct endpoint
    await productStore.updateProduct(productId, formData);
    
    toast.success('Product updated successfully!');
    router.push({ name: 'products' });
  } catch (err) {
    handleError(err, 'Failed to update product');
  } finally {
    submitting.value = false;
  }
};
  
  const handleError = (err, defaultMessage) => {
    const message = err.response?.data?.message || err.message || 'Unknown error occurred'
    errorMsg.value = `${defaultMessage}: ${message}`
    toast.error(errorMsg.value)
    console.error(err)
  }
  </script>
  
  <style scoped>
  .product-edit {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .loading {
    padding: 2rem;
    text-align: center;
  }
  
  .error {
    margin: 1rem 0;
    padding: 1rem;
  }
  
  .preview-img {
    max-width: 300px;
    max-height: 300px;
    object-fit: contain;
    border-radius: 4px;
    margin-top: 1rem;
  }
  
  .form-group label {
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  </style>