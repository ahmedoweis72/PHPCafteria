<template>
  <div class="container my-4">
    
    <div class="col-md-3 mb-3">
      <select v-model="selectedCategory" class="form-control">
        <option value="">All Categories</option>
        <option value="Hot Drinks">Hot Drinks</option>
        <option value="Cold Drinks">Cold Drinks</option>
        <option value="Snacks">Snacks</option>
       
      </select>
    </div>

    
    <div class="row">
      <div class="col-md-4 mb-4" v-for="product in filteredProducts" :key="product.id">
        <div class="card h-100">
          <img :src="product.image" class="card-img-top" alt="Product Image">
          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">{{ product.description }}</p>
            <p class="card-text"><strong>Price:</strong> ${{ product.price }}</p>
            <p class="card-text"><strong>Status:</strong> {{ product.status === 'available' ? 'In Stock' : 'Out of Stock' }}</p>
            <button class="btn btn-primary" @click="addToCart(product)">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>

    
    <div v-if="cart.length > 0" class="cart mt-5">
      <h4>Shopping Cart</h4>
      <ul class="list-group">
        <li class="list-group-item" v-for="item in cart" :key="item.id">
          <strong>{{ item.name }}</strong> - ${{ item.price }}
          <button class="btn btn-danger btn-sm float-right" @click="removeFromCart(item)">Remove</button>
        </li>
      </ul>
      <p><strong>Total:</strong> ${{ totalPrice }}</p>
      <button class="btn btn-warning" @click="clearCart">Clear Cart</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],  
      selectedCategory: '',  
      cart: JSON.parse(localStorage.getItem('cart')) || []  
    };
  },
  computed: {
   
    filteredProducts() {
      if (!this.selectedCategory) {
        return this.products;  
      }
      return this.products.filter(product => product.category_name === this.selectedCategory);
    },
    
    totalPrice() {
      return this.cart.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);
    },
    
    cartCount() {
      return this.cart.length;
    }
  },
  mounted() {
    
    axios.get('http://localhost/PHP_Cafeteria_Backend/public/products')
      .then(response => {
        if (Array.isArray(response.data)) {
          this.products = response.data;  
        } else {
          console.error("The response is not an array:", response.data);
        }
      })
      .catch(error => {
        console.error("There was an error fetching the products:", error);
      });
  },
  methods: {
    addToCart(product) {
      const existingItem = this.cart.find(item => item.id === product.id);
      if (existingItem) {
   
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    
    this.cart.push({ ...product, quantity: 1 });
  }
      
      localStorage.setItem('cart', JSON.stringify(this.cart));
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
    }
  }
};
</script>
