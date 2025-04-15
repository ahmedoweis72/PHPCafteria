<template>
  <div class="container mt-5">
    <h3>Order Details</h3>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 mb-0 text-muted">Loading order details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Order Details -->
    <div v-else-if="orderDetails && orderDetails.length">
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <h5 class="card-title">Order #{{ orderDetails[0].order_id }}</h5>
          <table class="table">
            <thead class="table-light">
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price (EGP)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in orderDetails" :key="item.product_id">
                <td>{{ item.product_name }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.price }}</td>
                <td>{{ (parseFloat(item.price) * item.quantity).toFixed(2) }}</td>
              </tr>
              <tr class="table-light">
                <td colspan="3" class="text-end"><strong>Total Amount:</strong></td>
                <td><strong>{{ totalAmount }} EGP</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else class="text-center py-5">
      <i class="bi bi-exclamation-circle display-4 text-muted"></i>
      <p class="mt-3 mb-0 text-muted">No order details found</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import authService from '../services/auth.service';

export default {
  data() {
    return {
      orderDetails: null,
      loading: false,
      error: null
    };
  },
  computed: {
    totalAmount() {
      if (!this.orderDetails) return 0;
      return this.orderDetails.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
      }, 0).toFixed(2);
    }
  },
  mounted() {
    this.getOrderDetails(this.$route.params.id);
  },
  methods: {
    async getOrderDetails(orderId) {
      this.loading = true;
      this.error = null;

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/PHP_Cafeteria_Backend/public';
        const response = await axios.get(`${API_URL}/orders/${orderId}/details`, {
          headers: authService.authHeader()
        });

        if (response.data.status === 'success') {
          this.orderDetails = response.data.orderDetails;
        } else {
          throw new Error(response.data.message || 'Failed to fetch order details');
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        this.error = error.message || 'Failed to fetch order details';
        toast.error(this.error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

.card {
  border: none;
}

.card-title {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.table-light {
  background-color: #f8f9fa;
}

.bi {
  opacity: 0.5;
}
</style>
