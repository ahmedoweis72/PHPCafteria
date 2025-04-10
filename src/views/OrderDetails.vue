<template>
          <div v-if="order">
            <h2>Order Details</h2>
            <p><strong>ID :</strong> {{ order.id }}</p>
            <p><strong>Total Price :</strong> {{ order.total_price }}</p>
            <p><strong>Status :</strong> {{ order.status }}</p>
            <p><strong>Date :</strong> {{ order.created_at }}</p>
          </div>
          <div v-else>
            <p>don.t found details for order !</p>
          </div>
        </template>
        
        <script>
        export default {
          data() {
            return {
              order: null,
            };
          },
          mounted() {
            const orderId = this.$route.params.id;  // get the order ID from the route parameters
            if (!orderId) {
              console.error('Order ID is not provided in the route.');
              return;
            }
            // Fetch order details using the order ID
            this.fetchOrderDetails(orderId);
          },
          methods: {
            fetchOrderDetails(id) {
              axios
                .get(`http://localhost/Backend-Coffee/PHP_Cafeteria_Backend/public/orders/${id}`)
                .then((response) => {
                  this.order = response.data;
                })
                .catch((error) => {
                  console.error('Error fetching order details:', error);
                });
            },
          },
        };
        </script>
        