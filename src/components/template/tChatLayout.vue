<script lang="ts" setup scoped>
import { useSocketStore } from '@/store/socket';
import { reactive, ref, watch } from 'vue';
import { getTime } from '@/util';

const refInput = ref(null);
const refSpeeckList = ref(null);

const state = reactive({
  openChatWindow: false,
});

watch(useSocketStore.chatting, (_new, _old) => {
  setTimeout(() => {
    const div = refSpeeckList.value as HTMLDivElement;
    div.scrollTo({ top: div.scrollHeight });
  }, 500);
});

const toggleChatWindow = () => {
  state.openChatWindow = !state.openChatWindow;
  if (state.openChatWindow) refInput.value.focus();
};

const closeChat = () => {
  const div = refSpeeckList.value as HTMLDivElement;
  div.scrollTo({ top: div.scrollHeight });
  state.openChatWindow = false;
};

const openChat = () => {
  state.openChatWindow = true;
  refInput.value.focus();
};

const registChat = () => {
  const input = refInput.value as HTMLInputElement;
  const value = input.value;
  if (!value) return;
  useSocketStore.socket.emit('add-chat', { nickname: useSocketStore.myNickName, chat: value, time: getTime() });
  input.value = '';
};
</script>

<template>
  <div
    v-if="useSocketStore.mySocketId"
    v-click-outside="closeChat"
    class="chat-wrap"
    :class="state.openChatWindow ? 'pointer-events-auto' : 'pointer-events-none'"
  >
    <div class="user-list" @click="toggleChatWindow">
      <p v-for="(v, i) in useSocketStore.socketUserList" :key="i" :class="`bg-gray-${i % 2 ? '100' : '200'}`">
        {{ v === useSocketStore.myNickName ? '✔   ' : '' }} {{ v }}
      </p>
    </div>

    <button
      v-if="!state.openChatWindow"
      class="pointer-events-auto absolute bottom-10 right-10 h-40 w-40 rounded-full bg-gray-100/40"
      @click="openChat"
    >
      📝
    </button>

    <div
      class="chat"
      :class="state.openChatWindow ? 'h-600 max-w-600 bg-gray-100/60' : 'h-400 max-w-300 bg-gray-100/0'"
      @click.self="toggleChatWindow"
    >
      <button v-if="state.openChatWindow" class="close-chat" @click.self="closeChat" />

      <div
        ref="refSpeeckList"
        :class="state.openChatWindow ? 'h-500 overflow-y-auto opacity-100' : 'h-300 overflow-hidden opacity-30'"
      >
        <ul v-for="({ chat, time, nickname }, i) in useSocketStore.chatting" :key="i" class="flex flex-col px-10">
          <li
            :class="nickname === useSocketStore.myNickName ? 'self-end ' : 'self-start '"
            class="flex gap-6 rounded-6 bg-gray-100/30 px-10 text-gray-200"
          >
            <p :class="nickname === useSocketStore.myNickName ? 'text-teal-100 ' : 'text-red-100 '">[</p>
            {{ nickname }}
            <p :class="nickname === useSocketStore.myNickName ? 'text-teal-100 ' : 'text-red-100 '">]</p>
          </li>

          <li
            :class="nickname === useSocketStore.myNickName ? ' self-end bg-teal-200' : 'self-start bg-red-200'"
            class="my-6 w-fit rounded-10 bg-gray-100/10 px-6"
          >
            <p class="text-black">{{ chat }}</p>
            <p
              v-if="state.openChatWindow"
              class="text-2xs"
              :class="nickname === useSocketStore.myNickName ? ' self-end' : 'self-start'"
            >
              {{ time }}
            </p>
          </li>
        </ul>
      </div>
      <div
        class="input-wrap"
        :class="state.openChatWindow ? 'pointer-events-auto opacity-80' : 'pointer-events-none opacity-0'"
      >
        <input
          ref="refInput"
          type="text"
          class="h-40 flex-1 rounded-xl bg-white px-10"
          :class="state.openChatWindow ? 'pointer-events-auto' : 'pointer-events-none'"
          @keydown.enter="registChat"
        />
        <button
          v-if="state.openChatWindow"
          class="send-msg-btn use-before-tag"
          @click.self="state.openChatWindow ? registChat() : null"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.chat-wrap {
  @apply fixed bottom-20 right-10 z-90 h-600 w-600;

  button {
    @apply pointer-events-auto;
  }
  .user-list {
    @apply pointer-events-auto fixed right-0 top-0 max-h-100 w-200 cursor-pointer overflow-y-auto opacity-20 hover:opacity-100;
  }

  .chat {
    @apply fixed bottom-20 right-20 flex  w-full flex-col rounded-xl pt-20 duration-100;

    .close-chat {
      @apply absolute right-20 top-6 block h-10 w-10 border-10 border-transparent border-t-teal-800 content-[''];
    }

    .input-wrap {
      @apply fixed bottom-20 right-20 flex h-60 w-600 flex-wrap items-center gap-10 px-8;
      .send-msg-btn {
        @apply h-30 w-30 rounded-full bg-teal-400;
        @apply before:translate-x-2/3 before:border-l-gray-600;
      }
    }
  }
}
</style>
