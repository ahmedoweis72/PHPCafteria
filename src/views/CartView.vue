<template>
  <div class="container">
    <h3>Your Shopping Cart</h3>

    <div v-if="cart.length === 0">
      <p>Your cart is empty.</p>
    </div>

    <div v-else>
      <div class="row">
        <div class="col-md-4 mb-4" v-for="item in cart" :key="item.id">
          <div class="card h-100">
            <img :src="item.image" class="card-img-top" alt="Product Image">
            <div class="card-body">
              <h5 class="card-title">{{ item.name }}</h5>
              <p class="card-text"><strong>Price:</strong> ${{ item.price }}</p>

              <div class="form-group">
                <label for="notes">Notes:</label>
                <textarea v-model="item.notes" class="form-control" id="notes" rows="2"></textarea>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <button class="btn btn-secondary btn-sm" @click="decreaseQuantity(item)">-</button>
                <span class="font-weight-bold">Quantity: {{ item.quantity || 1 }}</span>
                <button class="btn btn-secondary btn-sm" @click="increaseQuantity(item)">+</button>
              </div>

              <button class="btn btn-danger btn-sm float-right mt-2" @click="removeFromCart(item)">Remove</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Room Dropdown -->
      <div class="form-group w-25 mb-3">
        <label for="room">Select Room:</label>
        <select id="room" v-model="selectedRoom" class="form-control">
          <option v-for="room in rooms" :key="room.id" :value="room.id">
            {{ room.name }}
          </option>
        </select>
      </div>

      <div class="d-flex justify-content-between mt-3">
        <p><strong>Total:</strong> ${{ totalPrice }}</p>
        <button class="btn btn-success" @click="confirmOrder">Confirm Order</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => total + (parseFloat(item.price) * (item.quantity || 1)), 0).toFixed(2);
    }
  },
  data() {
    return {
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      rooms: [],
      selectedRoom: null
    };
  },
  mounted() {
    fetch('http://localhost/PHP_Cafeteria_Backend/public/rooms')
      .then(res => res.json())
      .then(data => {
        this.rooms = data;
        if (this.rooms.length) this.selectedRoom = this.rooms[0].id;
      })
      .catch(error => console.error('Error loading rooms:', error));
  },
  methods: {
    increaseQuantity(item) {
      item.quantity = (item.quantity || 1) + 1;
      this.updateLocalStorage();
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
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    confirmOrder() {
  const orderData = {
    user_id: this.userId, 
    room_id: this.selectedRoom,
    total_amount: this.totalPrice, 
    order_items: this.cart.map(item => ({
      product_id: item.id,
      quantity: item.quantity || 1,
      price: item.price,
      notes: item.notes || ''
    }))
  };

  axios.post('http://localhost/PHP_Cafeteria_Backend/public/orders', orderData, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      alert('Order confirmed!');
      this.clearCart();
      this.$router.push({ name: 'orderDetails', params: { id: res.data.orderId } }); // ← fix orderId هنا كمان
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
}

textarea {
  font-size: 0.9rem;
}

button {
  font-size: 0.9rem;
}
</style>
