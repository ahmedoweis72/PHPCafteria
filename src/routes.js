import { createRouter, createWebHistory } from 'vue-router'
import AddProductComponent from './views/AddProductComponent.vue'
import AllProductComponent from './views/AllProductComponent.vue'
import NotFound from './views/NotFound.vue'
import AddCategoryComponent from './views/AddCategoryComponent.vue'


const routes = [
    {
        path: '/add-product',
        name: 'add',
        component: AddProductComponent
    },
    {
        path: '/all-product',
        name: 'all',
        component: AllProductComponent
    },
    {
        path: '/add-category',
        name: 'cat',
        component: AddCategoryComponent
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