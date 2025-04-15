<template>
  <div class="register-container">
    <div class="form-card">
      <h2>Register New User</h2>

      <div v-if="message" class="alert" :class="{ 'alert-error': error, 'alert-success': !error }" role="alert">
        {{ message }}
      </div>

      <form @submit.prevent="handleRegister" class="needs-validation" novalidate>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="fullName">Full Name <span class="text-danger">*</span></label>
            <input 
              type="text" 
              id="fullName" 
              v-model="user.fullName" 
              required 
              placeholder="Enter full name" 
              :class="{ 'input-error': errors.fullName }"
            />
            <div v-if="errors.fullName" class="error-message">{{ errors.fullName }}</div>
          </div>

          <div class="col-md-6 mb-3">
            <label for="email">Email <span class="text-danger">*</span></label>
            <input 
              type="email" 
              id="email" 
              v-model="user.email" 
              required 
              placeholder="Enter email" 
              :class="{ 'input-error': errors.email }"
            />
            <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="password">Password <span class="text-danger">*</span></label>
            <input 
              type="password" 
              id="password" 
              v-model="user.password" 
              required 
              placeholder="Enter password" 
              :class="{ 'input-error': errors.password }"
            />
            <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
          </div>

          <div class="col-md-6 mb-3">
            <label for="role">Role <span class="text-danger">*</span></label>
            <select 
              id="role" 
              v-model="user.role" 
              required
              :class="{ 'input-error': errors.role }"
            >
              <option value="" disabled selected>Select a role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div v-if="errors.role" class="error-message">{{ errors.role }}</div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4 mb-3">
            <label for="roomNum">Room Number</label>
            <input type="text" id="roomNum" v-model="user.roomNum" placeholder="Enter room number" />
          </div>

          <div class="col-md-4 mb-3">
            <label for="Ext">Extension</label>
            <input type="text" id="Ext" v-model="user.Ext" placeholder="Enter extension" />
          </div>

          <div class="col-md-4 mb-3">
            <label for="roomId">Room ID</label>
            <input type="text" id="roomId" v-model="user.roomId" placeholder="Enter room ID" />
          </div>
        </div>

        <div class="form-group">
          <label for="profilePic">Profile Picture</label>
          <input 
            type="file" 
            id="profilePic" 
            @change="handleFileUpload" 
            accept="image/*" 
            :class="{ 'input-error': errors.profilePic }"
          />
          <div v-if="errors.profilePic" class="error-message">{{ errors.profilePic }}</div>
        </div>

        <button type="submit" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          <span v-if="loading">Processing...</span>
          <span v-else>Register User</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
<<<<<<< HEAD:src/views/Register.vue
import authService from '../services/auth.service';
import axios from 'axios';
=======
import authService from '../../services/auth.service';
>>>>>>> c7b43759692653b8803fc90588005d2396046185:src/views/auth/Register.vue

export default {
  name: 'RegisterUser',
  data() {
    return {
      user: {
        fullName: '',
        email: '',
        password: '',
        role: '',
        roomNum: '',
        Ext: '',
        profilePic: null,
        roomId: ''
      },
      loading: false,
      message: '',
      error: false,
      errors: {
        fullName: '',
        email: '',
        password: '',
        role: '',
        profilePic: ''
      }
    };
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.clearErrors();

      // Validate full name
      if (!this.user.fullName.trim()) {
        this.errors.fullName = 'Full name is required';
        isValid = false;
      } else if (this.user.fullName.length < 2) {
        this.errors.fullName = 'Full name must be at least 2 characters';
        isValid = false;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.user.email.trim()) {
        this.errors.email = 'Email is required';
        isValid = false;
      } else if (!emailRegex.test(this.user.email)) {
        this.errors.email = 'Please enter a valid email address';
        isValid = false;
      }

      // Validate password
      if (!this.user.password) {
        this.errors.password = 'Password is required';
        isValid = false;
      } else if (this.user.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters long';
        isValid = false;
      }

      // Validate role
      if (!this.user.role) {
        this.errors.role = 'Please select a role';
        isValid = false;
      }

      // Optional: Validate profile picture
      if (this.user.profilePic) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(this.user.profilePic.type)) {
          this.errors.profilePic = 'Please upload a valid image file (JPEG, PNG, GIF, WEBP)';
          isValid = false;
        } else if (this.user.profilePic.size > 5 * 1024 * 1024) { // 5MB limit
          this.errors.profilePic = 'Image size should not exceed 5MB';
          isValid = false;
        }
      }

      return isValid;
    },

    clearErrors() {
      this.errors = {
        fullName: '',
        email: '',
        password: '',
        role: '',
        profilePic: ''
      };
    },

    async handleRegister() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.message = '';
      this.error = false;

      try {
        // Create form data for multi-part form submission (for file upload)
        const formData = new FormData();
        Object.keys(this.user).forEach(key => {
          if (this.user[key] !== null && this.user[key] !== undefined && this.user[key] !== '') {
            formData.append(key, this.user[key]);
          }
        });

<<<<<<< HEAD:src/views/Register.vue
        // Direct axios request implementation
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/PHP_Cafeteria_Backend/public';

        const response = await axios.post(`${API_URL}/admin/users`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...authService.authHeader()
          }
        });

        this.message = response.data.message || 'User registered successfully!';
=======
        // Log the form data to check if it's being created correctly
        console.log('Sending registration data...');
        const response = await authService.register(formData);
        this.message = response.message || 'User registered successfully!';
>>>>>>> c7b43759692653b8803fc90588005d2396046185:src/views/auth/Register.vue
        this.error = false;

        // Reset form after successful registration
        this.resetForm();
      } catch (err) {
        console.error('Registration error:', err);
        this.error = true;
        this.message = err.response?.data?.message || err.message || 'Failed to register user!';
        
        // Handle validation errors from backend
        if (err.response?.data?.errors) {
          const backendErrors = err.response.data.errors;
          Object.keys(backendErrors).forEach(field => {
            if (this.errors.hasOwnProperty(field)) {
              this.errors[field] = backendErrors[field];
            }
          });
        }
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.user = {
        fullName: '',
        email: '',
        password: '',
        role: '',
        roomNum: '',
        Ext: '',
        profilePic: null,
        roomId: ''
      };
      document.getElementById('profilePic').value = '';
    },

    handleFileUpload(event) {
      this.user.profilePic = event.target.files[0];
      // Clear any previous file upload errors
      this.errors.profilePic = '';
    }
  },
  created() {
    if (!authService.isAdmin()) {
      this.$router.push('/login');
      this.message = 'You need to be an admin to access this page';
      this.error = true;
    }
  }
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/src/assets/sincerely.jpg');
  /* Update this path to your image */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
}

.form-card {
  max-width: 800px;
  width: 100%;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.95);
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
  font-weight: 600;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
}

.col-md-6 {
  flex: 0 0 50%;
  padding: 0 10px;
}

.col-md-4 {
  flex: 0 0 33.333333%;
  padding: 0 10px;
}

.mb-3 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.text-danger {
  color: #dc3545;
}

input,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  transition: border-color 0.3s;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
}

input:focus,
select:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.input-error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s;
  margin-top: 10px;
}

button:hover {
  background-color: #3e8e41;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.2em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border .75s linear infinite;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.2em;
}

.me-2 {
  margin-right: 0.5rem;
}

.alert {
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 4px;
  font-size: 14px;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

@media (max-width: 767px) {
  .col-md-6,
  .col-md-4 {
    flex: 0 0 100%;
  }
}
</style>