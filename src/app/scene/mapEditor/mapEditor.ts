import { canvasInfo } from '@/util/config';
import MapContainer from './mapContainer';
import Scene from '@app/scene/scene';
import EditTool from './editTool';
import * as PIXI from 'pixijs';
import SpriteInMap from './SpriteInMap';
import { map } from 'lodash-es';
import { useMapStore } from '@/store/map';

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
  private mEditSpritePos: number[];

  get editSpriteAry(): { [key: number]: SpriteInMap } {
    return this.mEditSprite;
  }
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
    this.mEditSpritePos = [-1, -1];
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
      const { x, y } = { x: Math.floor(e.global.x), y: Math.floor(e.global.y) };
      this.mMapPos = [x, y];

      this.mIsMovingMap = e.ctrlKey;
    };

    this.onPointerMove = (e: PIXI.FederatedPointerEvent) => {
      if (this.mIsMovingMap && e.ctrlKey) {
        const { x, y } = { x: Math.floor(e.global.x), y: Math.floor(e.global.y) };
        this.mMapContainer.moveMap(x - this.mMapPos[0], y - this.mMapPos[1]);
        this.mMapPos = [x, y];
        this.cursor = 'grabbing';
      }

      if (this.mEditSprite[this.mEditSpriteIdx]?.isMovingInMap) {
        this.moveSprite(e);
      }
    };

    this.disablePointerEvt = (_e: PIXI.FederatedPointerEvent) => {
      if (this.mEditSpriteIdx > -1) {
        this.mEditSprite[this.mEditSpriteIdx].disable();
        this.mEditSpriteIdx = -1;
      }
      this.mIsMovingMap = false;
      this.cursor = 'pointer';
    };
  }

  async registWheelEvt(wheelUp: boolean, wheelDown: boolean) {
    if (wheelUp) this.mMapContainer.scaleDown();
    if (wheelDown) this.mMapContainer.scaleUp();
  }

  addSprite(textureName: string, x: number, y: number) {
    const idx = Object.keys(this.mEditSprite).length;
    this.mEditSprite[idx] = new SpriteInMap(idx, textureName, 1);
    this.mEditSprite[idx].isMovingInMap = true;
    this.mEditSpriteIdx = idx;
    this.mEditSprite[idx].position.set(x, y);
    this.mEditSprite[idx].zIndex = 6;
    this.addChild(this.mEditSprite[idx]);
  }

  editSpritePos(idx: number, x: number, y: number) {
    if (idx < 0) return;
    map(this.mEditSprite, (e) => e.disable());

    this.mEditSpriteIdx = idx;
    this.mEditSprite[idx].isMovingInMap = true;
    this.mEditSprite[idx].position.set(x, y);

    this.mMapContainer.removeChild(this.mEditSprite[idx]);
    this.addChild(this.mEditSprite[idx]);

    const mapPos = this.mMapContainer.position;
    const mapx = Math.floor((x - mapPos.x) / 50) * 50;
    const mapy = Math.floor((y - mapPos.y) / 50) * 50;
    this.mEditSpritePos = [mapx, mapy];
  }

  moveSprite(e: PIXI.FederatedPointerEvent) {
    const sprite = this.mEditSprite[this.mEditSpriteIdx];
    const { global } = e;
    const mapPos = this.mMapContainer.position;
    const mapx = Math.floor((global.x - mapPos.x) / 50) * 50;
    const mapy = Math.floor((global.y - mapPos.y) / 50) * 50;

    const isEnterMap = mapx >= 0 && mapx <= canvasInfo.width && mapy >= 0 && mapy <= canvasInfo.height;
    const x = isEnterMap ? mapPos.x + mapx + sprite.width / 2 : global.x;
    const y = isEnterMap ? mapPos.y + mapy + sprite.height / 2 : global.y;
    sprite.position.set(x, y);
    this.mEditSpritePos = [isEnterMap ? mapx : -1, isEnterMap ? mapy : -1];
  }

  endMove() {
    const [x, y] = this.mEditSpritePos;
    if (x >= 0 && x <= canvasInfo.width && y >= 0 && y <= canvasInfo.height) {
      this.removeChild(this.mEditSprite[this.mEditSpriteIdx]);
      useMapStore.mapJson[y / 50][x / 50] = {
        idx: this.mEditSpriteIdx,
        textureName: this.mEditSprite[this.mEditSpriteIdx].textureName,
        itemStatus: this.mEditSprite[this.mEditSpriteIdx].itemStatus,
      };
      this.mMapContainer.updateMap();
    }

    this.mEditSpritePos = [-1, -1];
  }

  async endGame() {
    this.onwheel = () => null;
  }
}
