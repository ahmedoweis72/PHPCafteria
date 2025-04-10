import { createRouter, createWebHistory } from 'vue-router'
import AddProductComponent from './views/AddProductComponent.vue'
import AllProductComponent from './views/AllProductComponent.vue'
import UsersComponent from './views/UsersComponent.vue';
import NotFound from './views/NotFound.vue'
import AddCategoryComponent from './views/AddCategoryComponent.vue'
import UpdateUserComponent from './views/UpdateUserComponent.vue';
import EditProductComponent from './views/EditProductComponent.vue';
import HeaderComponent from './views/HeaderComponent.vue';
import OrdersList from './views/OrdersList.vue';
import OrderDetails from './views/OrderDetails.vue';
import HomeComponent from './views/HomeComponent.vue';

const routes = [
    {
        path:'/',
        name:'Home-page',
        component:HeaderComponent

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
    },
    {
      path: '/orders',
      name: 'OrdersList',
      component: OrdersList,
    },
    {
      path: '/orders/:id',
      name: 'OrderDetails',
      component: OrderDetails,
      props: true, // for passing route params as props
    },
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
