<template>
  <div class="container mt-5">
    <h3>Order Details</h3>
    <div v-if="orderDetails">
      <p><strong>Order ID:</strong> {{ orderDetails.order_id }}</p>
      <p><strong>Status:</strong> {{ orderDetails.status }}</p>
      <table class="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orderDetails.items" :key="item.product_id">
            <td>{{ item.product_name }}</td>
            <td>
              <input v-model="item.quantity" type="number" min="1" class="form-control" />
            </td>
            <td>{{ item.price }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="updateOrderDetails" class="btn btn-success">Update Order</button>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      orderDetails: null,
    };
  },
  mounted() {
    const orderId = this.$route.params.id;
    this.getOrderDetails(orderId);
  },
  methods: {
    async getOrderDetails(orderId) {
      try {
        const response = await axios.get(`http://localhost/PHP_Cafeteria_Backend/public/orders/${orderId}/details`);
        this.orderDetails = response.data;
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    },
    async updateOrderDetails() {
      try {
        const orderId = this.$route.params.id;
        const updatedItems = this.orderDetails.items;
        const response = await axios.post(`http://localhost/PHP_Cafeteria_Backend/public/orders/${orderId}/update`, {
          items: updatedItems,
        });
        alert(response.data.message);
      } catch (error) {
        console.error("Error updating order details:", error);
      }
    },
  },
};
</script>

<style scoped>
.table th, .table td {
  text-align: center;
}
</style>
