<script setup lang="ts" scoped>
import { useLayoutStore } from '@store/layout';
import { canvasInfo } from '@/util/config';
import { onMounted, ref } from 'vue';
import { resize } from '@/util';
import App from '@app/app';

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
</script>

<template>
  <div class="relative flex min-h-screen w-full max-w-1280 items-center justify-center bg-gray-800">
    <canvas id="pixi-canvas" class="relative z-10" />
  </div>
</template>
