<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/auth.service'; 
import cartState from '../stores/cartStore';

const router = useRouter();
const isLoggedIn = ref(false);
const user = ref(null);
const cartCount = ref(0);

function logout() {
  AuthService.logout();
  isLoggedIn.value = false;
  user.value = null;
  router.push('/login');
}

function login() {
  router.push('/login');
}

function checkUserLogin() {
  const userData = AuthService.getCurrentUser();
  if (userData && userData.token) {
    isLoggedIn.value = true;

    const userInfo = userData.decodedData?.data || {};

    user.value = {
      name: userInfo.name,
      role: userInfo.role || 'User',
      image: userData.image || 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png'
    };
  } else {
    isLoggedIn.value = false;
    user.value = null;
  }
}

onMounted(() => {
  checkUserLogin();
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  cartCount.value = cartItems.reduce((total, item) => total + item.quantity, 0);
});
</script>

<template>
  <header class="sticky-top bg-light shadow-sm">
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

        <div class="col-auto d-flex align-items-center justify-content-end">
          <!-- Cart Icon -->
          <div class="cart-icon position-relative me-3">
            <router-link to="/cart" class="nav-link position-relative">
              <i class="fa fa-shopping-cart fa-lg"></i>
              <span v-if="cartState.count > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{ cartCount }}
                <span class="visually-hidden">items in cart</span>
              </span>
            </router-link>
          </div>

          <!-- Show login button if not logged in -->
          <template v-if="!isLoggedIn">
            <button class="btn btn-primary" @click="login">Login</button>
          </template>

          <!-- Show user info and logout button if logged in -->
          <template v-else>
            <button class="btn btn-outline-danger me-3" @click="logout">Logout</button>
            <div class="text-end me-3">
              <div class="fw-bold">{{ user?.name }}</div>
              <div class="text-muted small">{{ user?.role }}</div>
            </div>
            <img :src="user?.image" alt="User" class="rounded-circle" width="40" height="40">
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Sticky header */
header {
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Navigation link active style */
.nav-link.router-link-active {
  color: #42b983 !important;
  font-weight: 500;
}

/* Cart icon style */
.cart-icon {
  position: relative;
}

.cart-icon .badge {
  font-size: 0.75rem;
}

/* Header styling */
header {
  background-color: #ffffff;
  padding: 0.5rem 1rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #FF6B00;
}

.nav-link {
  color: #333;
}

.nav-link:hover {
  color: #FF6B00;
}

/* Align the cart icon and login/logout section */
.col-auto {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

button {
  font-weight: 600;
}
</style>
