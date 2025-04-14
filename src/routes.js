import { createRouter, createWebHistory } from 'vue-router'
import AddProductComponent from './views/AddProductComponent.vue'
import AllProductComponent from './views/AllProductComponent.vue'
import UsersComponent from './views/UsersComponent.vue';
import NotFound from './views/NotFound.vue'
import AddCategoryComponent from './views/AddCategoryComponent.vue'
import UpdateUserComponent from './views/UpdateUserComponent.vue';
import EditProductComponent from './views/EditProductComponent.vue';
import OrdersList from './views/OrdersList.vue';
import OrderDetails from './views/OrderDetails.vue';
import HomeComponent from './views/HomeView.vue';
import CheckComponent from './views/CheckComponent.vue';
import UserOrder from './views/UserOrder.vue';
import CartView from './views/CartView.vue';
import OrderComponent from './views/OrderComponent.vue';
import LoginComponent from './views/Login.vue';
import RegisterComponent from './views/Register.vue';

const routes = [
    {
         path:'/',
        name:'Home-page',
        component:HomeComponent
     },
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
        component:UsersComponent
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
        component:CheckComponent
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound
    },
    {
      path: '/orders',
      name: 'OrdersList',
      component: OrdersList,
    },
    {
      path: '/orders/:id/details',
      name: 'OrderDetails',
      component: OrderDetails,
      props: true, // for passing route params as props
    },
    {
        path: '/order',
        name: 'UserOrder',
        component: UserOrder,
    },
    {
        path:'/cart',
        name:'CartView',
        component:CartView

    },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
