import { rscManager } from '@/app/resource/resourceManager';
import { canvasInfo } from '@/util/config';
import MapEditor from './mapEditor';
import * as PIXI from 'pixijs';
import gsap from 'gsap';
import EditSprite from './editToolSprite';
import Button from './button';
import { map } from 'lodash-es';

const resetPosScale = 50;
const toolW = 260;
export default class EditTool extends PIXI.Container {
  private mResetMapPosBtn: Button;
  private mSpriteList: Array<EditSprite>;
  private mSpriteContainer: PIXI.Container;
  private mOpenSpriteContainer: boolean;
  private mBtnMotion: gsap.core.Timeline;
  constructor() {
    super();
    this.mSpriteContainer = new PIXI.Container();
    const bg = new PIXI.Graphics();
    bg.beginFill(0xbcbcbc, 1);
    bg.drawRect(0, 0, toolW, 800);
    bg.endFill();
    this.mSpriteContainer.addChild(bg);

    const textList = ['50px', '100px'];
    map(textList, (e, i) => {
      const text = new PIXI.Text(e, { fill: 0xbcbcbc });
      text.position.set(i * 60, 10);
      this.mSpriteContainer.addChild(text);
    });

    this.mSpriteContainer.position.set(canvasInfo.width, 0);
    this.mSpriteContainer.zIndex = 1;

    const rsc = [
      'black-wall-tile-50.png',
      'black-wall-tile-t-r-50.png',
      'black-wall-tile-t-l-50.png',
      'black-wall-tile-b-r-50.png',
      'black-wall-tile-b-l-50.png',
      'wall-tile-50.png',
      'wall-tile-t-r-50.png',
      'wall-tile-t-l-50.png',
      'wall-tile-b-r-50.png',
      'wall-tile-b-l-50.png',
      //   'black-wall-tile-100.png',
      //   'black-wall-tile-200.png',
      //   'wall-tile-100.png',
      //   'wall-tile-200.png',
    ];
    const layout = new PIXI.Container();
    layout.position.set(20, 100);
    this.mSpriteContainer.addChild(layout);
    this.mSpriteList = [];
    let colId = 0;
    for (let i = 0; i < rsc.length; i++) {
      const gap = 20;
      const rowId = i % 3 ? 1 : 0;
      if (rowId === 0 && i > 0) colId += 1;
      this.mSpriteList.push(new EditSprite(rsc[i]));

      const bgWidth = this.mSpriteList[i].width + 20;
      const bgHeight = this.mSpriteList[i].height + 20;
      const x = i ? rowId * (this.mSpriteList[i - 1].x + bgWidth) : 0;
      const y = i ? colId * (bgHeight + 10) : 0;

      this.mSpriteList[i].position.set(x + gap / 2, y + gap / 2);
      this.mSpriteList[i].zIndex = 2;

      const bg = new PIXI.Graphics();
      bg.beginFill(0xffffff, 1);
      bg.drawRect(0, 0, bgWidth, bgHeight);
      bg.endFill();
      bg.position.set(x, y);
      bg.zIndex = 1;

      layout.addChild(bg, this.mSpriteList[i]);
    }

    this.mOpenSpriteContainer = false;

    const chevron = new Button(rscManager.getHandle.getRsc('chevron.png', true));
    chevron.anchor.set(0.5);
    chevron.rotation = (90 * Math.PI) / 180;
    chevron.scale.set(0.1);
    chevron.zIndex = 2;
    chevron.position.set(canvasInfo.width - resetPosScale, resetPosScale);
    chevron.interactive = true;
    chevron.tint = this.mOpenSpriteContainer ? 0x00ff00 : 0xffffff;
    chevron.onDown = () => {
      this.mOpenSpriteContainer = !this.mOpenSpriteContainer;
      const radian = this.mOpenSpriteContainer ? (-90 * Math.PI) / 180 : (90 * Math.PI) / 180;
      const x = this.mOpenSpriteContainer ? canvasInfo.width - toolW : canvasInfo.width;
      gsap.to(this.mSpriteContainer, { x, duration: 0.5 });
      gsap.to(chevron, { rotation: radian, duration: 0.5 });
      chevron.tint = this.mOpenSpriteContainer ? 0x00ff00 : 0xffffff;
    };
    this.addChild(chevron);

    this.mResetMapPosBtn = new Button(rscManager.getHandle.getRsc('pos-icon.png', true));
    this.mResetMapPosBtn.scale.set(0.1);
    this.mResetMapPosBtn.anchor.set(0.5);
    // this.mResetMapPosBtn.position.set(canvasInfo.width - resetPosScale * 2, resetPosScale);
    this.mResetMapPosBtn.position.set(this.mResetMapPosBtn.width, this.mResetMapPosBtn.height);
    this.mResetMapPosBtn.interactive = true;
    this.mResetMapPosBtn.onDown = () => this.resetMapContainerPos();
    this.mResetMapPosBtn.onEnter = () => {
      this.mBtnMotion?.clear();
      this.mBtnMotion = gsap.timeline();
      this.mBtnMotion.to(this.mResetMapPosBtn, { rotation: -0.1, duration: 0.15 });
      this.mBtnMotion.to(this.mResetMapPosBtn, { rotation: 0.1, duration: 0.15 });
      this.mBtnMotion.to(this.mResetMapPosBtn, { rotation: 0, duration: 0.15 });
    };

    // this.addChild(this.mResetMapPosBtn, this.mSpriteContainer);
    this.mSpriteContainer.addChild(this.mResetMapPosBtn);
    this.addChild(this.mSpriteContainer);
    this.sortableChildren = true;
  }

  resetMapContainerPos() {
    const mapContainer = (this.parent as MapEditor).mapContainer;
    const [x, y] = mapContainer.getInitPos;
    gsap.to(mapContainer, { x, y, duration: 0.5 });
  }
}
