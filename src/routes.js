import { createRouter, createWebHistory } from 'vue-router'
import AddProductComponent from './views/AddProductComponent.vue'
import AllProductComponent from './views/AllProductComponent.vue'
import UsersComponent from './views/UsersComponent.vue';
import NotFound from './views/NotFound.vue'
import AddCategoryComponent from './views/AddCategoryComponent.vue'
import EditProductComponent from './views/EditProductComponent.vue';


const routes = [
    // {
    //     path:'/',
    //     name:'Home page',
    //     component:HeaderComponent

    // },
    {
        path:'/users',
        name:'All users',
        component:UsersComponent
    },
    {
        path: '/add-product',
        name: 'add',
        component: AddProductComponent
    },
    ,
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
        path: '/edit-product/:id',
        name: 'edit',
        component: EditProductComponent
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