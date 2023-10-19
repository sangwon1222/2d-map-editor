import { reactive } from 'vue';

export const useMapStore: TypeMapStore = reactive({
  mapJson: JSON.parse(localStorage.getItem('mapJson'))
    ? JSON.parse(localStorage.getItem('mapJson'))
    : Array.from({ length: 14 }, () =>
        Array.from({ length: 14 }, () => {
          return { idx: -1, itemId: 1 };
        }),
      ),
});
