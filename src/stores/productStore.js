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
    }
  }
})
