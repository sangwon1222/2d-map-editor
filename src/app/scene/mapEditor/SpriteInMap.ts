import App from '@/app/app';
import { rscManager } from '@/app/resource/resourceManager';
import * as PIXI from 'pixijs';
import MapEditor from './mapEditor';

/**
 * itemStatus: 1 => 장애물
 * itemStatus: 2 => 통과물
 */

export default class SpriteInMap extends PIXI.Container {
  private mSprite: PIXI.Sprite;
  private mIsMovingInMap: boolean;
  private mIdx: number;
  private mTextureName: string;
  private mItemStatus: number;

  get itemStatus(): number {
    return this.mItemStatus;
  }
  get textureName(): string {
    return this.mTextureName;
  }
  get isMovingInMap(): boolean {
    return this.mIsMovingInMap;
  }
  set isMovingInMap(v: boolean) {
    this.mIsMovingInMap = v;
  }
  get idx(): number {
    return this.mIdx;
  }

  constructor(idx: number, textureName: string, itemStatus: number) {
    super();
    this.mTextureName = textureName;
    this.mIdx = idx;
    this.mIsMovingInMap = false;
    this.mSprite = new PIXI.Sprite(rscManager.getHandle.getRsc(textureName));
    this.mSprite.anchor.set(0.5);
    this.mSprite.zIndex = 2;

    this.sortableChildren = true;
    this.addChild(this.mSprite);

    this.interactive = true;
    this.cursor = 'pointer';
    this.on('pointerdown', (e) => {
      if (e.ctrlKey) return;
      e.preventDefault();
      e.stopPropagation();
      e.defaultPrevented = true;
      this.mIsMovingInMap = true;
      const matEditor = App.getHandle.getScene as MapEditor;
      matEditor.editSpritePos(this.mIdx, e.global.x, e.global.y);
    });
  }

  disable() {
    this.mIsMovingInMap = false;
    const matEditor = App.getHandle.getScene as MapEditor;
    matEditor.endMove();
  }
}
