import { useAuthStore } from '@store/auth';
// import { router } from '@router/index';
import crypto from 'crypto-js';
import axios from 'axios';

// const mode = import.meta.env.MODE;
// const isProdiction = mode === 'production';
const isProdiction = true;
const api = axios.create({
  //   baseURL: isProdiction ? 'http://weoffice.sonidlab.co.kr/api/' : `http://localhost:1222/api/`,
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    account: `${localStorage.getItem('account')}`,
  },
  timeout: 3000,
});

export const getEncodedData = (data: string, secretKey?: string) => {
  const secret = secretKey ?? 'secret key';
  return crypto.AES.encrypt(JSON.stringify(data), secret).toString();
};
/**
 * @param string 디코딩할 문자열
 * @returns 디코딩된 문자열
 */
export const getDecodedData = (data: string, secretKey?: string) => {
  const secret = secretKey ?? 'secret key';
  const byte = JSON.stringify(crypto.AES.decrypt(data, secret).toString(crypto.enc.Utf8));
  return JSON.parse(byte);
};

axios.interceptors.request.use(
  function (config) {
    // 요청을 보내기 전에 수행할 일
    // ...
    console.warn(config);
    return config;
  },
  function (error) {
    // 오류 요청을 보내기전 수행할 일
    // ...
    return Promise.reject(error);
  },
);

api.interceptors.response.use(null, async (error) => {
  const status = error.response?.status;

  if (status === 400) {
    await useAuthStore.refreshToken();
    const newToken = useAuthStore.token.access;
    if (newToken) {
      error.config.headers.Authorization = newToken;
      axios(error.config);
      return;
    } else {
      await useAuthStore.signOut();
      console.error(`router.push({ name: 'sign-in' });`);
      return error;
    }
  }

  if (status === 401) {
    await useAuthStore.signOut();
    console.error(`
    router.push({ name: 'sign-in' });`);
    return Promise.reject(error);
  }
  if (error.code === 'ERR_NETWORK') {
    localStorage.clear();
    console.error(`router.push({ name: 'sign-in' });`);
  }
});

export default api;
