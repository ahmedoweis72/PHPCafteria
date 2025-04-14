<template>
  <div class="login-container">
    <div class="form-card">
      <h2>Login</h2>

      <div v-if="message" class="alert" :class="{ 'alert-error': error, 'alert-success': !error }">
        {{ message }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="user.email" required placeholder="Enter your email" />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="user.password" required placeholder="Enter your password" />
        </div>

        <button type="submit" :disabled="loading">
          <span v-if="loading">Loading...</span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import authService from '../services/auth.service';

export default {
  name: 'Login',
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      loading: false,
      message: '',
      error: false
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.message = '';
      this.error = false;

      try {
        const data = await authService.login(this.user);

        // Check if returning from a redirect
        const redirectPath = this.$route.query.redirect || '/';
        this.$router.push(redirectPath);

        // Show success message briefly before redirect
        this.message = 'Login successful!';
        this.error = false;
      } catch (err) {
        this.error = true;
        this.message = err.error || 'Failed to login!';
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    // If already logged in, redirect to home
    if (authService.getCurrentUser()) {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.login-container {
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
  max-width: 400px;
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

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  transition: border-color 0.3s;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
}

input:focus {
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
}

button:hover {
  background-color: #3e8e41;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
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
</style>