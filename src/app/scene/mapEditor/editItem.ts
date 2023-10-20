import { rscManager } from '@/app/resource/resourceManager';
import * as PIXI from 'pixijs';
import EditTool from './editTool';
import App from '@/app/app';
import MapEditor from './mapEditor';

export default class EditItem extends PIXI.Container {
  private mSprite: PIXI.Sprite;
  private mTextureName: string;
  private mFocus: PIXI.Graphics;
  private mItemId: number;

  get itemId(): number {
    return this.mItemId;
  }

  constructor(itemId: number, textureName: string) {
    super();
    this.mItemId = itemId;
    this.mTextureName = textureName;

    this.sortableChildren = true;

    this.interactive = true;
    this.cursor = 'pointer';

    this.on('pointerdown', (e) => {
      if (e.altKey) return;
      e.preventDefault();
      e.stopPropagation();
      e.defaultPrevented = true;

      const mapEditor = App.getHandle.getScene as MapEditor;
      const isSelected = mapEditor.mapLayer.selectedItemId != this.mItemId;
      const itemId = isSelected ? this.mItemId : -1;

      mapEditor.editTool.resetSelectEditItem();
      if (isSelected) this.focus();
      mapEditor.mapLayer.selectItem(itemId);
    });
  }

  async init() {
    this.mSprite = new PIXI.Sprite(rscManager.getHandle.getRsc(this.mTextureName));
    this.mSprite.anchor.set(0.5);
    this.mSprite.position.set(this.mSprite.width / 2, this.mSprite.height / 2);
    this.mSprite.zIndex = 2;
    this.addChild(this.mSprite);

    const bg = new PIXI.Graphics();
    bg.beginFill(0xffffff, 1);
    bg.drawRect(0, 0, this.mSprite.width, this.mSprite.height);
    bg.endFill();
    bg.zIndex = 1;
    this.addChild(bg);

    this.mFocus = new PIXI.Graphics();
    this.mFocus.lineStyle(6, 0xfff000, 1);
    this.mFocus.moveTo(0, 0);
    this.mFocus.drawPolygon([0, 0, this.width + 10, 0, this.width + 10, this.height + 10, 0, this.height + 10, 0, 0]);
    this.mFocus.endFill();
    this.mFocus.pivot.set(this.width / 2, this.height / 2);
    this.mFocus.position.set(this.width / 2 - 4, this.height / 2 - 4);
    this.mFocus.alpha = 0;
    this.mFocus.zIndex = 3;
    this.addChild(this.mFocus);
  }

  focus() {
    this.mFocus.alpha = 1;
  }

  blur() {
    this.mFocus.alpha = 0;
  }
}
