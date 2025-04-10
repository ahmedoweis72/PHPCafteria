import { createRouter, createWebHistory } from "vue-router";
import AddProductComponent from "./views/AddProductComponent.vue";
import AllProductComponent from "./views/AllProductComponent.vue";
import NotFound from "./views/NotFound.vue";
import HomeView from "./views/HomeView.vue";
import CartView from "./views/CartView.vue";
import OrderDetails from "./views/OrderDetails.vue";
import OrdersList from "./views/OrdersList.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },

  {
    path: "/cart",
    name: "Cart",
    component: CartView,
  },

  {
    path: "/addProductComponent",
    name: "add",
    component: AddProductComponent,
  },
  {
    path: "/allProductComponent",
    name: "all",
    component: AllProductComponent,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
