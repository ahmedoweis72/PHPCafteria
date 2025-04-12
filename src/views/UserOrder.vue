<template>
         <div class="row">
  <div class="col-md-4 mb-3" v-for="item in products" :key="item.id">
    <div class="card h-100" @click="addItem(item)">
      <img :src="item.image_path" class="card-img-top" alt="product image" style="height: 200px; object-fit: cover;" />
      <div class="card-body">
        <h5 class="card-title">{{ item.name }}</h5>
        <p class="card-text">{{ item.price }} EGP</p>
      </div>
    </div>
  </div>
</div>
        </template>
        
        <script>
        import axios from 'axios';
        
        export default {
          data() {
            return {
              products: [],
              selectedItems: [],
              room: '',
              notes: '',
            };
          },
          created() {
            this.fetchProducts();
          },
          methods: {
            async fetchProducts() {
              try {
                const response = await axios.get('http://localhost/PHP_Cafeteria_Backend/public/products');
                this.products = response.data.products; // حسب شكل الـ JSON اللي راجع
              } catch (error) {
                console.error('Error fetching products:', error);
              }
            },
           
          }
        };
        </script>
        
        