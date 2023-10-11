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

  usePointerEvent() {
    this.on('pointermove', (e: PIXI.FederatedPointerEvent) => {
      e.defaultPrevented = true;
      this.onPointerMove(e);
    });

    this.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
      e.defaultPrevented = true;
      this.onPointerDown(e);
    });

    const cancelMoveEvtList = ['up', 'cancel', 'out', 'leave'];
    for (let i = 0; i < cancelMoveEvtList.length; i++) {
      const eventName = `pointer${cancelMoveEvtList[i]}` as any;
      this.on(eventName, (e: PIXI.FederatedPointerEvent) => {
        this.disablePointerEvt(e);
      });
    }
  }

  onPointerMove(e: PIXI.FederatedPointerEvent) {
    //
  }
  onPointerDown(e: PIXI.FederatedPointerEvent) {
    //
  }
  disablePointerEvt(e: PIXI.FederatedPointerEvent) {
    //
  }

  async endGame() {
    gsap.globalTimeline.clear();
    this.removeChildren();
  }
}
