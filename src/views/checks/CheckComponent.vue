<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import authService from '../../services/auth.service';

const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(false);

const startDate = ref('');
const endDate = ref('');
const selectedUser = ref(null);


const users = ref([]);
const expandedOrder = ref('');
const expandedUser = ref('');
const selectedUserName = ref('');
const loadingOrders = ref(false);
const selectedUserOrders = ref([]);
const orderItems = ref([]);
const loadingItems = ref(false);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/PHP_Cafeteria_Backend/public';

const token = authService.authHeader().Authorization || '';


const fetchUsers = async (page = 1) => {
  try {
    loading.value = true;

    const response = await axios.get(`${API_URL}/users-with-orders`, {
      params: {
        page,
        start_date: startDate.value,
        end_date: endDate.value,
        user_id: selectedUser.value
      }, headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    users.value = response.data.data;
    totalPages.value = response.data.pagination.total_pages;
    currentPage.value = page;


  } catch (err) {
    console.error('Failed to fetch user data', err);
  } finally {
    loading.value = false;
  }

}

const fetchUserOrders = async (userId) => {
  try {
    loadingOrders.value = true;
    const response = await axios.get(`${API_URL}/users/${userId}/orders`, {
      params: {
        startDate: startDate.value,
        endDate: endDate.value
      }, headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;

  } catch (err) {
    console.error('Failed to fetch orders of user', err);
    return null;
  } finally {
    loadingOrders.value = false;
  }
}

//To show the orders for the user when he click on the button
const toggleUserOrders = async (user) => {
  //To make the button toggle
  if (expandedUser.value === user.user_id) {
    expandedUser.value = null;
    return;
  }

  expandedUser.value = user.user_id;
  selectedUserName.value = user.fullName;
  loadingOrders.value = true;


  try {
    //Fetch all orders for this user
    const response = await fetchUserOrders(user.user_id);

    if (response && response.data) {
      selectedUserOrders.value = response.data;
    } else {
      selectedUserOrders.value = [];

    }

  } catch (err) {
    console.error(`Error fetching orders:`, err);
    selectedUserOrders.value = [];
  } finally {
    loadingOrders.value = false;
  }

}

//To toggle orderItems when user click on the button
const toggleOrderItems = async (orderId) => {
  //To change the state
  if (expandedOrder.value === orderId) {
    expandedOrder.value = null;
    return;
  }

  expandedOrder.value = orderId;

  try {
    loadingItems.value = true;
    const response = await axios.get(`${API_URL}/orders/${orderId}/info`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response);
    if (response.data) {
      orderItems.value = response.data.data;
    } else {
      orderItems.value = [];
    }


  } catch (err) {
    console.error('Failed to fetch order Items: ', err);
    orderItems.value = [];
  } finally {
    loadingItems.value = false;
  }
}


//When user click the apply every thing will be reset 
const applyFilters = () => {
  // Reset expanded state
  expandedUser.value = null;
  expandedOrder.value = null;
  selectedUserOrders.value = [];

  // Reset to page 1
  currentPage.value = 1;

  // Fetch users with filters
  fetchUsers(1);
};

// Get status badge class
const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered': return 'badge bg-success';
    case 'processing': return 'badge bg-warning text-dark';
    case 'cancelled': return 'badge bg-danger';
    case 'pending': return 'badge bg-info';
    default: return 'badge bg-secondary';
  }
};


onMounted(() => {
  fetchUsers();
})

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    fetchUsers(page);
  }
}



</script>

