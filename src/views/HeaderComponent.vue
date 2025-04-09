<script setup>
const user = {
  name: "John Doe",
  role: "Admin",
  image: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
};
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
              <li class="nav-item">
                <router-link to="/products" class="nav-link">Products</router-link>
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
            </ul>
          </nav>
        </div>
        
        <div class="col-auto d-flex align-items-center">
          <div class="text-end me-3">
            <div class="fw-bold">{{ user.name }}</div>
            <div class="text-muted small">{{ user.role }}</div>
          </div>
          <img :src="user.image" alt="User" class="rounded-circle" width="40" height="40">
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