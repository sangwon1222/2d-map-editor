import * as PIXI from 'pixijs';
import { canvasInfo } from '@/util/config';
import SpriteInMap from './SpriteInMap';
import MapEditor from './mapEditor';
import { useMapStore } from '@/store/map';
import { useSocketStore } from '@/store/socket';
import { getCoordinate, getDegree } from '@/util';
import { rscManager } from '@/app/resource/resourceManager';

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

    const grid = new PIXI.Graphics();
    grid.lineStyle(1, 0xffffff, 1);
    grid.drawPolygon([
      0,
      0,
      canvasInfo.width / 2,
      canvasInfo.width / 2 / 2,
      0,
      canvasInfo.width / 2,
      -canvasInfo.width / 2,
      canvasInfo.width / 2 / 2,
    ]);
    grid.endFill();
    this.mGuideLineContainer.addChild(grid);

    const { tileScale } = canvasInfo;
    for (let x = 0; x < 14; x++) {
      for (let y = 0; y < 14; y++) {
        const startX = x - y;
        const test = new PIXI.Container();
        const tile = new PIXI.Graphics();
        tile.lineStyle(1, test[y] ? test[y] : 0xfff000, 1);
        tile.beginFill(0xffffff, 1);
        tile.drawRect(0, 0, tileScale * 2, tileScale);
        tile.endFill();
        tile.pivot.set(tileScale, 0);
        tile.position.set(startX * tileScale, (y * tileScale) / 2 + (x * tileScale) / 2);

        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff, 1);
        mask.drawPolygon([
          /**1 */
          tileScale,
          0,
          /**2 */
          tileScale * 2,
          tileScale / 2,
          /**3 */
          tileScale * 2,
          tileScale * 1.5,
          /**4 */
          tileScale,
          tileScale * 2,
          /**5 */
          0,
          tileScale * 1.5,
          /**5 */
          tileScale * 2,
          tileScale / 2,
        ]);
        mask.endFill();
        mask.position.set(tile.x, tile.y);

        tile.mask = mask;
        const sprite = new PIXI.Sprite(rscManager.getHandle.getRsc('tile.png', true));
        sprite.position.set(tile.x, tile.y);
        sprite.anchor.set(0.5, 0);
        sprite.alpha = 0.1;

        sprite.interactive = true;
        sprite.on('pointerenter', () => {
          sprite.alpha = 1;
        });
        sprite.on('pointerleave', () => {
          sprite.alpha = 0.1;
        });
        test.addChild(tile);

        this.mGuideLineContainer.addChild(test, sprite);
      }
    }

    this.addChild(this.mGuideLineContainer, this.mSpriteContainer);
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
    useSocketStore.socket.emit('update-map-json', { mapJson: JSON.stringify(useMapStore.mapJson) });
  }
}
