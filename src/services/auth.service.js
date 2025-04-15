import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/PHP_Cafeteria_Backend/public';

class AuthService {
  async login(user) {
    try {
      const response = await axios.post(API_URL + '/login', {
        email: user.email,
        password: user.password
      });
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || { error: 'Login failed' };
    }
  }

  logout() {
    localStorage.removeItem('user');
  }

  async register(formData) {
    try {
      // Log headers for debugging
      console.log('Auth headers:', this.authHeader());
      
      // Make sure we're sending FormData properly
      const config = {
        headers: {
          ...this.authHeader(),
          'Content-Type': 'multipart/form-data'
        }
      };
      
      const response = await axios.post(API_URL + '/admin/users', formData, config);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error details:', error);
      if (error.response && error.response.status === 404) {
        throw new Error('API endpoint not found. Check your backend configuration.');
      }
      throw error.response?.data || { error: 'Registration failed' };
    }
  }

  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      try {
        const payload = user.token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return { ...user, decodedData: decoded };
      } catch (error) {
        console.error('Error decoding token:', error);
        return user;
      }
    }
    return user;
  }

  isAdmin() {
    const user = this.getCurrentUser();
    if (!user || !user.token) return false;
    
    try {
      const payload = user.token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.data && decoded.data.role === 'admin';
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  }

  isUser() {
    const user = this.getCurrentUser();
    if (!user || !user.token) return false;
    
    try {
      const payload = user.token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.data && decoded.data.role === 'user';
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  }

  isLoggedIn() {
    const user = this.getCurrentUser();
    return !!user && !!user.token;
  }

  // Get auth header with JWT token for protected requests
  authHeader() {
    const user = this.getCurrentUser();
    
    if (user && user.token) {
      return { Authorization: 'Bearer ' + user.token };
    } else {
      return {};
    }
  }
}

export default new AuthService();