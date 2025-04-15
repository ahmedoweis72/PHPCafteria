import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './authStore'

const API_URL = import.meta.env.VITE_API_URL

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        orders: [],
        allOrders: [], // for admin
        loading: false,
        summary: {
            total_orders: 0,
            total_amount: 0
        },
        error: null
    }),

    getters: {
        isAdmin() {
            const authStore = useAuthStore()
            return authStore.isAdmin
        }
    },

    actions: {
        async fetchUserOrders(dateRange = {}) {
            this.loading = true
            const authStore = useAuthStore()
            const userId = authStore.user?.id

            try {
                const params = new URLSearchParams()
                if (dateRange.start_date) params.append('start_date', dateRange.start_date)
                if (dateRange.end_date) params.append('end_date', dateRange.end_date)

                const response = await axios.get(
                    `${API_URL}/users/${userId}/orders?${params}`,
                    { headers: authStore.authHeader }
                )

                if (response.data.status === 'success') {
                    this.orders = response.data.data.orders || []
                    this.summary = response.data.summary
                }
            } catch (error) {
                this.error = error.response?.data?.message || 'Error fetching orders'
                throw error
            } finally {
                this.loading = false
            }
        },

        // Admin actions
        async fetchAllOrders(dateRange = {}) {
            if (!this.isAdmin) throw new Error('Unauthorized')
            
            this.loading = true
            try {
                const params = new URLSearchParams()
                if (dateRange.start_date) params.append('start_date', dateRange.start_date)
                if (dateRange.end_date) params.append('end_date', dateRange.end_date)

                const response = await axios.get(
                    `${API_URL}/admin/orders?${params}`,
                    { headers: useAuthStore().authHeader }
                )

                if (response.data.status === 'success') {
                    this.allOrders = response.data.data.orders || []
                    this.summary = response.data.summary
                }
            } catch (error) {
                this.error = error.response?.data?.message || 'Error fetching all orders'
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateOrderStatus(orderId, status) {
            if (!this.isAdmin) throw new Error('Unauthorized')

            try {
                const response = await axios.patch(
                    `${API_URL}/admin/orders/${orderId}`,
                    { status },
                    { headers: useAuthStore().authHeader }
                )

                if (response.data.status === 'success') {
                    // Update order in allOrders array
                    const orderIndex = this.allOrders.findIndex(order => order.id === orderId)
                    if (orderIndex !== -1) {
                        this.allOrders[orderIndex].order_status = status
                    }
                }
            } catch (error) {
                this.error = error.response?.data?.message || 'Error updating order status'
                throw error
            }
        }
    }
})