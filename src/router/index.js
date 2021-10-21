import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/warehouse' },
  { path: '/warehouse', component: () => import('../views/Warehouse') },
  { path: '/routes/', component: () => import('../views/Routes') },
  { path: '/drivers/:route_id/:strip', component: () => import('../views/Drivers') },
  { path: '/language', name: 'Language', component: () => import('../views/Language') },
  { path: '/login', name: 'Login', component: () => import('../views/Login') },
  { path: '/map', name: 'Map', component: () => import('../views/Map') },
  {
    path: '/fill-container',
    name: 'FillContainer',
    component: () => import('../views/FillContainers'),
  },
  {
    path: "/create-container",
    name: "CreateContainer",
    component: () => import("../views/CreateContainer")
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
