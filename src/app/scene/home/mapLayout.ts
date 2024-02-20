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
        const tile = new Tile(`${useMapStore.tileInfo[tileIndex]}`, !ableData[y][x], x, y);
        tile.position.set(x * 50, y * 50);
        await tile.init();
        this.addChild(tile);
      }
    }
  }

  async handlePointerDown(e: PIXI.FederatedPointerEvent, destinations: number[], tile: Tile): Promise<void> {
    // app/index.ts 에서 override
  }
}

export class Tile extends PIXI.Container {
  private mTileSprite: PIXI.Sprite;
  private mTileTexture: PIXI.Texture;
  private mTileAni: gsap.core.Timeline;
  private mPos: number[];
  constructor(textrueName: string, interactive: boolean, x: number, y: number) {
    super();
    this.mTileTexture = rscManager.getHandle.getRsc(textrueName);
    this.interactive = interactive;
    this.cursor = 'pointer';
    this.mPos = [x, y];
  }
  async init() {
    this.mTileSprite = new PIXI.Sprite();
    this.mTileSprite.texture = this.mTileTexture;
    this.addChild(this.mTileSprite);
    this.on('pointerdown', (e) => {
      this.blink();
      const parent = this.parent as MapLayout;
      parent.handlePointerDown(e, this.mPos, this);
    });
  }

  async blink() {
    await this.stopBlink();
    this.mTileAni = gsap.timeline();
    this.mTileAni.to(this.mTileSprite, { alpha: 0, duration: 0.25 }).repeat(5).yoyo(true);
  }
  async stopBlink() {
    if (this.mTileAni) {
      this.mTileAni.kill();
      this.mTileSprite.alpha = 1;
      this.mTileAni = null;
    }
  }
}
