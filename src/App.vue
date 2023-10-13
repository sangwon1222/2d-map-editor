<script lang="ts" setup scoped>
import { useLayoutStore } from '@store/layout';
import tLoading from '@template/tLoading.vue';
import tChatLayout from '@template/tChatLayout.vue';
import tGnb from '@template/layout/tGnb.vue';
import { RouterView } from 'vue-router';

document.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  },
  { passive: false },
);

document.body.addEventListener(
  'touchstart',
  function (e) {
    if (e.touches.length > 1 || e.targetTouches.length > 1) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  },
  { passive: false },
);
</script>

<template>
  <div class="relative flex min-h-screen min-w-full flex-wrap justify-center bg-gray-900">
    <t-loading />
    <t-chat-layout />
    <t-gnb v-if="useLayoutStore.gnbMode" />
    <RouterView />
  </div>
</template>
