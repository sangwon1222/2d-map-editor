import { createRouter, createWebHistory } from 'vue-router';
import { useHead } from '@vueuse/head';
import { useAuthStore } from '@/store/auth';
import { setDecode } from '@/util';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home.vue'),
    },
    {
      path: '/app',
      name: 'app',
      component: () => import('../views/app.vue'),
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const u = localStorage.getItem('u');
  if (!useAuthStore.userID) {
    const decodeU = setDecode(u, 'userid');
    useAuthStore.userID = decodeU;
  }

  if ((!useAuthStore.userID || !u) && to.path != '/') location.replace(location.origin);

  const title = to.name.toString().toUpperCase();
  useHead({ title });
  next();
});

export default router;
