import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Lock from './views/Lock.vue';
const routes = [
  {
    path: '/',
    name: 'name',
    component: Home,
  },

  {
    path: '/lock',
    name: 'Lock',
    component: Lock,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;