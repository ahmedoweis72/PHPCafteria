// src/stores/categoryStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/PHP_Cafeteria_Backend/public';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchCategories() {
      this.isLoading = true
      try {
        const response = await axios.get(`${API_URL}/categories`)
        this.categories = response.data.data
        
      } catch (error) {
        console.error('Error fetching categories:', error)
        this.error = error
      } finally {
        this.isLoading = false
      }
    },

    async createCategory(data) {
      try {
        await axios.post(`${API_URL}/categories`, data)
        await this.fetchCategories()
      } catch (error) {
        throw error
      }
    },

    async updateCategory(id, data) {
      try {
        await axios.put(`${API_URL}/categories/${id}`, data)
        await this.fetchCategories()
      } catch (error) {
        throw error
      }
    },

    async deleteCategory(id) {
      try {
        const response = await axios.delete(`${API_URL}/categories/${id}`)
        this.categories = this.categories.filter(c => c.id !== id)
        return response.status
      } catch (error) {
        throw error
      }
    }
  }
})
