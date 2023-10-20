import { canvasInfo } from '@/util/config';
import MapLayer from './mapLayer';
import Scene from '@app/scene/scene';
import EditTool from './editTool';
import * as PIXI from 'pixijs';
import { map } from 'lodash-es';
import { useMapStore } from '@/store/map';
import GridLayer from './gridLayer';
import gsap from 'gsap';

const mapLayerPos = [canvasInfo.width / 2, canvasInfo.height / 2];
/**
 * @params {number} - scene id
 * @params {string} - scene name
 */
export default class MapEditor extends Scene {
  private mMapLayer: MapLayer;
  private mGridLayer: GridLayer;
  private mIsMovingMap: Boolean;
  private mMapPos: number[];
  private mEditTool: EditTool;

  get mapLayer(): MapLayer {
    return this.mMapLayer;
  }
  get gridLayer(): GridLayer {
    return this.mGridLayer;
  }
  get editTool(): EditTool {
    return this.mEditTool;
  }

  constructor(sceneId: number, name: string) {
    super(sceneId, name);
    this.interactive = true;
    this.hitArea = new PIXI.Rectangle(0, 0, canvasInfo.width, canvasInfo.height);
    this.mIsMovingMap = false;
    this.mMapPos = [0, 0];
  }

  async init() {
    await this.drawLayer();
    this.sortableChildren = true;

    this.interactive = true;
    this.cursor = 'grab';

    this.onwheel = (e) => {
      const { x } = this.mMapLayer.scale;
      const wheelUp = e.deltaY < 0 && x > 0.6;
      const wheelDown = e.deltaY > 0 && x < 2;
      this.setMapScale(wheelUp, wheelDown);
    };

    /**@description Scene.ts 함수 */
    this.usePointerEvent();

    /**@description Scene.ts 함수 */
    this.onPointerDown = (e: PIXI.FederatedPointerEvent) => {
      const { x, y } = { x: Math.floor(e.global.x), y: Math.floor(e.global.y) };
      this.mMapPos = [x, y];

      this.mIsMovingMap = e.altKey;
    };

    /**@description Scene.ts 함수 */
    this.onPointerMove = (e: PIXI.FederatedPointerEvent) => {
      if (this.mIsMovingMap && e.altKey) return this.moveMap(Math.floor(e.global.x), Math.floor(e.global.y));
      // if (editingSprite?.isMovingInMap) return this.moveSprite(Math.floor(e.global.x), Math.floor(e.global.y));
    };

    /**@description Scene.ts 함수 */
    this.disablePointerEvt = (_e: PIXI.FederatedPointerEvent) => {
      const { x, y } = this.mMapLayer.position;
      this.mGridLayer.position.set(x, y);
      this.mIsMovingMap = false;
      this.cursor = 'pointer';
    };
  }

  private async drawLayer() {
    this.mGridLayer = new GridLayer();
    await this.mGridLayer.drawIsometric();
    this.mGridLayer.pivot.set(this.mGridLayer.width / 2, this.mGridLayer.height / 2);
    this.mGridLayer.position.set(mapLayerPos[0], mapLayerPos[1]);
    this.mGridLayer.zIndex = 0;

    this.mMapLayer = new MapLayer(mapLayerPos[0], mapLayerPos[1]);
    await this.mMapLayer.init();
    this.mMapLayer.zIndex = 1;
    this.mMapLayer.position.set(mapLayerPos[0], mapLayerPos[1]);

    this.mEditTool = new EditTool();
    await this.mEditTool.init();
    this.mEditTool.zIndex = 2;

    this.addChild(this.mGridLayer, this.mMapLayer, this.mEditTool);
  }

  async setMapScale(wheelUp: boolean, wheelDown: boolean) {
    const { x } = this.mMapLayer.scale;
    if (wheelUp && x < 0.5) {
      this.mMapLayer.scale.set(0.5);
      this.mGridLayer.scale.set(0.5);
    }

    if (wheelUp && x >= 0.5) {
      this.mMapLayer.scale.x -= 0.02;
      this.mMapLayer.scale.y -= 0.02;
      this.mGridLayer.scale.set(this.mMapLayer.scale.x);
    }

    if (wheelDown && x > 2) {
      this.mMapLayer.scale.set(0.5);
      this.mGridLayer.scale.set(0.5);
    }
    if (wheelDown && x <= 2) {
      this.mMapLayer.scale.x += 0.02;
      this.mMapLayer.scale.y += 0.02;
      this.mGridLayer.scale.set(this.mMapLayer.scale.x);
    }
    const mapPos = this.mMapLayer.position;
    this.mGridLayer.position.set(mapPos.x, mapPos.y);
  }

  private moveMap(x: number, y: number) {
    const moveX = x - this.mMapPos[0];
    const moveY = y - this.mMapPos[1];
    this.mMapLayer.moveMap(moveX, moveY);
    this.mGridLayer.position.set(this.mMapLayer.x, this.mMapLayer.y);
    this.mMapPos = [x, y];
    this.cursor = 'grabbing';
  }

  saveMapData() {
    return this.mMapLayer.saveMapData();
  }

  async endGame() {
    this.onwheel = () => null;
  }
}
