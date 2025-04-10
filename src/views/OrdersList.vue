<template>
          <div>
            <h1>Orders</h1>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th> Total Price</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order.id">
                  <td>{{ order.id }}</td>
                  <td>{{ order.total_price }}</td>
                  <td>{{ order.status }}</td>
                  <td>{{ order.created_at }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        
        <script>
        export default {
          data() {
            return {
              orders: [],
            };
          },
          mounted() {
            this.fetchOrders();
          },
          methods: {
            fetchOrders() {
              axios
                .get('http://localhost/Backend-Coffee/PHP_Cafeteria_Backend/public/orders') // تأكد من أن هذا المسار صحيح
                .then((response) => {
                  this.orders = response.data;
                })
                .catch((error) => {
                  console.error('Error fetching orders:', error);
                });
            },
          },
        };
        </script>
        