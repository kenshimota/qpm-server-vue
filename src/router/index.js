import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/warehouse' },
  { path: '/warehouse', component: () => import('../views/Warehouse') },
  { path: '/routes', component: () => import('../views/Routes') },
  { path: '/drivers', component: () => import('../views/Drivers') },
  { path: '/language', component: () => import('../views/Language') },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
