// src/stores/productStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductStore = defineStore('product', {
  state: () => ({
    categories: [],
    isLoading: false,
    error: null
  }),

  actions: {
   

    async createProduct(product) {
      this.isLoading = true
      this.error = null
      try {
        const formData = new FormData()

        formData.append('name', product.name)
        formData.append('price', product.price)
        formData.append('description', product.description)
        formData.append('quantity', product.quantity)
        formData.append('categoryId', product.categoryId)

        if (product.imageFile) {
          formData.append('image', product.imageFile)
        }

        const response = await axios.post(
          'http://localhost/PHP_Cafeteria_Backend/public/products',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        return response
      } catch (error) {
        this.error = error
        throw error
      } finally {
        this.isLoading = false
      }
    },

    
    async updateProduct(id, formData) {
      try {
        // Use POST with method override for better compatibility
        const response = await axios.post(
          `http://localhost/PHP_Cafeteria_Backend/public/products/${id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-HTTP-Method-Override': 'PUT'
            }
          }
        );
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchProduct(id) {
      this.isLoading = true
      this.error = null
      try {
        console.log(id);
        const response = await axios.get(
          
          `http://localhost/PHP_Cafeteria_Backend/public/products/${id}`
        )
        this.currentProduct = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
  }
})
