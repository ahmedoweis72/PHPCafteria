<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AuthService from '../services/auth.service'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/PHP_Cafeteria_Backend/public'
const orders = ref([])
const summary = ref({
    total_orders: 0,
    total_amount: 0
})
const loading = ref(false)
const dateRange = ref({
    start_date: '',
    end_date: ''
})

// Get current user ID from auth service
const currentUser = AuthService.getCurrentUser()
const userId = currentUser?.decodedData?.data?.id

const fetchOrders = async () => {
    if (!userId) {
        toast.error('User not found')
        return
    }

    loading.value = true
    try {
        const params = new URLSearchParams()
        if (dateRange.value.start_date) {
            params.append('start_date', dateRange.value.start_date)
        }
        if (dateRange.value.end_date) {
            params.append('end_date', dateRange.value.end_date)
        }

        const response = await axios.get(`${API_URL}/users/${userId}/orders?${params}`, {
            headers: AuthService.authHeader()
        })

        if (response.data.status === 'success') {
            orders.value = response.data.data || []
            summary.value = response.data.summary
        } else {
            toast.error(response.data.message || 'Failed to fetch orders')
        }
    } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error(error.response?.data?.message || 'Error fetching orders')
    } finally {
        loading.value = false
    }
}

const applyDateFilter = () => {
    if (dateRange.value.start_date && dateRange.value.end_date) {
        if (dateRange.value.start_date > dateRange.value.end_date) {
            toast.error('Start date cannot be after end date')
            return
        }
    }
    fetchOrders()
}

const clearFilters = () => {
    dateRange.value = {
        start_date: '',
        end_date: ''
    }
    fetchOrders()
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

onMounted(() => {
    fetchOrders()
})
</script>

<template>
    <div class="orders-container p-4">
        <!-- Header with Title and Summary -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h2 mb-0">My Orders</h1>
            <div class="summary-stats d-flex gap-4">
                <div class="stat-item">
                    <span class="stat-label">Total Orders:</span>
                    <span class="stat-value fw-bold">{{ summary.total_orders }}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Amount:</span>
                    <span class="stat-value fw-bold">{{ summary.total_amount.toFixed(2) }} EGP</span>
                </div>
            </div>
        </div>

        <!-- Date Filter Section -->
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label">Start Date</label>
                        <input type="date" class="form-control" v-model="dateRange.start_date">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">End Date</label>
                        <input type="date" class="form-control" v-model="dateRange.end_date">
                    </div>
                    <div class="col-md-4 d-flex align-items-end gap-2">
                        <button class="btn btn-primary flex-grow-1" @click="applyDateFilter" :disabled="loading">
                            <i class="bi bi-filter"></i> Apply Filter
                        </button>
                        <button class="btn btn-outline-secondary" @click="clearFilters" :disabled="loading">
                            <i class="bi bi-x-circle"></i> Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Orders List -->
        <div class="card shadow-sm">
            <div class="card-body">
                <!-- Loading State -->
                <div v-if="loading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2 mb-0 text-muted">Loading your orders...</p>
                </div>

                <!-- No Orders State -->
                <div v-else-if="orders.length === 0" class="text-center py-5">
                    <i class="bi bi-bag-x display-1 text-muted"></i>
                    <p class="mt-3 mb-0 text-muted">No orders found for the selected period</p>
                </div>

                <!-- Orders Table -->
                <div v-else class="table-responsive">
                    <table class="table table-hover">
                        <thead class="table-light">
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th class="text-end">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in orders" :key="order.id">
                                <td>#{{ order.id }}</td>
                                <td>{{ formatDate(order.created_at) }}</td>
                                <td>
                                    <span :class="[
                                        'badge',
                                        {
                                            'bg-success': order.order_status === 'completed',
                                            'bg-warning': order.order_status === 'pending',
                                            'bg-danger': order.order_status === 'cancelled'
                                        }
                                    ]">
                                        {{ order.order_status }}
                                    </span>
                                </td>
                                <td class="text-end">{{ order.total_amount }} EGP</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.orders-container {
    max-width: 1200px;
    margin: 0 auto;
}

.stat-item {
    padding: 0.5rem 1rem;
    background-color: #f8f9fa;
    border-radius: 0.5rem;
}

.stat-label {
    color: #6c757d;
    margin-right: 0.5rem;
}

.stat-value {
    color: #198754;
}

.table th {
    font-weight: 600;
}

.badge {
    font-weight: 500;
    padding: 0.5em 0.75em;
}
</style>