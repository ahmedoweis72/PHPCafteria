// src/stores/productStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/PHP_Cafeteria_Backend/public';


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
          `${API_URL}/products`,
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
        this.isLoading = true
        const response = await axios.post(
          `${API_URL}/products/${id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchProduct(id) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.get(
          `${API_URL}/products/${id}`
        )
        this.currentProduct = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})


