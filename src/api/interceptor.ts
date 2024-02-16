import { useLayoutStore } from '@/store/layout';
import { useAuthStore } from '@store/auth';
import axios, { AxiosInstance } from 'axios';
import authApi from '@/api/auth';
import router from '@/router/index';
import { toast } from 'vue3-toastify';
import { setDecode } from '@/util';

export function setInterceptors(apiClient: AxiosInstance): AxiosInstance {
  apiClient.interceptors.request.use(
    (config) => {
      // 요청을 보내기 전에 수행할 일
      if (config.url !== 'login') {
        config.headers.Authorization = `Bearer ${useAuthStore.accessToken}`;
        config.headers.Refresh = useAuthStore.refreshToken;
      }
      if (config.url === 'login') {
        delete config.headers.Authorization;
        delete config.headers.Refresh;
      }
      // console.warn(config);
      return config;
    },
    function (error) {
      // 오류 요청을 보내기전 수행할 일
      // ...
      toast.error(error);
      useLayoutStore.isLoading = false;
      return Promise.reject(error);
    },
  );

  apiClient.interceptors.response.use(null, async (error) => {
    const status = error.response?.status;

    if (status === 400) {
      const newToken = useAuthStore.accessToken;
      if (newToken) {
        error.config.headers.Authorization = newToken;
        axios(error.config);
        return;
      } else {
        return error;
      }
    }

    if (status === 401 && error.response.data.err === 'refresh token expired') {
      localStorage.clear();
      useAuthStore.userID = '';
      useAuthStore.gameName = '';
      useAuthStore.currentGroupIndex = 0;
      useAuthStore.turnInGroup = 0;
      useAuthStore.prizeTurn = 0;
      useAuthStore.accessToken = '';
      useAuthStore.refreshToken = '';
      useAuthStore.signedIn = false;
      router.push({ name: 'SignIn' });
    }

    /* access token 만료 */
    if (status === 401 && error.response.data.err === 'access token expired') {
      useLayoutStore.isLoading = true;
      localStorage.clear();
      /** 원본요청 저장 */
      const originRequest = error.config;
      const instance = axios.create({
        baseURL: 'http://192.168.0.4:8000/api',
        headers: {
          Authorization: useAuthStore.accessToken,
          Refresh: useAuthStore.refreshToken,
        },
      });

      try {
        const { data } = await instance.post('auth/reissue-access-token');
        if (data.ok) {
          const decode = JSON.parse(setDecode(data.data, 'login-info'));
          useAuthStore.userID = decode.userID;
          useAuthStore.accessToken = decode.accessToken;
          useAuthStore.refreshToken = decode.refreshToken;
          useAuthStore.gameName = decode.gameTable;
          useAuthStore.turnInGroup = decode.turnInGroup;
          useAuthStore.prizeTurn = decode.prizeTurn;
          useAuthStore.currentGroupIndex = decode.currentGroupIndex;
          useAuthStore.signedIn = true;

          localStorage.setItem('k', data.data);
          return apiClient(originRequest);
        } else {
          useAuthStore.userID = '';
          useAuthStore.gameName = '';
          useAuthStore.currentGroupIndex = 0;
          useAuthStore.turnInGroup = 0;
          useAuthStore.prizeTurn = 0;
          useAuthStore.accessToken = '';
          useAuthStore.refreshToken = '';
          useAuthStore.signedIn = false;
          router.push({ name: 'SignIn' });
        }
      } catch (e) {
        useAuthStore.userID = '';
        useAuthStore.gameName = '';
        useAuthStore.currentGroupIndex = 0;
        useAuthStore.turnInGroup = 0;
        useAuthStore.prizeTurn = 0;
        useAuthStore.accessToken = '';
        useAuthStore.refreshToken = '';
        useAuthStore.signedIn = false;
        router.push({ name: 'SignIn' });
      } finally {
        useLayoutStore.isLoading = false;
      }
    }

    if (error.code === 'ERR_NETWORK') localStorage.clear();
  });

  return apiClient;
}
