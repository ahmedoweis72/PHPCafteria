import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null
    }),
    
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin'
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
    
    persist: true
})