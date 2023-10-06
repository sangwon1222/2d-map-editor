<script setup lang="ts" scoped>
import { useLayoutStore } from '@store/layout';
import { canvasInfo } from '@/util/config';
import { useChatStore } from '@store/chat';
import { onMounted, ref } from 'vue';
import { resize } from '@/util';
import App from '@app/app';
import { SocketIo } from '@/socket';
import { map } from 'lodash-es';

const refUserIdInput = ref(null);
onMounted(async () => {
  useLayoutStore.isLoading = true;
  const canvasElement = document.getElementById('pixi-canvas') as HTMLCanvasElement;
  const { backgroundColor, width, height } = canvasInfo;
  window['app'] = new App({ backgroundColor, width, height, view: canvasElement });
  await window['app'].init();
  resize(canvasElement);

  window.addEventListener('resize', () => resize(canvasElement));
  const input = refUserIdInput.value as HTMLInputElement;
  input?.focus();

  useLayoutStore.isLoading = false;

  if (localStorage.getItem('nickname')) {
    useChatStore.socket = new SocketIo();
    await useChatStore.socket.init();
    useChatStore.socket.emit('income', { nickname: localStorage.getItem('nickname') });
  }
});

const sendUserId = async () => {
  const input = refUserIdInput.value as HTMLInputElement;
  if (!input?.value) return;

  if (!useChatStore.socket) {
    useChatStore.socket = new SocketIo();
    await useChatStore.socket.init();
  }

  useChatStore.socket.emit('income', { nickname: input.value });

  setTimeout(() => {
    if (useLayoutStore.isLoading) useLayoutStore.isLoading = false;
    if (!useChatStore.mySocketId) input.value = '';
  }, 1000);
};
</script>

<template>
  <div class="relative flex min-h-screen w-full max-w-1280 items-center justify-center bg-gray-800">
    <canvas id="pixi-canvas" :class="useChatStore.mySocketId ? 'relative z-10' : 'absolute -z-10 opacity-0'" />
    <div v-if="!useChatStore.mySocketId">
      <div>닉네임을 작성하세요.</div>
      <div class="flex gap-10">
        <input ref="refUserIdInput" type="text" @keydown.enter="sendUserId" />
        <button
          class="use-before-tag flex h-30 w-30 items-center justify-center rounded-full bg-white before:border-l-teal-700"
          @click="sendUserId"
        />
      </div>
    </div>
  </div>
</template>
