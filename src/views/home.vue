<script setup lang="ts" scoped>
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { setEncode } from '@/util';
import { ref } from 'vue';

const router = useRouter();
const refInput = ref(null);

const onSubmit = (_e: KeyboardEvent | MouseEvent) => {
  const ableEnter = refInput.value.value === 'lsw' || refInput.value.value === 'kth';
  if (ableEnter) {
    useAuthStore.userID = refInput.value.value;
    const u = setEncode(useAuthStore.userID, 'userid');
    localStorage.setItem('u', u);
    router.push('app');
  } else refInput.value.select();
};
</script>

<template>
  <div class="relative flex min-h-screen w-full max-w-[1280px] items-center justify-center">
    <div class="flex gap-10">
      <input ref="refInput" type="text" class="h-[32px]" @keydown.enter="onSubmit" />
      <button class="flex h-[32px] items-center rounded border bg-white p-2 text-black" @click="onSubmit">Enter</button>
    </div>
  </div>
</template>
