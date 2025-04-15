<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import authService from '../../services/auth.service'
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
const currentUser = authService.getCurrentUser()
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
            headers: authService.authHeader()
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

// Add new refs for handling order items display
const expandedOrders = ref(new Set())
const orderItems = ref({})

// Add new methods
const toggleOrderItems = async (orderId) => {
    if (expandedOrders.value.has(orderId)) {
        expandedOrders.value.delete(orderId)
    } else {
        try {
            const response = await axios.get(`${API_URL}/orders/${orderId}/info`, {
                headers: authService.authHeader()
            })
            if (response.data.status === 'success') {
                if (!response.data.data || response.data.data.length === 0) {
                    toast.info('No items found for this order')
                    return
                }
                orderItems.value[orderId] = response.data.data
                expandedOrders.value.add(orderId)
            }
        } catch (error) {
            toast.error('Failed to fetch order details')
        }
    }
}

const cancelOrder = async (orderId) => {
    try {
        const order = orders.value.find(o => o.id === orderId);
        if (!order) {
            console.error(`Order ${orderId} not found`);
            return;
        }
        console.log(order);
        const order_status = order?.order_status;
        console.log(order_status);
        const response = await axios.patch(`${API_URL}/orders/${orderId}/cancel`, {
            status: order_status
        }, {
            headers: authService.authHeader()
        })
        if (response.data.status === 'success') {
            toast.success('Order cancelled successfully')
            fetchOrders() // Refresh orders list
        }
    } catch (error) {
        toast.error('Failed to cancel order')
    }
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
                                <th>Date</th>
                                <th>Status</th>
                                <th class="text-end">Amount</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="order in orders" :key="order.id">
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <button class="btn btn-sm btn-icon me-2" @click="toggleOrderItems(order.id)"
                                                :title="expandedOrders.has(order.id) ? 'Hide Details' : 'Show Details'">
                                                <i class="bi"
                                                    :class="expandedOrders.has(order.id) ? 'bi-dash-circle-fill' : 'bi-plus-circle-fill'"
                                                    style="font-size: 1.2rem; color: #0d6efd;"></i>
                                            </button>
                                            <span>{{ formatDate(order.created_at) }}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span :class="[
                                            'badge',
                                            {
                                                'bg-success': order.order_status.toLowerCase() === 'completed',
                                                'bg-warning': order.order_status.toLowerCase() === 'processing',
                                                'bg-danger': order.order_status.toLowerCase() === 'cancelled'
                                            }
                                        ]">
                                            {{ order.order_status }}
                                        </span>
                                    </td>
                                    <td class="text-end">{{ order.total_amount }} EGP</td>
                                    <td class="text-center">
                                        <button v-if="order.order_status.toLowerCase() === 'processing'"
                                            class="btn btn-sm btn-danger" @click="cancelOrder(order.id)">
                                            Cancel Order
                                        </button>
                                    </td>
                                </tr>
                                <!-- Order Items Expansion Row -->
                                <tr v-if="expandedOrders.has(order.id)">
                                    <td colspan="4">
                                        <div class="order-items-container p-3">
                                            <div v-if="!orderItems[order.id] || orderItems[order.id].length === 0"
                                                class="text-center py-4">
                                                <i class="bi bi-inbox display-4 text-muted"></i>
                                                <p class="mt-3 mb-0 text-muted">No items found for this order</p>
                                            </div>
                                            <div v-else class="row g-3">
                                                <div v-for="item in orderItems[order.id]" :key="item.id"
                                                    class="col-md-6">
                                                    <div class="card h-100">
                                                        <div class="row g-0">
                                                            <div class="col-4">
                                                                <img :src="item.image" class="img-fluid rounded-start"
                                                                    :alt="item.name">
                                                            </div>
                                                            <div class="col-8">
                                                                <div class="card-body">
                                                                    <h5 class="card-title">{{ item.name }}</h5>
                                                                    <p class="card-text">
                                                                        Quantity: {{ item.quantity }}<br>
                                                                        Price: {{ item.price }} EGP
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
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

.order-items-container .text-center {
    color: #6c757d;
}

.order-items-container .bi-inbox {
    opacity: 0.5;
}

.order-items-container .text-muted {
    font-size: 0.9rem;
}

.card-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
}

.card-text {
    font-size: 0.875rem;
    color: #6c757d;
}

img {
    object-fit: cover;
    height: 100%;
    width: 100%;
}

.btn-icon {
    padding: 0.25rem;
    line-height: 1;
    border: none;
    background: transparent;
}

.btn-icon:hover {
    background-color: rgba(13, 110, 253, 0.1);
    border-radius: 50%;
}

.btn-icon:focus {
    box-shadow: none;
}
</style>