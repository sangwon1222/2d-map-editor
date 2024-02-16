import * as PIXI from 'pixijs';
import { useMapStore } from '@/store/map';
import { rscManager } from '@/app/resource/resourceManager';
import gsap from 'gsap';

export default class MapLayout extends PIXI.Container {
  constructor() {
    super();
  }

  async init() {
    const displayData = useMapStore.mapDisplay;
    const ableData = useMapStore.mapData;
    for (let y = 0; y < displayData.length; y++) {
      for (let x = 0; x < displayData[y].length; x++) {
        const tileIndex = displayData[y][x];
        const tile = new PIXI.Sprite(rscManager.getHandle.getRsc(`${useMapStore.tileInfo[tileIndex]}`));
        tile.interactive = !ableData[y][x];
        tile.cursor = 'pointer';
        tile.position.set(x * 50, y * 50);
        this.addChild(tile);

        tile.on('pointerdown', (e) => {
          gsap.to(tile, { alpha: 0, duration: 0.25 }).repeat(3).yoyo(true);
          this.handlePointerDown(e, [x, y]);
        });
      }
    }
  }

  async handlePointerDown(e: PIXI.FederatedPointerEvent, pos: number[]): Promise<void> {
    // app/index.ts 에서 override
  }
}
