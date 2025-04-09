<template>
  <div class="container-fluid p-4 bg-light min-vh-100">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2 fw-bold text-primary">Category Management</h1>
      <button class="btn btn-primary btn-lg" @click="showAddForm">
        <i class="bi bi-plus-circle me-2"></i>Add Category
      </button>
    </div>

    <div v-if="categoryStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="card shadow-sm">
      <div class="card-header bg-white border-bottom">
        <h2 class="h5 mb-0 text-secondary">Category List</h2>
      </div>

      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th class="align-middle">Category Name</th>
              <th class="align-middle text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id">
              <td class="align-middle fw-semibold">{{ category.name }}</td>
              <td class="align-middle text-end">
                <div class="d-flex gap-2 justify-content-end">
                  <button @click="editCategory(category)" class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-pencil-square me-2"></i>Edit
                  </button>
                  <button
                    @click="confirmDelete(category.id)"
                    class="btn btn-sm btn-outline-danger"
                    :disabled="categoryStore.isDeleting === category.id"
                  >
                    <i class="bi bi-trash3 me-2"></i>
                    <span v-if="categoryStore.isDeleting === category.id">Deleting...</span>
                    <span v-else>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="categories.length === 0" class="card-body text-center py-5">
        <div class="text-muted mb-3">No categories found</div>
        <button class="btn btn-primary" @click="showAddForm">Create First Category</button>
      </div>
    </div>

    <!-- Modal for Deletion Confirmation -->
    <div
      class="modal fade"
      :class="{ 'show d-block': showDeleteConfirmModal }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger">Confirm Deletion</h5>
            <button type="button" class="btn-close" @click="closeDeleteConfirmModal"></button>
          </div>
          <div class="modal-body">
            <p class="text-muted">Are you sure you want to delete this category?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDeleteConfirmModal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="deleteCategory(deleteCategoryId)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Add/Edit Category -->
    <div class="modal fade" :class="{ 'show d-block': showForm }" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Edit Category' : 'New Category' }}</h5>
            <button type="button" class="btn-close" @click="closeForm"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label class="form-label">Category Name</label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="form-control"
                  required
                  :class="{ 'is-invalid': errors.name }"
                />
                <div class="invalid-feedback" v-if="errors.name">
                  {{ errors.name }}
                </div>
              </div>
              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary" @click="closeForm">Cancel</button>
                <button type="submit" class="btn btn-primary">
                  {{ isEditing ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop for modals -->
    <div v-if="showDeleteConfirmModal || showForm" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCategoryStore } from '../stores/categoryStore'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const categoryStore = useCategoryStore()
const categories = computed(() => categoryStore.categories)
const showForm = ref(false)
const isEditing = ref(false)
const formData = ref({ id: null, name: '' })
const errors = ref({})
const showDeleteConfirmModal = ref(false)
const deleteCategoryId = ref(null)

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
  categoryStore.isLoading = true
  try {
    await categoryStore.fetchCategories()
  } catch (error) {
    showErrorToast('Error loading categories. Please refresh and try again.')
  } finally {
    categoryStore.isLoading = false
  }
}

const showAddForm = () => {
  isEditing.value = false
  formData.value = { id: null, name: '' }
  showForm.value = true
}

const editCategory = (category) => {
  isEditing.value = true
  formData.value = { ...category }
  showForm.value = true
}

const submitForm = async () => {
  errors.value = {}
  try {
    if (isEditing.value) {
      await categoryStore.updateCategory(formData.value.id, formData.value)
      showSuccessToast('Category updated successfully')
    } else {
      await categoryStore.createCategory(formData.value)
      showSuccessToast('Category created successfully')
    }
    closeForm()
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      showErrorToast('Error saving category. Please try again.')
    }
  }
}

const confirmDelete = (id) => {
  deleteCategoryId.value = id
  showDeleteConfirmModal.value = true
}

const closeDeleteConfirmModal = () => {
  showDeleteConfirmModal.value = false
  deleteCategoryId.value = null
}

const deleteCategory = async (id) => {
  try {
    const status = await categoryStore.deleteCategory(id)
    if (status === 200) {
      showSuccessToast('Category deleted successfully')
      closeDeleteConfirmModal()
    }
  } catch (error) {
    showErrorToast('Error deleting category. Please try again.')
  }
}

const closeForm = () => {
  showForm.value = false
  errors.value = {}
}

onMounted(fetchCategories)
</script>

<style scoped>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal {
  background-color: rgba(0, 0, 0, 0.4);
}
.modal-content {
  animation: fadeInDown 0.3s ease;
}
@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
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