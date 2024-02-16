import { useLayoutStore } from '@/store/layout';
import { useAuthStore } from '@/store/auth';
import { toast } from 'vue3-toastify';
import { setDecode } from '@/util';
import axiosApi from './index';

class AuthApi {
  signIn = async ({ l }: { l: string }) => {
    try {
      const { data } = await axiosApi.post('auth/login', { l: l });
      localStorage.clear();
      if (data.ok) {
        const decode = JSON.parse(setDecode(data.data, 'login-info'));
        useAuthStore.userID = decode.userID;
        useAuthStore.accessToken = decode.accessToken;
        useAuthStore.refreshToken = decode.refreshToken;
        useAuthStore.currentGroupIndex = decode.currentGroupIndex;
        useAuthStore.turnInGroup = decode.turnInGroup;
        useAuthStore.prizeTurn = decode.prizeTurn;
        useAuthStore.gameName = decode.gameTable;
        useAuthStore.signedIn = true;
        localStorage.setItem('k', data.data);
      } else {
        useAuthStore.userID = '';
        useAuthStore.accessToken = '';
        useAuthStore.refreshToken = '';
        useAuthStore.currentGroupIndex = 0;
        useAuthStore.turnInGroup = 0;
        useAuthStore.prizeTurn = 0;
        useAuthStore.signedIn = false;
        return { ok: false, msg: data.msg };
      }
      return data;
    } catch (e) {
      console.error('sign-in ERROR', e);
      useAuthStore.userID = '';
      useAuthStore.accessToken = '';
      useAuthStore.refreshToken = '';
      useAuthStore.signedIn = false;
      useAuthStore.currentGroupIndex = 0;
      useAuthStore.turnInGroup = 0;
      useAuthStore.prizeTurn = 0;
      localStorage.clear();
      return { ok: false, msg: e.message ? e.message : '' };
    }
  };

  signUp = async ({ l }: { l: string }) => {
    try {
      const { data } = await axiosApi.post('auth/signUp', { l });
      if (!data.ok && data.msg) toast.error(data.msg);
      return data;
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    } finally {
      useLayoutStore.isLoading = false;
    }
  };

  getGameTable = async () => {
    try {
      const id = useAuthStore.userID;
      const { data } = await axiosApi.post('auth/get-user-game-table', { userID: id });
      return data;
    } catch (e) {
      console.error('get-user-game-table ERROR', e);
      return { ok: false, msg: e.message ? e.message : '' };
    }
  };

  updateUserReel = async () => {
    try {
      const { userID, turnInGroup, prizeTurn, currentGroupIndex } = useAuthStore;
      const { data } = await axiosApi.post('auth/update-user-reel', {
        userID,
        turnInGroup,
        prizeTurn,
        currentGroupIndex,
      });
      return data;
    } catch (e) {
      console.error('update-user-reel ERROR', e);
      return { ok: false, msg: e.message ? e.message : '' };
    }
  };
}

export default new AuthApi();
