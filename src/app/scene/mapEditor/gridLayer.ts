import * as PIXI from 'pixijs';
import { canvasInfo } from '@/util/config';
import MapEditor from './mapEditor';
import { getDegree, getDistance } from '@/util';

const scaleScope = 0.02;
export default class GridLayer extends PIXI.Container {
  private mGridContainer: PIXI.Container;
  constructor() {
    super();
    this.mGridContainer = new PIXI.Container();
    this.addChild(this.mGridContainer);
  }
  async drawIsometric() {
    this.mGridContainer.removeChildren();
    const end = canvasInfo.width / canvasInfo.tileScale;

    for (let i = 0; i <= end; i += 2) {
      const startX = i * canvasInfo.tileScale;
      for (let j = 0; j <= end; j += 1) {
        const startY = j * canvasInfo.tileScale;
        const gridline = new PIXI.Graphics();
        gridline.lineStyle(1, 0x00ff00, 0.2);
        gridline.moveTo(startX, startY);
        gridline.lineTo(startX + canvasInfo.tileScale * 2, startY + canvasInfo.tileScale);
        gridline.moveTo(startX + canvasInfo.tileScale * 2, startY);
        gridline.lineTo(startX, startY + canvasInfo.tileScale);
        gridline.closePath();
        gridline.endFill();

        this.mGridContainer.addChild(gridline);
      }
    }
    this.mGridContainer.pivot.set(this.mGridContainer.width / 2, this.mGridContainer.height / 2);
    this.mGridContainer.position.set(this.mGridContainer.width / 2, this.mGridContainer.height / 2);
  }

  moveMap(x: number, y: number) {
    const container = (this.parent as MapEditor).mapContainer;
    container.x += x;
    container.y += y;
  }
}
