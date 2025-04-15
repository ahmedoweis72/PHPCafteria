<template>
  <div class="container-fluid p-4 bg-light min-vh-100">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2 fw-bold text-primary">Product Management</h1>
      <router-link to="/add-product" class="btn btn-primary btn-lg">
        <i class="bi bi-plus-circle me-2"></i>Add Product
      </router-link>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <h2 class="h5 mb-0 text-secondary">Product Inventory</h2>
        <div>
          <span class="text-muted">{{ paginatedProducts.length }} of {{ products.length }} products</span>
        </div>
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
            <tr v-for="product in paginatedProducts" :key="product.id">
              <td class="align-middle fw-semibold">{{ product.name }}</td>
              <td class="align-middle">{{ product.price }} EGP</td>
              <td class="align-middle text-center">
                <div class="d-flex justify-content-center">
                  <img v-if="product.image" :src="product.image" class="img-thumbnail rounded"
                    style="max-width: 80px; height: auto" alt="Product image">
                  <span v-else class="text-muted fs-4">📦</span>
                </div>
              </td>
              <td class="align-middle text-center">
                <span :class="product.status === 'available'
                  ? 'badge bg-success-subtle text-success'
                  : 'badge bg-danger-subtle text-danger'" style="font-size: 0.9em">
                  {{ product.status }}
                </span>
              </td>
              <td class="align-middle text-end">
                <div class="d-flex gap-2 justify-content-end">
                  <button @click="editProduct(product.id)" class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-pencil-square me-2"></i>Edit
                  </button>
                  <button @click="showDeleteModal(product)" class="btn btn-sm btn-outline-danger">
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

      <!-- Simple Pagination Controls -->
      <div v-if="products.length > 0" class="card-footer bg-white border-top py-3">
        <nav aria-label="Product pagination">
          <ul class="pagination justify-content-center mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
            </li>
            <li class="page-item active">
              <a class="page-link" href="#">{{ currentPage }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true"
    ref="deleteModalEl">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title fw-bold text-danger" id="deleteModalLabel">Confirm Deletion</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body py-4">
          <div class="d-flex align-items-center mb-3">
            <div class="bg-danger-subtle p-3 rounded-circle me-3">
              <i class="bi bi-exclamation-triangle text-danger fs-4"></i>
            </div>
            <div>
              <p class="mb-0 fw-semibold">Are you sure you want to delete this product?</p>
              <p class="mb-0 text-muted" v-if="productToDelete">{{ productToDelete.name }}</p>
            </div>
          </div>
          <p class="text-muted mb-0">This action cannot be undone. All data associated with this product will be
            permanently removed from the system.</p>
        </div>
        <div class="modal-footer border-0 pt-0">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            <i class="bi bi-x me-2"></i>Cancel
          </button>
          <button type="button" class="btn btn-danger" @click="confirmDelete">
            <i class="bi bi-trash3 me-2"></i>Delete Product
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'

const products = ref([])
const router = useRouter()
const deleteModalEl = ref(null)
const deleteModal = ref(null)
const productToDelete = ref(null)

// Pagination state
const currentPage = ref(1)
const perPage = ref(10)
const totalPages = computed(() => Math.ceil(products.value.length / perPage.value))
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/PHP_Cafeteria_Backend/public';

const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`)
    products.value = response.data;

  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const showDeleteModal = (product) => {
  productToDelete.value = product
  deleteModal.value.show()
}

const confirmDelete = async () => {
  try {
    await axios.delete(`${API_URL}/products/${productToDelete.value.id}`)
    products.value = products.value.filter(product => product.id !== productToDelete.value.id)
    deleteModal.value.hide()
    // Optional: Show success toast notification here
  } catch (error) {
    console.error('Delete failed:', error)
    // Optional: Show error toast notification here
  }
}

const editProduct = (id) => {
  router.push(`/edit-product/${id}`)
}

// Computed property for paginated products
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return products.value.slice(start, end)
})

// Change page function
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

onMounted(() => {
  fetchProducts()
  // Initialize Bootstrap modal
  deleteModal.value = new Modal(deleteModalEl.value)
})
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

.modal-content {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Simple pagination styling */
.pagination {
  display: flex;
  padding-left: 0;
  list-style: none;
}

.page-item:not(:first-child) .page-link {
  margin-left: -1px;
}

.page-link {
  position: relative;
  display: block;
  padding: 0.5rem 0.75rem;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid #dee2e6;
}

.page-item.active .page-link {
  z-index: 3;
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}
</style>