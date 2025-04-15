import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null
    }),
    
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => {
            if (!state.token) return false;
            const payload = JSON.parse(atob(state.token.split('.')[1]));
            console.log(payload);
            return payload.role === 'admin';
          }
    },
    
    actions: {
        async login(credentials) {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            })
            const data = await response.json()
            console.log(data);
            this.token = data.token
            this.user = data.user
        },
        
        logout() {
            this.token = null
            this.user = null
        }
    },
    
    persist: {
        key: 'user',
        paths: ['user', 'token']
    }
})