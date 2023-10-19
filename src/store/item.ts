import { reactive } from 'vue';

export const useItemStore: TypeItemStore = reactive({
  itemJson: {
    id: 1,
    name: 'floor-1,png',
    zIndex: 0,
  },
});
