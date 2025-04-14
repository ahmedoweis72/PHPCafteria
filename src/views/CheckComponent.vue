<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(false);

const startDate = ref('');
const endDate = ref('');
const selectedUser = ref('');


const users = ref([]);
const expandedOrder = ref('');
const expandedUser = ref('');
const selectedUserName = ref('');
const loadingOrders = ref(false);
const selectedUserOrders = ref('');

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/PHP_Cafeteria_Backend/public';

const token = localStorage.getItem('token');

const fetchUsers = async (page = 1) => {
  try {
    loading.value = true;
    const response = await axios.get(`${API_URL}/users-with-orders`, {
      params: {
        page,
      }, headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    users.value = response.data.data;
    console.log(response.data.data);
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
    loading.value = false;
  }
}

//To show the orders for the user when he click on the button
const toggleUserOrders = async (user) => {
  //To make the button toggle
  if (expandedUser.value === user.id) {
    expandedUser.value = null;
    return;
  }
  console.log(user);
  expandedUser.value = user.id;
  selectedUserName.value = user.fullName;
  loadingOrders.value = true;


  try {
    //Fetch all orders for this user
    const response = await fetchUserOrders(user.user_id);
    console.log(response);

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

//To toggle orderItems
const toggleOrderItems = (orderId) => {
  expandedOrder.value = expandedOrder.value === orderId ? null : orderId;
}

//Format date if I need
const formatDate = (dateString) => {

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
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.fullName }}</option>
            </select>
          </div>

          <!-- Apply Filter Button -->
          <div class="col-md-2 d-flex align-items-end">
            <button class="btn btn-primary w-100">Apply Filters</button>
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
              <!-- User Row - Clicking expands to show their orders -->
              <tr v-for="(user, index) in users" :key="user.id" class="user-row" data-bs-toggle="collapse"
                data-bs-target="#orders-user-1">
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
                    :class="{ 'active': expandedUser === user.id }">
                    <i :class="expandedUser === user.id ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i> {{
                      expandedUser === user.id ? 'Hide' : 'Details' }}
                  </button>
                </td>
              </tr>

              <!-- Expandable Orders Section for User 1 -->
              <tr class="collapse-row">
                <td colspan="7" class="p-0">
                  <div id="orders-user-1" class="collapse">
                    <div class="orders-container p-3 bg-light">
                      <h6 class="mb-3">Orders for John Doe</h6>

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
                          <!-- Order Row - Clicking expands to show order items -->
                          <tr class="order-row" data-bs-toggle="collapse" data-bs-target="#items-order-101">
                            <td>101</td>
                            <td>2024-04-12 10:30 AM</td>
                            <td><span class="badge bg-success">Delivered</span></td>
                            <td>$35.25</td>
                            <td>
                              <button class="btn btn-sm btn-outline-info">
                                <i class="bi bi-list-ul"></i> Items
                              </button>
                            </td>
                          </tr>

                          <!-- Expandable Order Items for Order 101 -->
                          <tr class="collapse-row">
                            <td colspan="5" class="p-0">
                              <div id="items-order-101" class="collapse">
                                <div class="order-items p-3 bg-white">
                                  <h6 class="mb-3">Order Items</h6>
                                  <div class="row g-2">
                                    <!-- Order Item Card -->
                                    <div class="col-md-4 col-sm-6">
                                      <div class="card h-100">
                                        <img src="https://via.placeholder.com/150" class="card-img-top" alt="Product">
                                        <div class="card-body">
                                          <h6 class="card-title">Espresso Coffee</h6>
                                          <p class="card-text mb-1">
                                            <small class="text-muted">Qty: 2 x $4.50</small>
                                          </p>
                                          <p class="fw-bold mb-0">$9.00</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-4 col-sm-6">
                                      <div class="card h-100">
                                        <img src="https://via.placeholder.com/150" class="card-img-top" alt="Product">
                                        <div class="card-body">
                                          <h6 class="card-title">Chicken Sandwich</h6>
                                          <p class="card-text mb-1">
                                            <small class="text-muted">Qty: 1 x $8.75</small>
                                          </p>
                                          <p class="fw-bold mb-0">$8.75</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-4 col-sm-6">
                                      <div class="card h-100">
                                        <img src="https://via.placeholder.com/150" class="card-img-top" alt="Product">
                                        <div class="card-body">
                                          <h6 class="card-title">French Fries</h6>
                                          <p class="card-text mb-1">
                                            <small class="text-muted">Qty: 2 x $3.25</small>
                                          </p>
                                          <p class="fw-bold mb-0">$6.50</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>

                          <!-- Another Order -->
                          <tr class="order-row" data-bs-toggle="collapse" data-bs-target="#items-order-102">
                            <td>102</td>
                            <td>2024-04-10 12:45 PM</td>
                            <td><span class="badge bg-success">Delivered</span></td>
                            <td>$22.50</td>
                            <td>
                              <button class="btn btn-sm btn-outline-info">
                                <i class="bi bi-list-ul"></i> Items
                              </button>
                            </td>
                          </tr>
                          <!-- Order items would go here -->
                          <tr class="collapse-row">
                            <td colspan="5" class="p-0">
                              <div id="items-order-102" class="collapse">
                                <div class="order-items p-3 bg-white">
                                  <h6 class="mb-3">Order Items</h6>
                                  <div class="row g-2">
                                    <!-- Order items cards would go here -->
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </td>
              </tr>

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
