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
            <input type="text" id="fullName" v-model="user.fullName" required placeholder="Enter full name" />
          </div>

          <div class="col-md-6 mb-3">
            <label for="email">Email <span class="text-danger">*</span></label>
            <input type="email" id="email" v-model="user.email" required placeholder="Enter email" />
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="password">Password <span class="text-danger">*</span></label>
            <input type="password" id="password" v-model="user.password" required placeholder="Enter password" />
          </div>

          <div class="col-md-6 mb-3">
            <label for="role">Role <span class="text-danger">*</span></label>
            <select id="role" v-model="user.role" required>
              <option value="" disabled selected>Select a role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
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
          <input type="file" id="profilePic" @change="handleFileUpload" accept="image/*" />
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
import authService from '../../services/auth.service';

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
      error: false
    };
  },
  methods: {
    async handleRegister() {
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

        // Log the form data to check if it's being created correctly
        console.log('Sending registration data...');
        const response = await authService.register(formData);
        this.message = response.message || 'User registered successfully!';
        this.error = false;

        // Reset form after successful registration
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
      } catch (err) {
        console.error('Registration error:', err);
        this.error = true;
        this.message = err.message || 'Failed to register user!';
      } finally {
        this.loading = false;
      }
    },
    handleFileUpload(event) {
      this.user.profilePic = event.target.files[0];
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

.redirect-link {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.redirect-link a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
}

.redirect-link a:hover {
  text-decoration: underline;
}

@media (max-width: 767px) {

  .col-md-6,
  .col-md-4 {
    flex: 0 0 100%;
  }
}
</style>