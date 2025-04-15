import { createRouter, createWebHistory } from 'vue-router'
import AddProductComponent from './views/products/AddProductComponent.vue'
import AllProductComponent from './views/products/AllProductComponent.vue'
import UsersComponent from './views/users/UsersComponent.vue';
import NotFound from './views/NotFound.vue'
import AddCategoryComponent from './views/category/AddCategoryComponent.vue'
import UpdateUserComponent from './views/users/UpdateUserComponent.vue';
import EditProductComponent from './views/products/EditProductComponent.vue';
import OrderDetails from './views/orders/OrderDetails.vue';
import HomeComponent from './views/HomeView.vue';
import CheckComponent from './views/checks/CheckComponent.vue';
import CartView from './views/CartView.vue';
import OrdersComponent from './views/orders/OrdersComponent.vue';
import OrdersQueueComponent from './views/orders/OrdersQueueComponent.vue';
import LoginComponent from './views/auth/Login.vue';
import RegisterComponent from './views/auth/Register.vue';
import authService from './services/auth.service';

const routes = [
    {
         path:'/',
        name:'Home-page',
        component:HomeComponent,
        meta: {
            requiresAuth: true
        } 
     },
    {
        path:'/login',
        name:'Login',
        component:LoginComponent,
        meta: {
            requiresGuest : true
        }

    },
    {
        path:'/register',
        name:'Register',
        component:RegisterComponent,
        meta: {
            requiresAdmin : true
        }
    },
    {
        path:'/updateUser/:id',
        name:'updateUser',
        component:UpdateUserComponent,
        meta: {
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path:'/users',
        name:'All users',
        component:UsersComponent,
        meta: {
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path:'/orders',
        name:'My Orders',
        component:OrdersComponent,
        meta: {
            requiresAuth: true
        }
    },
    {
        path:'/orders-queue',
        name:'Orders Queue',
        component:OrdersQueueComponent,
        meta: {
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path: '/add-product',
        name: 'add',
        component: AddProductComponent,
        meta: {
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path: '/all-product',
        name: 'all',
        component: AllProductComponent,
        meta: {
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path: '/add-category',
        name: 'cat',
        component: AddCategoryComponent,
        meta: {
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path: '/edit-product/:id',
        name: 'edit',
        component: EditProductComponent,
        meta: {
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path:'/checks',
        name:'checks',
        component:CheckComponent,
        meta: {
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    
    {
      path: '/orders/:id/details',
      name: 'OrderDetails',
      component: OrderDetails,
      meta: {
        requiresAuth: true
    },
      props: true, // for passing route params as props
    },
    {
        path:'/cart',
        name:'CartView',
        component:CartView,
        meta: {
            requiresAuth: true
        },

    },
    {
        path:'/manual-order',
        name:'Manual Order',
        component:CartView,
        meta: {
            requiresAuth: true
        },

    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound
    },
]


const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach(async (to, from) => {
    if (to.meta.requiresAuth && !authService.isLoggedIn()) {
        return {
            path: '/login',
            query: { redirect: to.fullPath }
        }
    }

    if (to.meta.requiresGuest && authService.isLoggedIn()) {
        return { path: '/' }
    }

    if (to.meta.requiresAdmin && !authService.isAdmin()) {
        return { path: '/' }
    }
})


export default router
