import * as PIXI from 'pixijs';

export default class MapGridLine extends PIXI.Container {
  private mPoint: number[];
  private mGridLine: PIXI.Graphics;
  constructor() {
    super();
  }

  async drawGrid(pointAry: number[]) {
    if (pointAry.length % 2 != 0) {
      console.error(`map grid 포인트점이 짝수가 아니여서 안그려졌다.`);
      return;
    }
    this.mGridLine = new PIXI.Graphics();
    this.mGridLine.lineStyle(1, 0xffffff, 1);
    this.mGridLine.drawPolygon(pointAry);
    this.mGridLine.endFill();
    this.addChild(this.mGridLine);
  }
}
