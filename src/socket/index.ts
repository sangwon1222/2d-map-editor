import { Socket, io } from 'socket.io-client';
import { useChatStore } from '@store/chat';
import { useLayoutStore } from '@store/layout';
import { map } from 'lodash-es';
import { toast } from 'vue3-toastify';

export class SocketIo {
  private socket: Socket;

  constructor() {
    const isProduct = process.env.NODE_ENV === 'production';

    this.socket = io(isProduct ? 'http://lsw.kr' : 'localhost:3000', {
      withCredentials: isProduct,
      extraHeaders: { 'my-custom-header': 'abcd' },
    });
  }

  async init() {
    this.socket.on('connect', () => {
      useLayoutStore.isLoading = true;
    });

    this.socket.on('update-user-list', ({ socketUserList, nickname }) => {
      useChatStore.socketUserList = map(socketUserList, (e) => e.nickname);
      console.log(socketUserList);
      console.log(nickname, '입장');
    });

    this.socket.on('regist-user-id', ({ ok, socketUserList, socketId, nickname }) => {
      if (ok) {
        useChatStore.mySocketId = socketId;
        useChatStore.socketUserList = map(socketUserList, (e) => e.nickname);
        useChatStore.myNickName = nickname;
        window['app']?.startInit();
        localStorage.setItem('nickname', nickname);
        console.log(socketUserList);
      } else {
        toast.error('중복된 닉네임이 있습니다.', { autoClose: 100 });
        useChatStore.mySocketId = '';
        useChatStore.socketUserList = [];
        useChatStore.myNickName = '';
      }
      useLayoutStore.isLoading = false;
    });

    this.socket.on('get-user-list', ({ socketUserList }) => {
      useChatStore.socketUserList = map(socketUserList, (e) => e.nickname);
      useLayoutStore.isLoading = false;
      console.log(useChatStore.socketUserList);
    });

    this.socket.on('add-chat', ({ nickname, chat, time }) => {
      console.log('add-chat', { nickname, chat, time });
      useChatStore.chatting.push({ nickname, chat, time });
    });

    this.socket.on('leave-user', ({ nickname, socketUserList }) => {
      useChatStore.socketUserList = map(socketUserList, (e) => e.nickname);

      console.log(`${nickname} 나갔다.`);
    });
  }

  async close() {
    this.socket.close();
    this.socket.disconnect();
  }

  emit(eventName: string, args?: any) {
    this.socket.emit(eventName, { ...args });
  }
}
