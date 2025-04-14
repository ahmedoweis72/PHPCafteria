<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/auth.service'; // Make sure this path is correct

const router = useRouter();
const isLoggedIn = ref(false);
const user = ref(null);

function logout() {
  AuthService.logout();
  isLoggedIn.value = false;
  user.value = null;
  router.push('/login');
}

function login() {
  router.push('/login');
}

onMounted(() => {
  checkUserLogin();
});

function checkUserLogin() {
  const userData = AuthService.getCurrentUser();
  if (userData && userData.token) {
    isLoggedIn.value = true;
    
    const userInfo = userData.decodedData?.data || {};
    
    user.value = {
      name: userInfo.name,
      role: userInfo.role || "User",
      image: userData.image || "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
    };
  } else {
    isLoggedIn.value = false;
    user.value = null;
  }
}
</script>

<template>
  <header class="shadow-sm bg-light w-100 vw-100">
    <div class="container-fluid py-3">
      <div class="row align-items-center">
        <div class="col d-flex align-items-center">
          <h1 class="h4 mb-0 me-4">Cafeteria</h1>
          <nav>
            <ul class="nav">
              <li class="nav-item">
                <router-link to="/" class="nav-link">Home</router-link>
              </li>
              <!-- Only show these if user is logged in -->
              <template v-if="isLoggedIn">
                <li class="nav-item">
                  <router-link to="/all-product" class="nav-link">Products</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/users" class="nav-link">Users</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/order" class="nav-link">Manual Order</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/checks" class="nav-link">Checks</router-link>
                </li>
              </template>
            </ul>
          </nav>
        </div>

        <div class="col-auto d-flex align-items-center">
          <!-- Show login button if not logged in -->
          <template v-if="!isLoggedIn">
            <button class="btn btn-primary" @click="login">Login</button>
          </template>
          
          <!-- Show user info and logout button if logged in -->
          <template v-else>
            <button class="btn btn-outline-danger me-3" @click="logout">Logout</button>
            <div class="text-end me-3">
              <div class="fw-bold">{{ user.name }}</div>
              <div class="text-muted small">{{ user.role }}</div>
            </div>
            <img :src="user.image" alt="User" class="rounded-circle" width="40" height="40">
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Override Bootstrap's active link color */
.nav-link.router-link-active {
  color: #42b983 !important;
  font-weight: 500;
}

header {
  margin: 0;
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
}
</style>