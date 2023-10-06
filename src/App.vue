<script lang="ts" setup scoped>
import { useLayoutStore } from '@store/layout';
import tLoading from '@template/tLoading.vue';
import tChatLayout from '@template/tChatLayout.vue';
import tGnb from '@template/layout/tGnb.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="relative flex min-h-screen min-w-full flex-wrap justify-center bg-gray-900">
    <t-loading />
    <t-chat-layout />
    <t-gnb v-if="useLayoutStore.gnbMode" />
    <RouterView />
  </div>
</template>
