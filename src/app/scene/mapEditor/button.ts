import * as PIXI from 'pixijs';

export default class Button extends PIXI.Sprite {
  private mIsMoving: boolean;
  get isMoving(): boolean {
    return this.mIsMoving;
  }
  set isMoving(v: boolean) {
    this.mIsMoving = v;
  }
  constructor(texture: PIXI.Texture) {
    super();
    this.mIsMoving = false;
    this.texture = texture;
    this.cursor = 'pointer';

    this.on('pointermove', (e: PIXI.FederatedPointerEvent) => {
      e.defaultPrevented = true;
      if (!this.mIsMoving) return;
      this.onMoving();
    });
    this.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
      e.defaultPrevented = true;
      this.onDown();
    });
    this.on('pointerenter', (e: PIXI.FederatedPointerEvent) => {
      e.defaultPrevented = true;
      this.onEnter();
    });

    const cancelMoveEvtList = ['up', 'cancel', 'out', 'leave'];
    for (let i = 0; i < cancelMoveEvtList.length; i++) {
      const eventName = `pointer${cancelMoveEvtList[i]}` as any;
      this.on(eventName, (e: PIXI.FederatedPointerEvent) => {
        this.disable();
      });
    }
  }

  onEnter() {
    //
  }

  onMoving() {
    //
  }

  onDown() {
    //
  }

  disable() {
    //
  }
}
