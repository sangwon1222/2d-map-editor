import { reactive } from 'vue';

export const useChatStore: TypeChatStore = reactive({
  socket: null,
  socketUserList: [],
  mySocketId: '',
  myNickName: '',
  chatting: [],
});
