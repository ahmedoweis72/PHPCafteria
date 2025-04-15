<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import authService from '../services/auth.service';

const user = ref({});
const route = useRoute();
const router = useRouter();
const userId = route.params.id;
const password = ref('');
const confirmPassword = ref('');
const error = ref(null);
const success = ref(null);
const loading = ref(false);
const newImageFile = ref(null);
const validationErrors = ref({});
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/PHP_Cafeteria_Backend/public';

const fetchUser = async (userId) => {
  try {
    loading.value = true;
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: authService.authHeader()
    });

    user.value = response.data;

  } catch (err) {
    console.error('Something went wrong when getting user data', err);
    error.value = err.response?.data?.message || 'Failed to fetch user data';
  } finally {
    loading.value = false;
  }
};

const validateForm = () => {
  validationErrors.value = {};
  
  // Validate full name
  if (!user.value.fullName?.trim()) {
    validationErrors.value.fullName = 'Full name is required';
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user.value.email?.trim()) {
    validationErrors.value.email = 'Email is required';
  } else if (!emailRegex.test(user.value.email)) {
    validationErrors.value.email = 'Please enter a valid email address';
  }
  
  // Validate role
  if (!user.value.role) {
    validationErrors.value.role = 'Role is required';
  }
  
  // Validate passwords if provided
  if (password.value) {
    if (password.value.length < 6) {
      validationErrors.value.password = 'Password must be at least 6 characters long';
    }
    
    if (password.value !== confirmPassword.value) {
      validationErrors.value.confirmPassword = 'Passwords do not match';
    }
  }
  
  // Validate image if provided
  if (newImageFile.value) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(newImageFile.value.type)) {
      validationErrors.value.profilePic = 'Please upload a valid image file (JPEG, PNG, GIF, WEBP)';
    } else if (newImageFile.value.size > 5 * 1024 * 1024) { // 5MB limit
      validationErrors.value.profilePic = 'Image size should not exceed 5MB';
    }
  }
  
  return Object.keys(validationErrors.value).length === 0;
};

