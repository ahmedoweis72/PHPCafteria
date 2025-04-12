<template>
  <div class="container mt-5">
    <h3>Order List</h3>
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Status</th>
          <th>Total Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.status }}</td>
          <td>{{ order.total_amount }}</td>
          <td>
            <button @click="showOrderDetails(order.id)" class="btn btn-info">View Details</button>
            <button v-if="order.status === 'Processing'" @click="cancelOrder(order.id)" class="btn btn-danger">Cancel</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      orders: [],
    };
  },
  mounted() {
    this.getOrders();
  },
  methods: {
    async getOrders() {
      try {
        const response = await axios.get("http://localhost/PHP_Cafeteria_Backend/public/orders");
        this.orders = response.data;
      } catch (error) {
        console.error("There was an error fetching orders:", error);
      }
    },
    async cancelOrder(orderId) {
      try {
        const response = await axios.post(`http://localhost/PHP_Cafeteria_Backend/public/orders/${orderId}/cancel`);
        alert(response.data.message);
        this.getOrders(); // Refresh the order list after cancellation
      } catch (error) {
        console.error("Error cancelling order:", error);
      }
    },
    showOrderDetails(orderId) {
      this.$router.push(`/orders/${orderId}/details`);
    },
  },
};
</script>

<style scoped>
.table th, .table td {
  text-align: center;
}
</style>
