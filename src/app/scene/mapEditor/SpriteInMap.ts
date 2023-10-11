import App from '@/app/app';
import { rscManager } from '@/app/resource/resourceManager';
import * as PIXI from 'pixijs';
import MapEditor from './mapEditor';
import MapContainer from './mapContainer';
import { canvasInfo } from '@/util/config';

export default class SpriteInMap extends PIXI.Container {
  private mSprite: PIXI.Sprite;
  private mIsMovingInMap: boolean;
  private mIdx: number;
  private mMyPos: { x: number; y: number };

  get isMovingInMap(): boolean {
    return this.mIsMovingInMap;
  }
  get idx(): number {
    return this.mIdx;
  }
  get mypos(): { x: number; y: number } {
    return this.mMyPos;
  }
  constructor(idx: number, textureName: string, x: number, y: number) {
    super();
    this.mIdx = idx;
    this.mIsMovingInMap = false;
    this.mMyPos = { x, y };
    this.mSprite = new PIXI.Sprite(rscManager.getHandle.getRsc(textureName));
    this.mSprite.anchor.set(0.5);
    this.mSprite.position.set(this.mSprite.width / 2, this.mSprite.height / 2);
    this.mSprite.zIndex = 2;

    this.sortableChildren = true;
    this.addChild(this.mSprite);

    this.interactive = true;
    this.cursor = 'pointer';
    this.on('pointerdown', (e) => {
      e.preventDefault();
      e.defaultPrevented = true;
      e.stopPropagation();
      this.mIsMovingInMap = true;
      this.hitArea = new PIXI.Rectangle(0, 0, canvasInfo.width, canvasInfo.height);
      const matEditor = App.getHandle.getScene as MapEditor;
      matEditor.addChild(this);
    });

    this.on('pointermove', (e) => {
      e.preventDefault();
      e.defaultPrevented = true;
      e.stopPropagation();

      if (this.mIsMovingInMap) {
        const mapEditor = this.parent as MapEditor;
        mapEditor.moveSprite(e, this.mIdx);
      }
    });

    this.on('pointerdown', (e) => {
      e.preventDefault();
      e.defaultPrevented = true;
      e.stopPropagation();
      this.mIsMovingInMap = true;
      // this.hitArea = new PIXI.Rectangle(0, 0, canvasInfo.width, canvasInfo.height);
      const matEditor = App.getHandle.getScene as MapEditor;
      matEditor.addChild(this);
      matEditor.editSpriteIdx = this.mIdx;
    });

    const cancelMoveEvtList = ['up', 'cancel', 'out', 'leave'];
    for (let i = 0; i < cancelMoveEvtList.length; i++) {
      const eventName = `pointer${cancelMoveEvtList[i]}` as any;
      this.on(eventName, (e: PIXI.FederatedPointerEvent) => {
        e.preventDefault();
        e.defaultPrevented = true;
        e.stopPropagation();
        this.mIsMovingInMap = false;
        this.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
      });
    }
  }

  disable() {
    // const mapContainer = this.parent as MapContainer;
    // mapContainer.moveSprite(this.mIdx);
  }
}
