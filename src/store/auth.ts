import { reactive } from 'vue';

export const useAuthStore: any = reactive({
  userID: '',
  accessToken: '',
  refreshToken: '',
  signedIn: false,
});
