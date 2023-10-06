import { createRouter, createWebHistory } from 'vue-router';
import { useHead } from '@vueuse/head';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home.vue'),
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  useHead({
    title: to.name.toString().toUpperCase(),
  });
  next();
});

export default router;
