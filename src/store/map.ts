import { reactive } from 'vue';

export const useMapStore: TypeMapStore = reactive({
  mapJson: JSON.parse(localStorage.getItem('mapJson'))
    ? JSON.parse(localStorage.getItem('mapJson'))
    : Array.from({ length: 16 }, () =>
        Array.from({ length: 26 }, () => {
          return { idx: -1, textureName: 'floor-1.png' };
        }),
      ),
});
