import axios from 'axios';
import authService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/PHP_Cafeteria_Backend/public';


class UserService {
  async getAllUsers() {
    try {
      const response = await axios.get(API_URL + '/admin/users', {
        headers: authService.authHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch users' };
    }
  }

  async getUser(id) {
    try {
      const response = await axios.get(API_URL + `/users/${id}`, {
        headers: authService.authHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch user' };
    }
  }

  async updateUser(id, userData) {
    try {
      const response = await axios.put(API_URL + `/users/${id}`, userData, {
        headers: authService.authHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update user' };
    }
  }

  async deleteUser(id) {
    try {
      const response = await axios.delete(API_URL + `/admin/users/${id}`, {
        headers: authService.authHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete user' };
    }
  }
}

export default new UserService();