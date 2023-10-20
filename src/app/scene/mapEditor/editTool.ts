import { rscManager } from '@/app/resource/resourceManager';
import { canvasInfo } from '@/util/config';
import MapEditor from './mapEditor';
import * as PIXI from 'pixijs';
import gsap from 'gsap';
import EditItem from './editItem';
import Button from './button';
import { find, map } from 'lodash-es';

import totalImg from '../../resource/resouce.json';
import { useItemStore } from '@/store/item';
const resourceList = totalImg['map-editor'].img;

const resetPosScale = 50;
const toolWidth = 500;
export default class EditTool extends PIXI.Container {
  private mMapPosBtn: Button;
  private mSpriteList: Array<EditItem>;
  private mSpriteLayer: PIXI.Container;
  private mOpenSpriteLayer: boolean;
  constructor() {
    super();
    this.mOpenSpriteLayer = false;
  }

  async init() {
    await this.drawLayer();
    await this.drawItem();
    await this.drawChevron();
    await this.drawPosBtn();
  }

  resetSelectEditItem() {
    map(this.mSpriteList, (e) => e.blur());
  }

  private async drawLayer() {
    /**sprite-layer */
    this.mSpriteLayer = new PIXI.Container();
    this.mSpriteLayer.position.set(canvasInfo.width, 0);
    this.mSpriteLayer.zIndex = 1;
    this.addChild(this.mSpriteLayer);

    /**bg */
    const bg = new PIXI.Graphics();
    bg.beginFill(0xbcbcbc, 1);
    bg.drawRect(0, 0, toolWidth, 800);
    bg.endFill();
    this.mSpriteLayer.addChild(bg);
  }

  async drawItem() {
    this.mSpriteList = [];
    let colId = 0;
    for (let i = 0; i < resourceList.length; i++) {
      const gap = 20;
      const rowId = i % 3 ? 1 : 0;
      if (rowId === 0 && i > 0) colId += 1;

      const itemId = find(useItemStore.itemData, (e) => e.name === resourceList[i])?.id;
      const editItems = new EditItem(itemId, resourceList[i]);
      editItems.init();
      this.mSpriteList.push(editItems);
      this.sortableChildren = true;

      const bgWidth = this.mSpriteList[i].width;
      const bgHeight = this.mSpriteList[i].height;
      const x = i % 3 ? rowId * (this.mSpriteList[i - 1].x + bgWidth) : 120;
      const y = i ? colId * bgHeight + 10 : 10;

      this.mSpriteList[i].position.set(x + gap / 2, y + gap / 2);
      this.mSpriteList[i].zIndex = 2;
      this.mSpriteLayer.addChild(this.mSpriteList[i]);
    }
  }

  async drawChevron() {
    const scrWidth = canvasInfo.width;

    const chevron = new Button(rscManager.getHandle.getRsc('chevron.png', true), true);
    chevron.rotation = (90 * Math.PI) / 180;
    chevron.zIndex = 2;
    chevron.position.set(scrWidth - resetPosScale, resetPosScale);
    chevron.interactive = true;
    chevron.tint = this.mOpenSpriteLayer ? 0x00ff00 : 0xffffff;
    chevron.onDown = () => {
      this.mOpenSpriteLayer = !this.mOpenSpriteLayer;
      const isOpen = this.mOpenSpriteLayer;
      chevron.tint = isOpen ? 0x00ff00 : 0xffffff;
      const radian = isOpen ? (-90 * Math.PI) / 180 : (90 * Math.PI) / 180;
      const openPos = isOpen ? scrWidth - toolWidth + resetPosScale : scrWidth - resetPosScale;
      const x = isOpen ? scrWidth - toolWidth : scrWidth;

      gsap.to(this.mSpriteLayer, { x, duration: 0.5 });
      gsap.to(chevron, { x: openPos, rotation: radian, duration: 0.5 });
    };

    this.addChild(chevron);
  }

  async drawPosBtn() {
    this.mMapPosBtn = new Button(rscManager.getHandle.getRsc('pos-icon.png', true), true);
    this.mMapPosBtn.zIndex = 2;
    this.mMapPosBtn.position.set(canvasInfo.width - this.mMapPosBtn.width * 2, this.mMapPosBtn.height);
    this.mMapPosBtn.interactive = true;
    this.mMapPosBtn.onDown = () => this.resetMapLayerPos();
  }

  private resetMapLayerPos() {
    const mapLayer = (this.parent as MapEditor).mapLayer;
    const gridLayer = (this.parent as MapEditor).gridLayer;

    const [x, y] = mapLayer.getInitPos;
    const duration = 0.25;
    gsap.to(mapLayer, { x, y, duration, onComplete: () => mapLayer.position.set(x, y) });
    gsap.to(gridLayer, { x, y, duration, onComplete: () => mapLayer.position.set(x, y) });
  }
}
