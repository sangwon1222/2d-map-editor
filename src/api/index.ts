import axios, { AxiosInstance } from 'axios';
import { setInterceptors } from './interceptor';
import { useAuthStore } from '@/store/auth';

const url = 'http://192.168.0.4:8000/api';

const createAxios = (): AxiosInstance => {
  const createAxios = axios.create({
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${useAuthStore.accessToken}`,
    },
    timeout: 3000,
  });

  return setInterceptors(createAxios);
};

const api = createAxios();

export default api;
