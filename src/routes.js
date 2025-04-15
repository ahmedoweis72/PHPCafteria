import { createRouter, createWebHistory } from 'vue-router'
import AddProductComponent from './views/AddProductComponent.vue'
import AllProductComponent from './views/AllProductComponent.vue'
import UsersComponent from './views/UsersComponent.vue';
import NotFound from './views/NotFound.vue'
import AddCategoryComponent from './views/AddCategoryComponent.vue'
import UpdateUserComponent from './views/UpdateUserComponent.vue';
import EditProductComponent from './views/EditProductComponent.vue';
import OrderDetails from './views/OrderDetails.vue';
import HomeComponent from './views/HomeView.vue';
import CheckComponent from './views/CheckComponent.vue';
import CartView from './views/CartView.vue';
import OrderComponent from './views/OrderComponent.vue';
import OrdersComponent from './views/OrdersComponent.vue';
import OrdersQueueComponent from './views/OrdersQueueComponent.vue';
import LoginComponent from './views/Login.vue';
import RegisterComponent from './views/Register.vue';
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
        path:'/order',
        name:'Make Order',
        component:OrderComponent,
        meta: {
            requiresAuth: true
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
