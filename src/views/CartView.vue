<script setup>
import { useCartStore } from "./../stores/cartStore";
import { computed } from "vue";

const cartStore = useCartStore();

// remove item from cart 
const removeFromCart = (productId) => {
  cartStore.cart = cartStore.cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cartStore.cart));
};

// update quantity 
const updateQuantity = (product, amount) => {
  product.quantity += amount;
  if (product.quantity < 1) {
    removeFromCart(product.id);
  } else {
    localStorage.setItem("cart", JSON.stringify(cartStore.cart));
  }
};

// total price 
const totalPrice = computed(() =>
  cartStore.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
</script>

<template>
  <div class="container mx-auto py-6">
    <h1 class="text-2xl font-bold mb-4">🛒</h1>

    <div v-if="cartStore.cart.length">
      <div v-for="product in cartStore.cart" :key="product.id" class="flex justify-between items-center border-b p-4">
        <div class="flex items-center gap-4">
          <img :src="`/images/${product.image}`" :alt="product.name" class="w-20 h-20 object-cover rounded-md" />
          <div>
            <h2 class="text-lg font-semibold">{{ product.name }}</h2>
            <p class="text-gray-600">{{ product.price }} USA</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button @click="updateQuantity(product, -1)" class="px-2 py-1 bg-gray-300 rounded">-</button>
          <span class="font-bold">{{ product.quantity }}</span>
          <button @click="updateQuantity(product, 1)" class="px-2 py-1 bg-gray-300 rounded">+</button>
          <button @click="removeFromCart(product.id)" class="px-2 py-1 bg-red-500 text-white rounded">🗑</button>
        </div>
      </div>

      <div class="mt-6 text-right">
        <h3 class="text-xl font-bold">Total: {{ totalPrice }} USA</h3>
        <button class="mt-2 px-4 py-2 bg-green-500 text-white rounded">Confirm</button>
      </div>
    </div>

    <p v-else class="text-gray-500 text-center mt-10"> 🛒</p>
  </div>
</template>
