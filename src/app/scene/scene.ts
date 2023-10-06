import * as PIXI from 'pixijs';
import gsap from 'gsap';
import { map } from 'lodash-es';

export default class Scene extends PIXI.Container {
  private mInfo: TypeSceneInfo;
  get info(): TypeSceneInfo {
    return this.mInfo;
  }

  constructor(sceneId: number, name: string) {
    super();
    this.mInfo = { sceneId, name };
  }

  /**@description scene을 상속받는 각 scene에서 호출*/
  async init() {
    //
  }

  /**@description scene을 상속받는 각 scene에서 호출*/
  async startGame() {
    //
  }

  async endGame() {
    gsap.globalTimeline.clear();
    this.removeChildren();
  }
}
