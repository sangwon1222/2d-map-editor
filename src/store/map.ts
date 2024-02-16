import { reactive, readonly } from 'vue';

export const useMapStore: any = reactive({
  mapDisplay: [[]],
  mapData: [[]],
  tileInfo: readonly({
    0: 'tile.png',
    1: 'tile-1.png',
    2: 'tile-2.png',
    3: 'tile-3.png',
    4: 'tile-4.png',
    5: 'water.png',
  }),
});
