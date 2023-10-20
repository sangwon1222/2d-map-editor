<script setup lang="ts" scoped>
import { useLayoutStore } from '@store/layout';
import { canvasInfo } from '@/util/config';
import { useSocketStore } from '@store/socket';
import { onMounted, ref } from 'vue';
import { resize } from '@/util';
import App from '@app/app';
import api from '@/api';
import MapEditor from '@/app/scene/mapEditor/mapEditor';
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

const saveMap = () => {
  const data = (App.getHandle.getScene as MapEditor).saveMapData();
  console.log(data);
  localStorage.setItem('tile-map', JSON.stringify(data));
};
</script>

<template>
  <div class="relative flex w-full items-center justify-center bg-black">
    <div class="fixed left-0 top-10 flex w-full justify-between">
      <div class="flex flex-col">
        <p>ctrl + mouse move (selected item): Item Placement</p>
        <p>alt + mouse down+ mouse move : Map Move</p>
        <p>mouse wheel : Map Scale</p>
      </div>

      <button class="rounded border-2 border-white px-20 py-10 duration-500 hover:bg-gray-700" @click="saveMap">
        저장
      </button>
    </div>
    <canvas id="pixi-canvas" class="relative z-10" />
  </div>
</template>
