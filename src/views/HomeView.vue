<template>
  <div class="container-fluid my-5">
    <!-- Header -->
    <h2
      class="text-center mb-5 fw-bold"
      style="
        font-size: 3rem;
        color: #FF6B00;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        letter-spacing: 1px;
        animation: fadeIn 2s ease-in-out;
      "
    >
      Welcome to Cafeteria
    </h2>

    <!-- Category Filter -->
    <div class="col-md-3 mb-4 offset-md-9">
      <label for="category" class="font-weight-bold mb-2 text-secondary">Filter by Category</label>
      <select v-model="selectedCategory" id="category" class="form-control shadow-sm border-primary">
        <option value="">All Categories</option>
        <option value="Hot Drinks">Hot Drinks</option>
        <option value="Cold Drinks">Cold Drinks</option>
        <option value="Snacks">Snacks</option>
      </select>
    </div>

    <!-- Products List -->
    <div class="row">
      <div class="col-md-4 mb-4" v-for="product in filteredProducts" :key="product.id">
        <div
          class="card h-100 shadow-sm rounded border-0 transition-all hover-card"
          style="transition: transform 0.3s;"
        >
          <img
            :src="product.image"
            class="card-img-top rounded-top"
            alt="Product Image"
            style="height: 200px; object-fit: cover; border-bottom: 3px solid #FF6B00;"
          />
          <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title text-primary">{{ product.name }}</h5>
            <p class="card-text text-muted">
              {{ product.description.split(' ').slice(0, 10).join(' ') }}
              {{ product.description.split(' ').length > 10 ? '...' : '' }}
            </p>
            <p class="card-text"><strong>Price:</strong> ${{ product.price }}</p>
            <p class="card-text">
              <span :class="product.status === 'available' ? 'text-success' : 'text-danger'">
                {{ product.status === 'available' ? 'In Stock' : 'Out of Stock' }}
              </span>
            </p>
            <button v-if="product.status === 'available'"
               class="btn btn-success w-100 mt-auto btn-hover"
              @click="addToCart(product)"
              > Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cart -->
    <div v-if="cart.length > 0" class="cart mt-5 p-4 rounded shadow bg-white border">
      <h4 class="mb-4 text-primary font-weight-bold">Shopping Cart</h4>
      <ul class="list-group">
        <li
          class="list-group-item d-flex justify-content-between align-items-center bg-light mb-2 shadow-sm"
          v-for="item in cart"
          :key="item.product_id"
        >
          <div>
            <strong>{{ item.name }}</strong> - ${{ item.price }}
            <span class="badge bg-primary ms-2">x{{ item.quantity }}</span>
          </div>
          <button class="btn btn-outline-danger btn-sm px-3" @click="removeFromCart(item)">Remove</button>
        </li>
      </ul>
      <p class="mt-3"><strong>Total:</strong> ${{ totalPrice }}</p>
      <button class="btn btn-danger mt-3 w-100 py-2" @click="clearCart">Clear Cart</button>
    </div>

    <!-- Toast Container -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 9999">
      <div
        id="cart-toast"
        class="toast align-items-center text-white bg-success border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body"></div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  data() {
    return {
      products: [],
      selectedCategory: '',
      cart: JSON.parse(localStorage.getItem('cart')) || [],
    };
  },
  computed: {
    filteredProducts() {
      if (!this.selectedCategory) {
        return this.products;
      }
      return this.products.filter((product) => product.category_name === this.selectedCategory);
    },
    totalPrice() {
      return this.cart
        .reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0)
        .toFixed(2);
    },
    cartCount() {
      return this.cart.length;
    },
  },
  mounted() {
    axios
      .get('http://localhost/PHP_Cafeteria_Backend/public/products')
      .then((response) => {
        console.log('Response:', response.data);
        if (Array.isArray(response.data)) {
          this.products = response.data;
        } else {
          console.error('The response is not an array:', response.data);
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the products:', error);
      });
  },
  methods: {
    addToCart(product) {
      const existingItem = this.cart.find((item) => item.product_id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const cartItem = {
          product_id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          image: product.image,
          quantity: 1,
          notes: '',
        };
        this.cart.push(cartItem);
      }
      localStorage.setItem('cart', JSON.stringify(this.cart));
      toast.success('Add to Cart Successfully!');
      console.log('Added to cart:', product);
    },
    removeFromCart(item) {
      const index = this.cart.indexOf(item);
      if (index !== -1) {
        this.cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }
    },
    clearCart() {
      this.cart = [];
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
  },
};
</script>

<style scoped>
.card:hover {
  transform: translateY(-9px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #FF6B00;
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.btn-hover {
  transition: all 0.3s;
}

.btn-hover:hover {
  background-color: #FF6B00;
  color: white;
  transform: scale(1.05);
}

.cart {
  background-color: #f7f7f7;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.cart .list-group-item {
  border-radius: 8px;
}

h4 {
  font-size: 1.8rem;
  font-weight: bold;
}

.toast-body {
  font-size: 1.1rem;
  font-weight: bold;
}

.list-group-item {
  background-color: #fafafa;
  color: #333;
  padding: 10px;
}

.list-group-item button {
  transition: background-color 0.3s;
}

.list-group-item button:hover {
  background-color: #dc3545;
  color: white;
}

</style>
