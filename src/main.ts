import { createApp } from 'vue';
import { createHead } from '@vueuse/head';
import router from './router';
import App from './App.vue';
import './assets/tailwind.less';
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const app = createApp(App);
const head = createHead();

app.use(Vue3Toastify, {
  position: 'top-center',
  autoClose: 500,
  pauseOnHover: true,
  hideProgressBar: true,
  transition: 'flip',
  closeOnClick: true,
  theme: 'colored',
} as ToastContainerOptions);
app.use(head);
app.use(router);
app.mount('#app');
