<template>
  <div class="container py-4">
    <h3 class="mb-4 text-center">Your Shopping Cart</h3>

    <div v-if="cart.length === 0" class="text-center">
      <p>Your cart is empty.</p>
    </div>

    <div v-else>
      <div class="row">
        <div class="col-md-4 mb-4" v-for="item in cart" :key="item.id">
          <div class="card shadow-lg h-100">
            <img :src="item.image" class="card-img-top" alt="Product Image">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ item.name }}</h5>
              <p class="card-text"><strong>Price:</strong> ${{ item.price }}</p>

              <div class="form-group mb-3">
                <label for="notes" class="fw-bold">Notes:</label>
                <textarea v-model="item.notes" class="form-control" id="notes" rows="2"></textarea>
              </div>

              <div class="d-flex justify-content-between align-items-center mt-auto">
                <button class="btn btn-outline-primary btn-sm" @click="decreaseQuantity(item)">-</button>
                <span class="font-weight-bold">Quantity: {{ item.quantity || 1 }}</span>
                <button class="btn btn-outline-primary btn-sm" @click="increaseQuantity(item)">+</button>
              </div>

              <button class="btn btn-danger btn-sm mt-3" @click="removeFromCart(item)">
                <i class="fa fa-trash"></i> Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Room Dropdown -->
      <div class="form-group w-50 mx-auto mb-4">
        <label for="room" class="fw-bold">Select Room:</label>
        <select id="room" v-model="selectedRoom" class="form-control">
          <option v-for="room in rooms" :key="room.id" :value="room.id">
            {{ room.name }}
          </option>
        </select>
      </div>

      <!-- Users Dropdown -->
      <div class="form-group w-50 mx-auto mb-4">
      <label for="user" class="fw-bold">Select User:</label>
         <select id="user" v-model="selectedUser" class="form-control"required>
           <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }} ({{ user.role }})
           </option>
         </select>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-4">
        <p class="fw-bold fs-5">Total: <span class="text-success">${{ totalPrice }}</span></p>
        <button class="btn btn-success" @click="confirmOrder">
          Confirm Order <i class="fa fa-check-circle"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import cartState from '../stores/cartStore';

export default {
  computed: { 
    totalPrice() {
      return this.cart.reduce((total, item) => total + (parseFloat(item.price) * (item.quantity || 1)), 0).toFixed(2);
    }
  },
  data() {
    return {
      cart: cartState.items,
      //cart: JSON.parse(localStorage.getItem('cart')) || [],
      rooms: [],
      users: [],
      selectedRoom: null,
      selectedUser: null
    };
  },
  mounted() {
    this.userId = localStorage.getItem('id');
    console.log('userId:', this.userId);
    fetch('http://localhost:8000/rooms')
      .then(res => res.json())
      .then(data => {
        this.rooms = data;
        if (this.rooms.length) this.selectedRoom = this.rooms[0].id;
      })
      .catch(error => console.error('Error loading rooms:', error));

      fetch('http://localhost:8000/users') 
      .then(res => res.json())
      .then(data => {
      this.users = data;
      if (this.users.length) this.selectedUser = this.users[0].id;
      })
      .catch(error => console.error('Error loading users:', error));
  },
  methods: {
    increaseQuantity(item) {
      cartState.increaseQuantity(item.id);
      //item.quantity = (item.quantity || 1) + 1;
     // this.updateLocalStorage();
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.updateLocalStorage();
      }
    },
    removeFromCart(item) {
      const index = this.cart.indexOf(item);
      if (index !== -1) {
        this.cart.splice(index, 1);
        this.updateLocalStorage();
      }
    },
    clearCart() {
      this.cart = [];
      this.updateLocalStorage();
    },
    updateLocalStorage() {
      cartState.items = this.cart;
      cartState.save();
    },
    confirmOrder() {
      const orderData = {
        user_id: this.selectedUser, 
        room_id: this.selectedRoom,
        total_amount: this.totalPrice, 
        order_items: this.cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity || 1,
          price: item.price,
          notes: item.notes || ''
        }))
      };
      console.log(orderData);
      axios.post('http://localhost:8000/orders', orderData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          alert('Order confirmed!');
          cartState.clearCart();
          this.$router.push({ name: 'orderDetails', params: { id: res.data.orderId } });
        })
        .catch(error => console.error('Error confirming order:', error));
    }
  },
};
</script>

<style scoped>
.card-img-top {
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

textarea {
  font-size: 0.9rem;
}

button {
  font-size: 0.9rem;
}

/* Additional styles */
.card-body {
  display: flex;
  flex-direction: column;
}

.card {
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.card-text {
  font-size: 1rem;
}

.card-body .form-group {
  margin-bottom: 1rem;
}

button.btn {
  font-weight: 600;
  transition: all 0.3s ease-in-out;
}

button.btn:hover {
  transform: scale(1.05);
}

button.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

button.btn-danger:hover {
  background-color: #c82333;
  border-color: #c82333;
}

button.btn-outline-primary {
  color: #007bff;
  border-color: #007bff;
}

button.btn-outline-primary:hover {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

button.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

button.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}
</style>
