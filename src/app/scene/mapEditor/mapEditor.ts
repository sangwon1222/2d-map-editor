import { canvasInfo } from '@/util/config';
import MapContainer from './mapContainer';
import Scene from '@app/scene/scene';
import EditTool from './editTool';
import * as PIXI from 'pixijs';
import { rscManager } from '@/app/resource/resourceManager';
import gsap from 'gsap';
import SpriteInMap from './SpriteInMap';

const mapContainerPos = [canvasInfo.width / 2, canvasInfo.height / 2];
/**
 * @params {number} - scene id
 * @params {string} - scene name
 */
export default class MapEditor extends Scene {
  private mMapContainer: MapContainer;
  private mIsMovingMap: Boolean;
  private mMapPos: number[];
  private mEditTool: EditTool;
  private mEditSprite: { [key: number]: SpriteInMap };
  private mEditSpriteIdx: number;

  set editSpriteIdx(v: number) {
    this.mEditSpriteIdx = v;
  }

  get mapContainer(): MapContainer {
    return this.mMapContainer;
  }

  constructor(sceneId: number, name: string) {
    super(sceneId, name);
    this.interactive = true;
    this.hitArea = new PIXI.Rectangle(0, 0, canvasInfo.width, canvasInfo.height);
    this.mIsMovingMap = false;
    this.mMapPos = [0, 0];
    this.mEditSprite = {};
  }

  async init() {
    this.mEditSpriteIdx = -1;
    this.mMapContainer = new MapContainer(mapContainerPos[0], mapContainerPos[1]);
    this.mMapContainer.position.set(mapContainerPos[0], mapContainerPos[1]);
    await this.mMapContainer.makeGuideLine();
    this.mMapContainer.zIndex = 1;

    this.mEditTool = new EditTool();
    this.mEditTool.position.set(0, 0);
    this.mEditTool.zIndex = 2;

    this.sortableChildren = true;
    this.interactive = true;
    this.cursor = 'grab';

    this.addChild(this.mMapContainer, this.mEditTool);

    this.onwheel = (e) => {
      const { x } = this.mMapContainer.scale;
      const wheelUp = e.deltaY < 0 && x > 0.6;
      const wheelDown = e.deltaY > 0 && x < 2;
      this.registWheelEvt(wheelUp, wheelDown);
    };

    this.usePointerEvent();
    this.onPointerDown = (e: PIXI.FederatedPointerEvent) => {
      const { x, y } = { x: Math.floor(e.screen.x), y: Math.floor(e.screen.y) };
      this.mMapPos = [x, y];
      this.mIsMovingMap = true;
    };

    this.onPointerMove = (e: PIXI.FederatedPointerEvent) => {
      if (this.mIsMovingMap) {
        const { x, y } = { x: Math.floor(e.screen.x), y: Math.floor(e.screen.y) };
        this.mMapContainer.moveMap(x - this.mMapPos[0], y - this.mMapPos[1]);
        this.mMapPos = [x, y];
        this.cursor = 'grabbing';
      }

      if (this.mEditSprite[this.mEditSpriteIdx]?.isMovingInMap) {
        this.mEditSprite[this.mEditSpriteIdx].position.set(e.screen.x, e.screen.y);
      }
    };

    this.disablePointerEvt = (e: PIXI.FederatedPointerEvent) => {
      e.defaultPrevented = true;
      this.mIsMovingMap = false;
      this.cursor = 'grab';
      this.mMapContainer.endEditSprite();
    };
  }

  async registWheelEvt(wheelUp: boolean, wheelDown: boolean) {
    if (wheelUp) this.mMapContainer.scaleDown();
    if (wheelDown) this.mMapContainer.scaleUp();
  }

  addSprite(textureName: string) {
    const idx = Object.keys(this.mEditSprite).length;
    this.mEditSprite[idx] = new SpriteInMap(idx, textureName, 0, 0);
    this.mEditSprite[idx].position.set(this.mMapContainer.x, this.mMapContainer.y);
    this.addChild(this.mEditSprite[idx]);
    this.mEditTool.resetMapContainerPos();
    // this.mMapContainer.addTile(textureName);
  }

  moveSprite(e: PIXI.FederatedPointerEvent, idx: number) {
    if (!this.mEditSprite[idx].isMovingInMap) return;
    console.log(e);
    // this.mEditSprite[idx].position.set(e.);
  }

  async endGame() {
    this.onwheel = () => null;
  }
}
