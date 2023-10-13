import App from '@/app/app';
import { rscManager } from '@/app/resource/resourceManager';
import * as PIXI from 'pixijs';
import MapEditor from './mapEditor';

export default class EditSprite extends PIXI.Container {
  private mSprite: PIXI.Sprite;

  constructor(textureName: string) {
    super();
    this.mSprite = new PIXI.Sprite(rscManager.getHandle.getRsc(textureName));
    this.mSprite.anchor.set(0.5);
    this.mSprite.position.set(this.mSprite.width / 2, this.mSprite.height / 2);
    this.mSprite.zIndex = 2;

    this.sortableChildren = true;
    this.addChild(this.mSprite);

    this.interactive = true;
    this.cursor = 'pointer';
    this.on('pointerdown', (e) => {
      if (e.ctrlKey) return;
      const mapEditor = App.getHandle.getScene as MapEditor;
      mapEditor.addSprite(textureName, e.global.x, e.global.y);
    });
  }
}
