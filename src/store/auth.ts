import { setEncode, setDecode } from '@/util';
import { reactive } from 'vue';
import api from '@/api/index';

interface userInfo {
  id: string;
  pw: string;
  name: string;
  teamId: string;
}

class AuthStore {
  private id = '';
  private name = '';
  private teamId = '';
  private teamName = '';
  private jwt = '';
  private account = '';
  needLogin = true;

  set isNeedLogin(flag: boolean) {
    this.needLogin = flag;
  }
  get isNeedLogin() {
    this.account = localStorage.getItem('account') ?? '';
    this.needLogin = !this.account;
    return this.needLogin;
  }

  get token() {
    this.account = localStorage.getItem('account') ?? '';
    const { account } = this;

    const encodedAccess = localStorage.getItem('accessToken') ?? '';
    const encodedRefresh = localStorage.getItem('refreshToken') ?? '';

    const access = setDecode(encodedAccess, `accessToken${account}`);
    const refresh = setDecode(encodedRefresh, `refreshToken${account}`);

    return { access, refresh };
  }

  get user() {
    this.account = localStorage.getItem('account') ?? '';
    const { account } = this;

    const encode = {
      userName: localStorage.getItem('userName') ?? '',
      teamId: localStorage.getItem('teamId') ?? '',
      teamName: localStorage.getItem('teamName') ?? '',
    };
    this.id = localStorage.getItem('id');
    this.name = setDecode(encode.userName, `userName${account}`);
    this.teamId = setDecode(encode.teamId, `teamId${account}`);
    this.teamName = setDecode(encode.teamName, `teamName${account}`);

    return {
      id: this.id,
      name: this.name,
      account: this.account,
      team: { id: this.teamId, name: this.teamName },
    };
  }
  get isLogined() {
    return this.jwt.length > 0;
  }

  /**
   * @param id user id
   * @param pw user password
   * @returns-  {ok:boolean, error: string}
   */
  async signIn({ id, pw }: { id: string; pw: string }) {
    const apiName = 'auth/get-user';
    const { data } = await api.post(apiName, { id });
    if (!data.ok) {
      return { ok: false, error: '없는 계정입니다.' };
    }

    try {
      const apiName = 'auth/sign-in';
      const { data } = await api.post(apiName, { id, pw });

      if (data.ok) {
        console.log(data);
        return { ok: true, error: '' };
      } else {
        this.needLogin = false;
        return { ok: false, error: '토큰 발급 실패' };
      }
    } catch (e) {
      console.error(e);
      this.needLogin = true;
      ({ ok: false, error: e });
    }
  }

  async verifyToken() {
    try {
      const { id } = this;
      const { data } = await api.post('auth/sign-in/accessTokenCheck', {
        id,
      });
      if (data.ok) {
        return true;
      } else {
        console.error(data.result);
        return false;
      }
      return { data };
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async refreshToken() {
    try {
      const { data } = await api.post('/auth/refreshToken');
      if (data.ok) {
        const access = data.result.accessToken;
        const refresh = data.result.refreshToken;
        api.defaults.headers.Authorization = `Bearer ${access}`;
        localStorage.setItem('accessToken', setEncode(access, `accessToken${useAuthStore.user.account}`));
        localStorage.setItem('refreshToken', setEncode(refresh, `refreshToken${useAuthStore.user.account}`));
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async signUp({ id, pw, name, teamId }: userInfo) {
    const { data } = await api.post('auth/sign-up', { id, pw, name, teamId });
    return data;
  }

  async signOut() {
    try {
      const { data } = await api.post('auth/sign-out', { id: this.id });
      return data;
    } catch (e) {
      console.error(e);
      return { ok: false };
    } finally {
      localStorage.clear();
      this.id = '';
      this.jwt = '';
    }
  }

  async deleteUser() {
    const { id } = this;
    try {
      const { data } = await api.post('auth/delete-user', { id });
      return data;
    } catch (e) {
      return { ok: false };
    } finally {
      this.jwt = '';
    }
  }

  async checkId({ id }: { id: string }) {
    const apiName = 'auth/get-user';
    const { data } = await api.post(apiName, { id });
    const ok = data.result.length === 0;
    return { ok, result: data.result };
  }
}

export const useAuthStore = reactive(new AuthStore());
