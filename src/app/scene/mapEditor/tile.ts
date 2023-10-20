import * as PIXI from 'pixijs';
import { getOneTilePoints } from '@/util/editorFc';
import { find } from 'lodash-es';
import { useItemStore } from '@/store/item';
import { rscManager } from '@/app/resource/resourceManager';
import MapLayer from './mapLayer';
import App from '@/app/app';
import MapEditor from './mapEditor';
import gsap from 'gsap';
import { useMapStore } from '@/store/map';

/**
 * @description x,y => 2차배열의 x,y 좌표
 */
export default class Tile extends PIXI.Container {
  private mPos: [x: number, y: number];
  private mTileGraphic: PIXI.Graphics;
  private mLineGraphic: PIXI.Graphics;
  private mItemId: number;
  private mItemSprite: PIXI.Sprite;

  get saveInfo(): { itemId: number; z: number; x: number; y: number } {
    const z = this.mItemSprite.y / 10;
    const [x, y] = this.mPos;
    return { itemId: this.mItemId, z, x, y };
  }
  constructor(x: number, y: number) {
    super();
    this.mItemId = -1;
    this.mPos = [x, y];
  }

  async drawTile() {
    this.removeChildren();
    const [x, y] = this.mPos;

    this.mTileGraphic = new PIXI.Graphics();
    this.mTileGraphic.beginFill(0xffffff, 1);
    this.mTileGraphic.drawPolygon(getOneTilePoints());
    this.mTileGraphic.endFill();
    this.mTileGraphic.alpha = 0;

    this.mLineGraphic = new PIXI.Graphics();
    this.mLineGraphic.lineStyle(6, 0xfff000, 1);
    this.mLineGraphic.drawPolygon(getOneTilePoints());
    this.mLineGraphic.endFill();
    this.mLineGraphic.alpha = 0;

    this.mItemSprite = new PIXI.Sprite();
    if (useMapStore.mapJson[y][x]) {
      this.mItemId = useMapStore.mapJson[y][x].itemId;
      this.setItem(useItemStore.itemData.z * 10);
    }

    this.addChild(this.mTileGraphic, this.mLineGraphic, this.mItemSprite);

    this.interactive = true;
    this.cursor = 'pointer';
    this.on('pointerenter', (e: PIXI.FederatedPointerEvent) => {
      if (e.altKey) return;
      e.preventDefault();
      e.stopPropagation();
      e.defaultPrevented = true;

      this.mTileGraphic.alpha = 1;
      if (this.mItemId) this.mItemSprite.tint = 0xbcbcbc;
    });

    this.on('pointerout', (e: PIXI.FederatedPointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.defaultPrevented = true;

      this.mTileGraphic.alpha = 0;
      this.mLineGraphic.alpha = 0;
      if (this.mItemId) this.mItemSprite.tint = 0xffffff;
    });

    this.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
      if (e.altKey) return;
      // 우클릭
      if (e.pointerType === 'mouse' && e.button == 2) {
        this.reset();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      e.defaultPrevented = true;

      const mapLayer = (App.getHandle.getScene as MapEditor).mapLayer;

      if (this.mItemId > -1) this.setZpos();

      if (mapLayer.selectedItemId > -1 && this.mItemId === -1) {
        this.mItemId = mapLayer.selectedItemId;
        mapLayer.resetTileStatus();
        this.setItem();
      }
      this.mTileGraphic.alpha = 0;
      this.mLineGraphic.alpha = 1;
    });

    this.on('pointermove', (e: PIXI.FederatedPointerEvent) => {
      if (e.altKey) return;
      e.preventDefault();
      e.stopPropagation();
      e.defaultPrevented = true;

      const mapLayer = (App.getHandle.getScene as MapEditor).mapLayer;
      if (!e.ctrlKey || mapLayer.selectedItemId === -1 || this.mItemId === mapLayer.selectedItemId) return;

      this.mItemId = mapLayer.selectedItemId;
      this.setItem();
    });
    this.sortableChildren = true;

    this.mItemSprite.zIndex = 3;
    this.mLineGraphic.zIndex = 2;
    this.mTileGraphic.zIndex = 1;
  }

  private setZpos() {
    const option = find(useItemStore.itemData, (e) => e.id === this.mItemId);

    if (!option) return;
    const z = this.mItemSprite.y / 10;
    const nextStep = (z + 1) % option.floor.max;
    gsap.to(this.mItemSprite, {
      y: nextStep * 10,
      duration: 0.1,
      onComplete: () => (this.mItemSprite.y = nextStep * 10),
    });
  }

  focus(itemId: number) {
    if (this.mItemId === itemId) return;

    this.mItemId = itemId;
    this.mTileGraphic.alpha = 1;
    this.mLineGraphic.alpha = 1;
  }

  blur() {
    this.mTileGraphic.alpha = 0;
    this.mLineGraphic.alpha = 0;
  }

  setItem(y?: number) {
    const option = find(useItemStore.itemData, (e) => e.id === this.mItemId);
    if (!option) return;
    this.mItemSprite.texture = option ? rscManager.getHandle.getRsc(option.name) : null;
    this.mItemSprite.anchor.set(0.5);
    gsap.to(this.mItemSprite, {
      y: y ? y : option.floor.default * 10,
      duration: 0.1,
      onComplete: () => (this.mItemSprite.y = option.floor.default * 10),
    });
  }

  reset() {
    this.mItemId = -1;
    this.mItemSprite.texture = null;
    this.mTileGraphic.alpha = 1;
    this.mLineGraphic.alpha = 0;
  }
}
