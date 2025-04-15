<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import authService from '../../services/auth.service';
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/PHP_Cafeteria_Backend/public'
const orders = ref([])
const loading = ref(false)
const expandedOrders = ref(new Set())
const orderItems = ref({})

const fetchProcessingOrders = async () => {
    loading.value = true
    try {
        const response = await axios.get(`${API_URL}/users-with-orders`, {
            headers: authService.authHeader(),
            params: {
                status: 'processing'
            }
        })

        if (response.data.status === 'success') {
            orders.value = response.data.data || []
        } else {
            toast.error(response.data.message || 'Failed to fetch orders')
        }
    } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to fetch orders queue')
    } finally {
        loading.value = false
    }
}

const toggleOrderItems = async (orderId) => {
    if (expandedOrders.value.has(orderId)) {
        expandedOrders.value.delete(orderId)
    } else {
        try {
            const response = await axios.get(`${API_URL}/orders/${orderId}/info`, {
                headers: authService.authHeader()
            })
            if (response.data.status === 'success') {
                orderItems.value[orderId] = response.data.data
                expandedOrders.value.add(orderId)
            }
        } catch (error) {
            toast.error('Failed to fetch order details')
        }
    }
}

const markAsDelivered = async (orderId) => {
    try {
        const response = await axios.patch(`${API_URL}/orders/${orderId}/status`,
            { status: 'completed' },
            { headers: authService.authHeader() }
        )

        if (response.data.status === 'success') {
            toast.success('Order marked as delivered')
            await fetchProcessingOrders() // Refresh the list
        }
    } catch (error) {
        toast.error('Failed to update order status')
    }
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
    fetchProcessingOrders()
})
</script>

<template>
    <div class="orders-queue-container p-4">
        <h1 class="h2 mb-4">Orders Queue</h1>

        <div class="card shadow-sm">
            <div class="card-body">
                <!-- Loading State -->
                <div v-if="loading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2 mb-0 text-muted">Loading orders queue...</p>
                </div>

                <!-- No Orders State -->
                <div v-else-if="orders.length === 0" class="text-center py-5">
                    <i class="bi bi-inbox display-1 text-muted"></i>
                    <p class="mt-3 mb-0 text-muted">No processing orders at the moment</p>
                </div>

                <!-- Orders Table -->
                <div v-else class="table-responsive">
                    <table class="table table-hover">
                        <thead class="table-light">
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Room</th>
                                <th>Ext</th>
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
                                                    style="font-size: 1.2rem; color: #0d6efd;">
                                                </i>
                                            </button>
                                            <span>{{ formatDate(order.created_at) }}</span>
                                        </div>
                                    </td>
                                    <td>{{ order.fullName }}</td>
                                    <td>{{ order.room_number }}</td>
                                    <td>{{ order.ext }}</td>
                                    <td class="text-center">
                                        <button class="btn btn-sm btn-success" @click="markAsDelivered(order.id)">
                                            <i class="bi bi-check2"></i> Deliver
                                        </button>
                                    </td>
                                </tr>
                                <!-- Order Items Expansion Row -->
                                <tr v-if="expandedOrders.has(order.id)">
                                    <td colspan="5">
                                        <div class="order-items-container p-3">
                                            <div class="row g-3">
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
                                                                        Price: {{ item.price_at_order }} EGP
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
.orders-queue-container {
    max-width: 1200px;
    margin: 0 auto;
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

.order-items-container {
    background-color: #f8f9fa;
    border-radius: 0.5rem;
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
</style>