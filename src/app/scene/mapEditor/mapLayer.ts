import * as PIXI from 'pixijs';
import { canvasInfo } from '@/util/config';
import MapEditor from './mapEditor';
import { useMapStore } from '@/store/map';
import { useSocketStore } from '@/store/socket';
import Tile from './tile';
import MapGridLine from './mapGridLine';
import { map } from 'lodash-es';
const { tileScale } = canvasInfo;

const scaleScope = 0.02;
export default class MapLayer extends PIXI.Container {
  private mPopupLayer: PIXI.Container;
  private mGridLineLayer: PIXI.Container;
  private mSpriteLayer: PIXI.Container;
  private mInitPos: number[];
  private mTileAry: null | Tile[][];
  private mGridLine: MapGridLine;
  private mSelectedItemId: number;

  get selectedItemId(): number {
    return this.mSelectedItemId;
  }

  get getInitPos(): number[] {
    return this.mInitPos;
  }

  constructor(x: number, y: number) {
    super();
    this.mSelectedItemId = -1;
    this.mInitPos = [x, y];

    this.mPopupLayer = new PIXI.Container();
    this.mPopupLayer.zIndex = 3;
    this.mGridLineLayer = new PIXI.Container();
    this.mGridLineLayer.zIndex = 2;
    this.mSpriteLayer = new PIXI.Container();
    this.mSpriteLayer.zIndex = 1;

    this.sortableChildren = true;
    this.mTileAry = [[], [], [], [], [], [], [], [], [], [], [], [], [], []];

    this.addChild(this.mPopupLayer, this.mGridLineLayer, this.mSpriteLayer);
  }

  async init() {
    await this.drawLine();
    await this.drawTile();
  }

  resetTileStatus() {
    map(this.mTileAry, (e) => map(e, (i) => i?.blur()));
  }

  selectItem(itemId: number) {
    this.mSelectedItemId = itemId;
  }

  async drawLine() {
    this.mGridLine = new MapGridLine();
    const { width } = canvasInfo;
    await this.mGridLine.drawGrid([0, 0, width / 2, width / 4, 0, width / 2, -width / 2, width / 4]);
    this.mGridLineLayer.addChild(this.mGridLine);
  }

  async drawTile() {
    for (let x = 0; x < 14; x++) {
      for (let y = 0; y < 14; y++) {
        const startX = x - y;
        const tile = new Tile(x, y);
        await tile.drawTile();
        tile.position.set(startX * tileScale, (y * tileScale) / 2 + (x * tileScale) / 2);
        this.mTileAry[y][x] = tile;

        this.mGridLineLayer.addChild(tile);
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
    const container = (this.parent as MapEditor).mapLayer;
    container.x += x;
    container.y += y;
  }

  saveMapData() {
    return map(this.mTileAry, (e) => map(e, (i) => (i.saveInfo.itemId && i.saveInfo.itemId > -1 ? i.saveInfo : null)));
  }
}