const updateUserData = async () => {
  error.value = null;
  success.value = null;
  
  if (!validateForm()) {
    error.value = 'Please fix the validation errors before submitting';
    return;
  }

  let formData = new FormData();
  formData.append('fullName', user.value.fullName);
  formData.append('email', user.value.email);
  
  // Only append if values exist
  if (user.value.roomNum) {
    formData.append('roomNum', user.value.roomNum);
  }
  
  formData.append('role', user.value.role);

  if (password.value) {
    formData.append('password', password.value);
  }

  if (newImageFile.value) {
    formData.append('profilePic', newImageFile.value);
  }

  try {
    loading.value = true;
    const response = await axios.post(`${API_URL}/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...authService.authHeader()
      }
    });

    success.value = 'User updated successfully!';
    
    // Show success message briefly before redirecting
    setTimeout(() => {
      router.push('/users');
    }, 1500);

  } catch (err) {
    console.error('Failed to update user', err);
    error.value = err.response?.data?.message || 'Failed to update user';
    
    // Handle validation errors from backend
    if (err.response?.data?.errors) {
      Object.assign(validationErrors.value, err.response.data.errors);
    }
  } finally {
    loading.value = false;
  }
};

// Function to get the file when user uploads it and show it to the user
const onImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    newImageFile.value = file;
    user.value.profilePic = URL.createObjectURL(file);
    // Clear any previous file upload errors
    validationErrors.value.profilePic = '';
  }
};

const togglePasswordVisibility = (field) => {
  if (field === 'password') {
    showPassword.value = !showPassword.value;
  } else {
    showConfirmPassword.value = !showConfirmPassword.value;
  }
};

const goBack = () => {
  router.push('/users');
};

onMounted(() => {
  fetchUser(userId);
});
</script>

<template>
  <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
    {{ error }}
    <button type="button" class="btn-close" @click="error = null"></button>
  </div>
  
  <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
    {{ success }}
    <button type="button" class="btn-close" @click="success = null"></button>
  </div>

  <div v-if="loading" class="text-center py-4">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p class="mt-2">Loading...</p>
  </div>

  <div v-else class="container py-4">
    <div class="card shadow-sm">
      <div class="card-header bg-primary bg-gradient text-white">
        <h5 class="mb-0">Edit User: {{ user.fullName }}</h5>
      </div>

      <div class="card-body">
        <!-- Profile Image Section -->
        <div class="row mb-4 justify-content-center">
          <div class="col-md-4 text-center">
            <div class="position-relative d-inline-block">
              <img :src="user.profilePic" alt="User profile" class="rounded-circle img-thumbnail mb-2"
                style="width: 150px; height: 150px; object-fit: cover;" />
              <div class="position-absolute bottom-0 end-0">
                <label for="imageUpload" class="btn btn-sm btn-primary rounded-circle">
                  <i class="bi bi-camera"></i>
                </label>
                <input type="file" id="imageUpload" class="d-none" @change="onImageChange" accept="image/*" />
              </div>
            </div>
            <small class="text-muted d-block">Click the camera icon to change profile picture</small>
            <div v-if="validationErrors.profilePic" class="text-danger small mt-1">
              {{ validationErrors.profilePic }}
            </div>
          </div>
        </div>

        <!-- Form Fields -->
        <form @submit.prevent="updateUserData">
          <div class="row mb-3">
            <!-- Full Name -->
            <div class="col-md-6 mb-3">
              <label for="fullName" class="form-label">Full Name <span class="text-danger">*</span></label>
              <input 
                v-model="user.fullName" 
                type="text" 
                class="form-control" 
                :class="{'is-invalid': validationErrors.fullName}"
                id="fullName"
                placeholder="Enter full name" 
                required
              />
              <div v-if="validationErrors.fullName" class="invalid-feedback">
                {{ validationErrors.fullName }}
              </div>
            </div>

            <!-- Email -->
            <div class="col-md-6 mb-3">
              <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
              <input 
                v-model="user.email" 
                type="email" 
                class="form-control" 
                :class="{'is-invalid': validationErrors.email}"
                id="email" 
                placeholder="Enter email" 
                required
              />
              <div v-if="validationErrors.email" class="invalid-feedback">
                {{ validationErrors.email }}
              </div>
            </div>

            <!-- Room Number -->
            <div class="col-md-6 mb-3">
              <label for="roomNumber" class="form-label">Room Number</label>
              <input 
                v-model="user.roomNum" 
                type="text" 
                class="form-control" 
                id="roomNumber"
                placeholder="Enter room number" 
              />
            </div>

            <!-- Role -->
            <div class="col-md-6 mb-3">
              <label for="role" class="form-label">Role <span class="text-danger">*</span></label>
              <select 
                v-model="user.role" 
                class="form-select" 
                :class="{'is-invalid': validationErrors.role}"
                id="role"
                required
              >
                <option value="" disabled>Select role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div v-if="validationErrors.role" class="invalid-feedback">
                {{ validationErrors.role }}
              </div>
            </div>

            <!-- Password -->
            <div class="col-md-6 mb-3">
              <label for="password" class="form-label">New Password</label>
              <div class="input-group">
                <input 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  class="form-control" 
                  :class="{'is-invalid': validationErrors.password}"
                  id="password"
                  placeholder="Leave blank to keep current password" 
                />
                <button class="btn btn-outline-secondary" type="button" @click="togglePasswordVisibility('password')">
                  <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
                <div v-if="validationErrors.password" class="invalid-feedback">
                  {{ validationErrors.password }}
                </div>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="col-md-6 mb-3">
              <label for="confirmPassword" class="form-label">Confirm New Password</label>
              <div class="input-group">
                <input 
                  v-model="confirmPassword" 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  class="form-control" 
                  :class="{'is-invalid': validationErrors.confirmPassword}"
                  id="confirmPassword"
                  placeholder="Confirm password" 
                />
                <button class="btn btn-outline-secondary" type="button" @click="togglePasswordVisibility('confirm')">
                  <i class="bi" :class="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
                <div v-if="validationErrors.confirmPassword" class="invalid-feedback">
                  {{ validationErrors.confirmPassword }}
                </div>
              </div>
            </div>
          </div>

          <!-- Form Buttons -->
          <div class="d-flex justify-content-end gap-2">
            <button @click.prevent="goBack" type="button" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ loading ? 'Updating...' : 'Update User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* All styling uses Bootstrap classes - no custom CSS needed */
</style>