import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src/') },
      { find: '@views', replacement: resolve(__dirname, 'src/views') },
      { find: '@store', replacement: resolve(__dirname, 'src/store') },
      {
        find: '@components',
        replacement: resolve(__dirname, 'src/components'),
      },
      { find: '@template', replacement: resolve(__dirname, 'src/components/template') },
      { find: '@atoms', replacement: resolve(__dirname, 'src/components/atoms') },
      { find: '@app', replacement: resolve(__dirname, 'src/app') },
    ],
  },
  plugins: [vue(), viteTsConfigPaths()],
});
