<script setup>
import { ref, onMounted } from "vue";
import { useCartStore } from "./../stores/cartStore";

const cartStore = useCartStore();
const products = ref([]);

// when load page take product from API
const fetchProducts = async () => {
  try {
    const response = await fetch("http://localhost:5000/?endpoint=products");
    products.value = await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// load product when page loaded 
onMounted(fetchProducts);
</script>

<template>
  <div class="container mx-auto py-6">
    <h1 class="text-2xl font-bold mb-4">Drinks List </h1>

    <div class="grid grid-cols-3 gap-4">
      <div v-for="product in products" :key="product.id" class="p-4 border rounded-lg shadow-lg text-center">
        <img :src="`/images/${product.image}`" :alt="product.name" class="w-full h-40 object-cover rounded-md" />
        <h2 class="mt-2 text-lg font-semibold">{{ product.name }}</h2>
        <p class="text-gray-600">{{ product.price }} USA</p>
        <button  class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="cartStore.addToCart(product)"> 
          Add to order </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
}
</style>
