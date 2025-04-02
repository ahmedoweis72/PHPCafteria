import { createApp } from 'vue'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './routes'


const pinia = createPinia()

createApp(App)
.use(pinia)
.use(router)
.mount('#app')
