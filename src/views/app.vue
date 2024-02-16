<script setup lang="ts" scoped>
import { useLayoutStore } from '@store/layout';
import { useMapStore } from '@store/map';
import { canvasInfo } from '@/util/config';
import { onMounted } from 'vue';
import { resize } from '@/util';
import App from '@app/app';
import MapApi from '@/api/map';
import { toast } from 'vue3-toastify';

onMounted(async () => {
  useLayoutStore.isLoading = true;
  const { ok, data } = await MapApi.getMap();
  if (ok) {
    useMapStore.mapData = data.able;
    useMapStore.mapDisplay = data.display;
  } else {
    toast.error('map data 없음');
  }

  const canvasElement = document.getElementById('pixi-canvas') as HTMLCanvasElement;
  const { backgroundColor, width, height } = canvasInfo;
  window['app'] = new App({ backgroundColor, width, height, view: canvasElement });
  await window['app'].init();
  resize(canvasElement);

  window.addEventListener('resize', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    resize(canvasElement);
  });
  useLayoutStore.isLoading = false;
});
</script>

<template>
  <div class="relative flex min-h-screen w-full max-w-[1280px] items-center justify-center">
    <canvas id="pixi-canvas" class="fixed z-10" />
  </div>
</template>
