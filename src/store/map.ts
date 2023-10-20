import { reactive } from 'vue';

export const useMapStore: TypeMapStore = reactive({
  mapJson: JSON.parse(localStorage.getItem('tile-map'))
    ? JSON.parse(localStorage.getItem('tile-map'))
    : [[], [], [], [], [], [], [], [], [], [], [], [], [], []],
});
