<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const user = ref({});
const route = useRoute();
const router = useRouter();
const userId = route.params.id;
const password = ref('');
const confirmPassword = ref('');
const error = ref(null);
const loading = ref(false);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/PHP_Cafeteria_Backend/public';

const fetchUser = async (userId) => {
  try {
    loading.value = true;
    const response = await axios.get(`${API_URL}/users/${userId}`);

    user.value = response.data;

  } catch (err) {
    console.error('Some thing went wrong when get user data', err);
  } finally {
    loading.value = false;
  }
}

const updateUserData = async () => {
  if (password.value && password.value !== confirmPassword.value) {
    error.value = 'password do not match';
    return;
  }

  const updatedUser = {
    fullName: user.value.fullName,
    email: user.value.email,
    roomNum: user.value.roomNum,
    role: user.value.role
  }

  if (password.value) {
    updatedUser.password = password.value;
  }

  try {
    loading.value = true;
    await axios.patch(`${API_URL}/users/${userId}`, updatedUser);

    router.push('/users');

  } catch (err) {
    console.error('Failed to update user', error);
    error.value = 'Failed to update user';
  } finally {
    loading.value = false;
  }
}

const goBack = () => {
  router.push('/users');
}


onMounted(() => {
  fetchUser(userId);
})



</script>


<template>
  <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
    {{ error }}
    <button type="button" class="btn-close" @click="error = null"></button>
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
              <img :src="user.image" alt="User profile" class="rounded-circle img-thumbnail mb-2"
                style="width: 150px; height: 150px; object-fit: cover;" />
              <div class="position-absolute bottom-0 end-0">
                <label for="imageUpload" class="btn btn-sm btn-primary rounded-circle">
                  <i class="bi bi-camera"></i>
                </label>
                <input type="file" id="imageUpload" class="d-none" />
              </div>
            </div>
            <small class="text-muted d-block">Click the camera icon to change profile picture</small>
          </div>
        </div>

        <!-- Form Fields -->
        <form>
          <div class="row mb-3">
            <!-- Full Name -->
            <div class="col-md-6 mb-3">
              <label for="fullName" class="form-label">Full Name</label>
              <input v-model="user.fullName" type="text" class="form-control" id="fullName"
                placeholder="Enter full name" />
            </div>

            <!-- Email -->
            <div class="col-md-6 mb-3">
              <label for="email" class="form-label">Email</label>
              <input v-model="user.email" type="email" class="form-control" id="email" placeholder="Enter email" />
            </div>

            <!-- Room Number -->
            <div class="col-md-6 mb-3">
              <label for="roomNumber" class="form-label">Room Number</label>
              <input v-model="user.roomNum" type="text" class="form-control" id="roomNumber"
                placeholder="Enter room number" />
            </div>

            <!-- Role -->
            <div class="col-md-6 mb-3">
              <label for="role" class="form-label">Role</label>
              <select v-model="user.role" class="form-select" id="role">
                <option value="" disabled>Select role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <!-- Password -->
            <div class="col-md-6 mb-3">
              <label for="password" class="form-label">New Password</label>
              <div class="input-group">
                <input v-model="password" type="password" class="form-control" id="password"
                  placeholder="Leave blank to keep current password" />
                <button class="btn btn-outline-secondary" type="button">
                  <i class="bi bi-eye"></i>
                </button>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="col-md-6 mb-3">
              <label for="confirmPassword" class="form-label">Confirm New Password</label>
              <input v-model="confirmPassword" type="password" class="form-control" id="confirmPassword"
                placeholder="Confirm password" />
            </div>
          </div>

          <!-- Form Buttons -->
          <div class="d-flex justify-content-end gap-2">
            <button @click="goBack" type="button" class="btn btn-secondary">Cancel</button>
            <button @click="updateUserData" type="submit" class="btn btn-primary">Update User</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* All styling uses Bootstrap classes - no custom CSS needed */
</style>