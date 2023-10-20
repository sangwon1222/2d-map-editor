<script setup lang="ts" scoped>
import { useLayoutStore } from '@store/layout';
import { canvasInfo } from '@/util/config';
import { useSocketStore } from '@store/socket';
import { onMounted, ref } from 'vue';
import { resize } from '@/util';
import App from '@app/app';
import api from '@/api';
import { SocketIo } from '@/socket';

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
});

const sendUserId = async () => {
  const useId = 'id';
  const pw = 'pw';
  const nickname = 'nickname';
  const { data } = await api.post('auth/sign-up', { useId, pw, nickname });
  console.log(data);
};
</script>

<template>
  <div class="relative flex min-h-screen w-full max-w-1280 items-center justify-center bg-gray-800">
    <canvas id="pixi-canvas" class="relative z-10" />
    <!-- <canvas id="pixi-canvas" :class="useSocketStore.mySocketId ? 'relative z-10' : 'absolute -z-10 opacity-0'" />
    <div v-if="!useSocketStore.mySocketId">
      <div>닉네임을 작성하세요.</div>
      <div class="flex gap-10">
        <input ref="refUserIdInput" type="text" @keydown.enter="sendUserId" />
        <button
          class="use-before-tag flex h-30 w-30 items-center justify-center rounded-full bg-white before:border-l-teal-700"
          @click="sendUserId"
        />
      </div>
    </div> -->
  </div>
</template>
