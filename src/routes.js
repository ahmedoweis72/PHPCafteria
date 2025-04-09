import { createRouter, createWebHistory } from 'vue-router'
import AddProductComponent from './views/AddProductComponent.vue'
import AllProductComponent from './views/AllProductComponent.vue'
import NotFound from './views/NotFound.vue'


const routes = [
    // {
    //     path:'/',
    //     name:'Home page',
    //     component:HeaderComponent

    // },
    {
        path: '/addProductComponent',
        name: 'add',
        component: AddProductComponent
    },
    ,
    {
        path: '/allProductComponent',
        name: 'all',
        component: AllProductComponent
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router