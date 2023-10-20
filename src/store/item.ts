import { reactive } from 'vue';

export const useItemStore: TypeItemStore = reactive({
  itemData: [
    {
      id: 0,
      name: 'cube-plant-1.png',
      zIndex: 0,
      floor: {
        default: 1,
        max: 3,
        min: 1,
      },
    },
    {
      id: 1,
      name: 'cube-lava-1.png',
      zIndex: 0,
      floor: {
        default: 1,
        max: 3,
        min: 1,
      },
    },
    {
      id: 2,
      name: 'cube-fire-1.png',
      zIndex: 0,
      floor: {
        default: 1,
        max: 3,
        min: 1,
      },
    },
    {
      id: 3,
      name: 'cube-water-1.png',
      zIndex: 0,
      floor: {
        default: 1,
        max: 3,
        min: 1,
      },
    },
    {
      id: 4,
      name: 'cube-wood-1.png',
      zIndex: 0,
      floor: {
        default: 1,
        max: 3,
        min: 1,
      },
    },
    {
      id: 5,
      name: 'cube-ice-1.png',
      zIndex: 0,
      floor: {
        default: 1,
        max: 3,
        min: 1,
      },
    },
    {
      id: 6,
      name: 'cube-stone-1.png',
      zIndex: 0,
      floor: {
        default: 1,
        max: 3,
        min: 1,
      },
    },
  ],
});
