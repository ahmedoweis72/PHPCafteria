import { createApp } from 'vue'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './routes'
import Vue3Toastify from 'vue3-toastify'


const pinia = createPinia()

createApp(App)
.use(pinia)
.use(router)
.use(Vue3Toastify, {
    autoClose: 3000,
    position: 'top-right',
  })
.mount('#app')