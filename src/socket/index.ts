import { useSocketStore } from '@/store/socket';
import { Socket, io } from 'socket.io-client';
import { useAuthStore } from '@/store/auth';
import { filter, map } from 'lodash-es';
import App from '@/app/app';
import Home from '@/app/scene/home';

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
      console.log('connect-socket');
    });

    const home = App.getHandle.getScene as Home;
    this.socket.emit('income', { nickname: useAuthStore.userID, path: [1, 1] });

    this.socket.on('insert-user', ({ users }) => {
      console.log('insert-user', users);
      home.insertUser(users);
    });

    this.socket.on('update-user-pos', ({ users }) => {
      console.log('update-user-pos', { users });
      home.updateUserPos(users);
    });

    this.socket.on('user-move', ({ nickname, path, prev }) => {
      const hone = App.getHandle.getScene as Home;
      hone.move(nickname, path, prev);
    });

    this.socket.on('leave-user', ({ nickname, socketUserList }) => {
      const hone = App.getHandle.getScene as Home;
      hone.leaveUser(nickname);
      useSocketStore.socketUserList = map(socketUserList, (e) => e.nickname);
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
