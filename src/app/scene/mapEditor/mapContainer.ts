import * as PIXI from 'pixijs';
import { canvasInfo } from '@/util/config';
import SpriteInMap from './SpriteInMap';
import MapEditor from './mapEditor';
import { map } from 'lodash-es';
import gsap from 'gsap';

const scaleScope = 0.02;
export default class MapContainer extends PIXI.Container {
  private mGuideLineContainer: PIXI.Container;
  private mInitPos: number[];
  private mTileArray: { [key: number]: SpriteInMap };

  get tileAry(): { [key: number]: SpriteInMap } {
    return this.mTileArray;
  }

  get getInitPos(): number[] {
    return this.mInitPos;
  }

  constructor(x: number, y: number) {
    super();
    this.mTileArray = [];
    this.mInitPos = [x, y];
    this.mGuideLineContainer = new PIXI.Container();
    this.addChild(this.mGuideLineContainer);
  }

  async makeGuideLine() {
    for (let x = 0; x <= canvasInfo.width; x += 50) {
      const xline = new PIXI.Graphics();
      xline.beginFill(0x00ff00, 1);
      xline.drawRect(x, 0, 1, canvasInfo.height);
      xline.endFill();
      xline.zIndex = -1;
      this.mGuideLineContainer.addChild(xline);
      for (let y = 0; y <= canvasInfo.height; y += 50) {
        const yline = new PIXI.Graphics();
        yline.beginFill(0x00ff00, 1);
        yline.drawRect(0, y, canvasInfo.width, 1);
        yline.endFill();
        yline.zIndex = -1;
        this.mGuideLineContainer.addChild(yline);
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

  endEditSprite() {
    const ary = Object.values(this.mTileArray);
    map(ary, (e) => e.disable);
  }

  moveSprite(idx: number) {
    const target = this.mTileArray[idx] ? this.mTileArray[idx] : null;
    if (!target) return;

    gsap.to(target, { x: target.mypos.x, y: target.mypos.y, duration: 0.25 });
  }

  // addTile(textureName: string) {
  //   const index = Object.keys(this.mTileArray).length;
  //   const sprite = new SpriteInMap(index, textureName, 0, 0);
  //   this.mTileArray[index] = sprite;
  //   this.addChild(sprite);
  //   sprite.position.set(0, 0);
  // }
}
