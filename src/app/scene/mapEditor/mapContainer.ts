import * as PIXI from 'pixijs';
import { canvasInfo } from '@/util/config';
import SpriteInMap from './SpriteInMap';
import MapEditor from './mapEditor';
import { useMapStore } from '@/store/map';
import { useChatStore } from '@/store/chat';

const scaleScope = 0.02;
export default class MapContainer extends PIXI.Container {
  private mGuideLineContainer: PIXI.Container;
  private mSpriteContainer: PIXI.Container;
  private mInitPos: number[];

  get getInitPos(): number[] {
    return this.mInitPos;
  }

  constructor(x: number, y: number) {
    super();

    this.mInitPos = [x, y];
    this.mGuideLineContainer = new PIXI.Container();
    this.mGuideLineContainer.zIndex = 2;
    this.mSpriteContainer = new PIXI.Container();
    this.mSpriteContainer.zIndex = 1;

    this.sortableChildren = true;

    this.addChild(this.mGuideLineContainer, this.mSpriteContainer);
  }

  async makeGuideLine() {
    this.mGuideLineContainer.removeChildren();
    this.mSpriteContainer.removeChildren();
    const endX = canvasInfo.width / canvasInfo.tileScale;
    const endY = canvasInfo.height / canvasInfo.tileScale;

    for (let y = 0; y <= endY; y += 1) {
      const yline = new PIXI.Graphics();
      yline.beginFill(0xff0000, 1);
      yline.drawRect(0, y * canvasInfo.tileScale, canvasInfo.width, 1);
      yline.endFill();
      this.mGuideLineContainer.addChild(yline);
      for (let x = 0; x <= endX; x += 1) {
        const xline = new PIXI.Graphics();
        xline.beginFill(0xff0000, 1);
        xline.drawRect(x * canvasInfo.tileScale, 0, 1, canvasInfo.height);
        xline.endFill();
        this.mGuideLineContainer.addChild(xline);

        if (x != endX && y != endY) {
          const info = useMapStore.mapJson[y][x];
          const sprite = new SpriteInMap(info.idx, info.textureName, info.itemStatus);
          sprite.position.set(x * 50 + 25, y * 50 + 25);
          this.mSpriteContainer.addChild(sprite);
        }
      }
    }
  }

  scaleUp() {
    this.scale.x += scaleScope;
    this.scale.y += scaleScope;
  }
  scaleDown() {
    this.scale.x -= scaleScope;
    this.scale.y -= scaleScope;
  }

  moveMap(x: number, y: number) {
    const container = (this.parent as MapEditor).mapContainer;
    container.x += x;
    container.y += y;
  }

  updateMap() {
    this.mSpriteContainer.removeChildren();

    const endX = canvasInfo.width / canvasInfo.tileScale;
    const endY = canvasInfo.height / canvasInfo.tileScale;

    for (let y = 0; y < endY; y += 1) {
      for (let x = 0; x < endX; x += 1) {
        const sprite = new SpriteInMap(
          useMapStore.mapJson[y][x].idx,
          useMapStore.mapJson[y][x].textureName,
          useMapStore.mapJson[y][x].itemStatus,
        );
        sprite.position.set(x * 50 + 25, y * 50 + 25);
        this.mSpriteContainer.addChild(sprite);
      }
    }

    localStorage.setItem('mapJson', JSON.stringify(useMapStore.mapJson));
    useChatStore.socket.emit('update-map-json', { mapJson: JSON.stringify(useMapStore.mapJson) });
  }
}