<template>
  <div class="checks-container">
    <!-- Header with Title and Filters -->
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-primary bg-gradient text-white">
        <h5 class="mb-0">Order Checks</h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <!-- Date Range Filters -->
          <div class="col-md-3">
            <label for="startDate" class="form-label">Start Date</label>
            <input v-model="startDate" type="date" class="form-control" id="startDate">
          </div>
          <div class="col-md-3">
            <label for="endDate" class="form-label">End Date</label>
            <input v-model="endDate" type="date" class="form-control" id="endDate">
          </div>

          <!-- User Filter -->
          <div class="col-md-4">
            <label for="userFilter" class="form-label">Filter by User</label>
            <select v-model="selectedUser" class="form-select" id="userFilter">
              <option value="">All Users</option>
              <option v-for="user in users" :key="user.user_id" :value="user.user_id">{{ user.fullName }}</option>
            </select>
          </div>

          <!-- Apply Filter Button -->
          <div class="col-md-2 d-flex align-items-end">
            <button @click="applyFilters" class="btn btn-primary w-100">Apply Filters</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h6 class="card-title mb-3">Users</h6>
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Room</th>
                <th>Total Orders</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(user, index) in users" :key="user.user_id">
                <!-- User Row - Clicking expands to show their orders -->
                <tr class="user-row">
                  <td>{{ index + 1 + (currentPage - 1) * 6 }}</td>
                  <td>
                    <img
                      :src="user.profilePicture || 'https://image.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-260nw-2281862025.jpg'"
                      :alt="user.fullName" class=" rounded-circle" width="40" height="40">
                  </td>
                  <td>{{ user.fullName }}</td>
                  <td>Room {{ user.roomNum }}</td>
                  <td>{{ user.order_count || 0 }}</td>
                  <td>${{ (parseFloat(user.total_spent) || 0).toFixed(2) }}</td>
                  <td>
                    <button @click="toggleUserOrders(user)" class="btn btn-sm btn-outline-primary"
                      :class="{ 'active': expandedUser === user.user_id }">
                      <i :class="expandedUser === user.user_id ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i> {{
                        expandedUser === user.user_id ? 'Hide' : 'Details' }}
                    </button>
                  </td>
                </tr>

                <!-- Expandable Orders Section for User 1 -->
                <tr v-if="expandedUser === user.user_id">
                  <td colspan="7" class="p-0">
                    <div class="orders-container p-3 bg-light">
                      <div v-if="loadingOrders" class="text-center py-3">
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2 mb-0">Loading orders...</p>
                      </div>
                      <div v-else>
                        <h6 class="mb-3">Orders for {{ selectedUserName }}</h6>

                        <!-- Orders Table -->
                        <table class="table table-sm table-bordered">
                          <thead class="table-secondary">
                            <tr>
                              <th>Order #</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Total</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <template v-for="order in selectedUserOrders" :Key="order.id">
                              <!-- Order Row - Clicking expands to show order items -->
                              <tr class="order-row">
                                <td>{{ order.id }}</td>
                                <td>{{ order.created_at }}</td>
                                <td><span :class="getStatusBadgeClass(order.order_status)">{{ order.order_status
                                }}</span></td>
                                <td>${{ order.total_amount }}</td>
                                <td>
                                  <button @click="toggleOrderItems(order.id)" class="btn btn-sm btn-outline-info">
                                    <i :class="expandedOrder === order.id ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"
                                      class="bi bi-list-ul"></i> Items
                                  </button>
                                </td>
                              </tr>

                              <!-- Expandable Order Items for Order-->
                              <tr v-if="expandedOrder === order.id">
                                <td colspan="5" class="p-0">
                                  <div class="order-items p-3 bg-white">
                                    <h6 class="mb-3">Order Items</h6>
                                    <div v-if="loadingItems" class="text-center py-3">
                                      <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                      </div>
                                      <p class="mt-2 mb-0">Loading orders...</p>
                                    </div>
                                    <div v-else>
                                      <!-- No items message -->
                                      <div v-if="!orderItems || orderItems.length === 0" class="text-center">
                                        <p class="text-muted mb-0">No items found for this order.</p>
                                      </div>

                                      <div v-else class="row g-2">
                                        <!-- Order Item Card -->
                                        <template v-for="orderItem in orderItems" :key="orderItem.id">
                                          <div class="col-md-4 col-sm-6">
                                            <div class="card h-100">
                                              <img
                                                :src="orderItem.image || 'https://www.plas-pak.com/wp-content/themes/plaspak/img/product-placeholder.gif'"
                                                class="card-img-top" alt="Product">
                                              <div class="card-body">
                                                <h6 class="card-title">{{ orderItem.name }}</h6>
                                                <p class="card-text mb-1">
                                                  <small class="text-muted">Qty: {{ orderItem.quantity }} x
                                                    EGP {{ orderItem.price_at_order }}</small>
                                                </p>
                                                <p class="fw-bold mb-0">EGP {{ orderItem.price_at_order }}</p>
                                              </div>
                                            </div>
                                          </div>
                                        </template>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </template>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- No Results -->
        <div class="text-center py-4 d-none">
          <p class="text-muted mb-0">No users found matching your criteria.</p>
        </div>
      </div>
    </div>

    <!-- pagination  -->
    <nav aria-label="Users pagination" class="mt-4 mb-4">
      <ul class="pagination justify-content-center">
        <!-- Previous Button -->
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
            <i class="bi bi-chevron-left"></i> Previous
          </a>
        </li>

        <!-- Page Numbers -->
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
          <a class="page-link" @click.prevent="changePage(page)" href="#">{{ page }}</a>
        </li>

        <!-- Next Button -->
        <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
          <a class="page-link" @click.prevent="changePage(currentPage + 1)" href="#">
            Next <i class="bi bi-chevron-right"></i>
          </a>
        </li>
      </ul>
    </nav>

  </div>
</template>

<style scoped>
.checks-container {
  padding-bottom: 2rem;
}

.user-row {
  cursor: pointer;
}

.user-row:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.collapse-row {
  background-color: #f8f9fa;
}

.orders-container {
  border-radius: 4px;
}

.order-row {
  cursor: pointer;
}

.order-row:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.order-items {
  border-radius: 4px;
}

/* Card image aspect ratio */
.card-img-top {
  height: 120px;
  object-fit: cover;
}

/* Badge styling */
.badge {
  font-weight: 500;
}

/* Transition for collapse elements */
.collapse {
  transition: all 0.2s ease;
}

/* Responsive adjustments for tables */
@media (max-width: 768px) {
  .table {
    font-size: 0.85rem;
  }
}

.pagination .page-link {
  color: #0d6efd;
  border-radius: 0.25rem;
  margin: 0 2px;
  transition: all 0.2s ease;
}

.pagination .page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

.pagination .page-link:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
  color: #0a58ca;
  z-index: 2;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}

/* Make pagination more compact on mobile */
@media (max-width: 576px) {
  .pagination .page-link {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
}
</style>
