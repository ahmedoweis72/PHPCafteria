<template>
  <div class="container-fluid p-4 bg-light min-vh-100">
    <div class="card shadow-sm mx-auto" style="max-width: 800px;">
      <div class="card-header bg-white border-bottom">
        <h2 class="h4 mb-0 text-primary">Add New Product</h2>
      </div>

      <div class="card-body">
        <form @submit.prevent="submitForm" class="needs-validation" novalidate>
          <div class="row g-4">
            <!-- Product Name -->
            <div class="col-12">
              <label class="form-label fw-semibold">Product Name</label>
              <input v-model="product.name" type="text" class="form-control form-control-lg"
                placeholder="Enter product name" required>
            </div>

            <!-- Price & Category -->
            <div class="col-md-6">
              <label class="form-label fw-semibold">Price (EGP)</label>
              <input v-model="product.price" type="number" step="0.01" class="form-control form-control-lg"
                placeholder="Enter price" required>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-semibold">Category</label>
              <div class="input-group">
                <select v-model="product.categoryId" class="form-select form-select-lg" required>
                  <option value="" disabled selected>Select category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
                <router-link to="/add-category" class="btn btn-outline-secondary" type="button">
                  Add New
                </router-link>
              </div>
            </div>

            <!-- Image Upload -->
            <div class="col-12">
              <label class="form-label fw-semibold">Product Image</label>
              <div class="border rounded-3 p-3 bg-light">
                <div class="d-flex align-items-center gap-3">
                  <input type="file" class="form-control" @change="handleImageUpload" accept="image/*">
                  <div v-if="product.imagePreview" class="preview-container">
                    <img :src="product.imagePreview" class="preview-image" alt="Product preview">
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="col-12">
              <label class="form-label fw-semibold">Description</label>
              <textarea v-model="product.description" class="form-control" rows="4"
                placeholder="Enter product description"></textarea>
            </div>

            <!-- Action Buttons -->
            <div class="col-12 d-flex gap-3 justify-content-end mt-4">
              <button type="button" @click="resetForm" class="btn btn-lg btn-outline-secondary">
                Reset
              </button>
              <button type="submit" class="btn btn-lg btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ isSubmitting ? 'Saving...' : 'Save Product' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/productStore'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useCategoryStore } from '../stores/categoryStore'

const router = useRouter()
const productStore = useProductStore()
const isSubmitting = ref(false)


const categoryStore = useCategoryStore();
const categories = computed(() => categoryStore.categories)
const product = ref({
  name: '',
  price: '',
  description: '',
  quantity: 0,
  categoryId: null,
  image: null,
  imageFile: null,
  imagePreview: null,
  status: 'available'
})

// Configure toast options
const toastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
  icon: true,
  className: 'custom-toast'
}

// Toast helper functions
const showSuccessToast = (message) => {
  toast.success(message, toastOptions)
}

const showErrorToast = (message) => {
  toast.error(message, toastOptions)
}

const fetchCategories = async () => {
  try {
    await categoryStore.fetchCategories()
    if (categories.length === 0) {
      showErrorToast('No categories found. Please create a category first.')
    }
  } catch (error) {
    showErrorToast('Error loading categories. Please refresh and try again.')
  }
}

const validateForm = () => {
  // Basic validation checks
  if (!product.value.name.trim()) {
    showErrorToast('Product name is required')
    return false
  }
  
  if (!product.value.price || isNaN(product.value.price) || product.value.price <= 0) {
    showErrorToast('Please enter a valid price')
    return false
  }
  
  if (!product.value.categoryId) {
    showErrorToast('Please select a category')
    return false
  }
  
  return true
}

const submitForm = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    const response = await productStore.createProduct(product.value)
    if (response.status === 201) {
      showSuccessToast('Product created successfully')
      // Navigate after a short delay to allow the user to see the success message
      setTimeout(() => {
        router.push('/all-product')
      }, 1000)
    }
  } catch (error) {
    console.error('Error creating product:', error)
    const errorMessage = error.response?.data?.error || 'Error saving product. Please try again.'
    showErrorToast(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (!file.type.match('image.*')) {
      showErrorToast('Please select an image file')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showErrorToast('Image size should be less than 5MB')
      return
    }
    
    product.value.imageFile = file
    const reader = new FileReader()
    reader.onload = (e) => {
      product.value.imagePreview = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const resetForm = () => {
  product.value = {
    name: '',
    price: '',
    description: '',
    quantity: 0,
    categoryId: null,
    image: null,
    imageFile: null,
    imagePreview: null,
    status: 'available'
  }
}

onMounted(fetchCategories)
</script>

<style scoped>
.preview-image {
  max-width: 100px;
  height: auto;
  border-radius: 0.5rem;
  border: 2px solid #dee2e6;
}

.needs-validation .form-control:invalid {
  border-color: #dc3545;
}

.needs-validation .invalid-feedback {
  display: none;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

.needs-validation .form-control:invalid~.invalid-feedback {
  display: block;
}

/* Custom toast styling */
:global(.custom-toast) {
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  font-family: inherit !important;
  font-size: 14px !important;
}

:global(.Toastify__toast--success) {
  background-color: #ffffff !important;
  border-left: 4px solid #28a745 !important;
  color: #333333 !important;
}

:global(.Toastify__toast--success .Toastify__toast-icon) {
  color: #28a745 !important;
}

:global(.Toastify__toast--error) {
  background-color: #ffffff !important;
  border-left: 4px solid #dc3545 !important;
  color: #333333 !important;
}

:global(.Toastify__toast--error .Toastify__toast-icon) {
  color: #dc3545 !important;
}

:global(.Toastify__progress-bar) {
  height: 3px !important;
}

:global(.Toastify__progress-bar--success) {
  background-color: #28a745 !important;
}

:global(.Toastify__progress-bar--error) {
  background-color: #dc3545 !important;
}

:global(.Toastify__close-button) {
  color: #666666 !important;
  opacity: 0.7 !important;
}

:global(.Toastify__close-button:hover) {
  opacity: 1 !important;
}
</style>