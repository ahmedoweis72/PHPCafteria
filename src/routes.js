import { createRouter, createWebHistory } from 'vue-router'
import AddProductComponent from './views/AddProductComponent.vue'
import AllProductComponent from './views/AllProductComponent.vue'
import UsersComponent from './views/UsersComponent.vue';
import NotFound from './views/NotFound.vue'
import AddCategoryComponent from './views/AddCategoryComponent.vue'
import UpdateUserComponent from './views/UpdateUserComponent.vue';
import EditProductComponent from './views/EditProductComponent.vue';
import CheckComponent from './views/CheckComponent.vue';
import OrderComponent from './views/OrderComponent.vue';
import LoginComponent from './views/Login.vue';
import RegisterComponent from './views/Register.vue';
import authService from './services/auth.service';

const routes = [
    // {
    //     path:'/',
    //     name:'Home page',
    //     component:HeaderComponent
    // },
    {
        path:'/login',
        name:'Login',
        component:LoginComponent
    },
    {
        path:'/register',
        name:'Register',
        component:RegisterComponent
    },
    {
        path:'/updateUser/:id',
        name:'updateUser',
        component:UpdateUserComponent
    },
    {
        path:'/users',
        name:'All users',
        component:UsersComponent,
        meta:{requireAdmin:true}
    },
    {
        path:'/order',
        name:'Make Order',
        component:OrderComponent
    },
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
        path: '/edit-product/:id',
        name: 'edit',
        component: EditProductComponent
    },
    {
        path:'/checks',
        name:'checks',
        component:CheckComponent,
        meta:{requireAdmin:true}
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

//Adding guard to protect routes 
router.beforeEach((to,from,next)=>{
    if(to.meta.requireAdmin){
        if(authService.isAdmin()){
            next();
        }else{
            next({name:'Login'});
        }
    }else{
        next();
    }
})


export default router