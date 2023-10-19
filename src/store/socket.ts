import { reactive } from 'vue';

export const useSocketStore: TypeChatStore = reactive({
  socket: null,
  socketUserList: [],
  mySocketId: '',
  myNickName: '',
  chatting: [],
});
