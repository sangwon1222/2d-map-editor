import * as PIXI from 'pixijs';

export default class Button extends PIXI.Sprite {
  private mIsMoving: boolean;
  get isMoving(): boolean {
    return this.mIsMoving;
  }
  set isMoving(v: boolean) {
    this.mIsMoving = v;
  }

  constructor(texture: PIXI.Texture, centerAnchor?: boolean) {
    super();
    this.mIsMoving = false;
    this.texture = texture;
    this.cursor = 'pointer';
    if (centerAnchor) {
      this.anchor.set(0.5);
      this.position.set(this.width / 2, this.height / 2);
    }

    this.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
      if (e.altKey) return;
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

  onDown() {
    //
  }

  disable() {
    //
  }
}
