import App from '@/app/app';
import { rscManager } from '@/app/resource/resourceManager';
import * as PIXI from 'pixijs';
import MapEditor from './mapEditor';

export default class EditSprite extends PIXI.Container {
  private mSprite: PIXI.Sprite;
  private mBg: PIXI.Graphics;
  constructor(textureName: string) {
    super();
    this.mSprite = new PIXI.Sprite(rscManager.getHandle.getRsc(textureName));
    this.mSprite.anchor.set(0.5);
    this.mSprite.position.set(this.mSprite.width / 2, this.mSprite.height / 2);
    this.mSprite.zIndex = 2;

    this.mBg = new PIXI.Graphics();
    this.mBg.beginFill(0xffffff, 1);
    this.mBg.drawRect(0, 0, this.mSprite.width + 20, this.mSprite.height + 20);
    this.mBg.endFill();
    this.mBg.pivot.set((this.mSprite.width + 20) / 2, (this.mSprite.height + 20) / 2);
    this.mBg.position.set((this.mSprite.width + 10) / 2, (this.mSprite.height + 10) / 2);
    this.mBg.zIndex = 1;

    this.sortableChildren = true;
    this.addChild(this.mSprite, this.mBg);

    this.interactive = true;
    this.cursor = 'pointer';
    this.on('pointerdown', () => {
      const mapEditor = App.getHandle.getScene as MapEditor;
      mapEditor.addSprite(textureName);
    });
  }
}
