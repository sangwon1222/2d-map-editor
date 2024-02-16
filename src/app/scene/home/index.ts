import * as PIXI from 'pixijs';
import Scene from '../scene';
import MapLayout from './mapLayout';
import CharacterLayout from './character';
import { canvasInfo } from '@/util/config';
import MapApi from '@/api/map';
import { useMapStore } from '@/store/map';
import gsap from 'gsap';

export default class Home extends Scene {
  private mMapLayout: MapLayout;
  private mCharacterLayout: CharacterLayout;
  private mMoveTimeline: gsap.core.Timeline;
  constructor(sceneId: number, name: string) {
    super(sceneId, name);
  }

  async init() {
    this.sortableChildren = true;
    this.mMapLayout = new MapLayout();
    await this.mMapLayout.init();
    this.mMapLayout.zIndex = 1;
    this.mCharacterLayout = new CharacterLayout();
    await this.mCharacterLayout.init();
    this.mCharacterLayout.zIndex = 2;
    this.addChild(this.mMapLayout, this.mCharacterLayout);
    this.mCharacterLayout.position.set(canvasInfo.tileScale, canvasInfo.tileScale);

    this.mMapLayout.handlePointerDown = async (e: PIXI.FederatedPointerEvent, pos: number[]) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const { ok, data } = await MapApi.moveCharacter(
        useMapStore.mapData,
        [this.mCharacterLayout.x / canvasInfo.tileScale, this.mCharacterLayout.y / canvasInfo.tileScale],
        pos,
      );
      console.log({ ok, data });
      if (ok) {
        this.moveCharacter(data);
      }
    };
  }

  async startGame() {
    console.log('start', this.info);
  }

  moveCharacter(pos: number[][]) {
    if (this.mMoveTimeline) this.mMoveTimeline.kill();
    const { tileScale } = canvasInfo;
    const characterPos = [this.mCharacterLayout.x / tileScale, this.mCharacterLayout.y / tileScale];
    this.mMoveTimeline = gsap.timeline();
    for (let i = 0; i < pos.length; i++) {
      this.mMoveTimeline.to(this.mCharacterLayout, {
        x: pos[i][0] * canvasInfo.tileScale,
        y: pos[i][1] * canvasInfo.tileScale,
        duration: 0.25,
        onStart: () => {
          if (pos[i][1] > characterPos[1]) this.mCharacterLayout.changeDirection('b-l');
          if (pos[i][1] < characterPos[1]) this.mCharacterLayout.changeDirection('b-r');
          if (pos[i][0] > characterPos[0]) this.mCharacterLayout.changeDirection('r');
          if (pos[i][0] < characterPos[0]) this.mCharacterLayout.changeDirection('l');
        },
        ease: 'none',
      });
    }
  }
}
