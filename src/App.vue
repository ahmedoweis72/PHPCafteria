<script setup>
import HeaderComponent from './views/shared/HeaderComponent.vue';
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <HeaderComponent class="w-100" />
    <div class="container flex-grow-1 p-3">
      <router-view />
    </div>
  </div>
</template>

<style>
/* No custom styles needed here as we're using Bootstrap utilities */
</style>
