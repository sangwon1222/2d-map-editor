import * as PIXI from 'pixijs';
import SceneManager from '@app/sceneManager';
import Scene from '@app/scene/scene';
import { registVisibleChange } from '@/util';
import { canvasInfo } from '@/util/config';
import gsap from 'gsap';
const { backgroundColor, width, height } = canvasInfo;
/**
 * @params {number} - background color
 * @params {number} - canvas width
 * @params {number} - canvas height
 * @params {HTMLCanvasElement} - canvas view
 */
export default class App extends PIXI.Application {
  private static handle: App;
  private mSceneManager: SceneManager;

  static get getHandle(): App {
    return App.handle;
  }
  get getScene(): Scene {
    return this.mSceneManager.currentScene;
  }

  constructor({ backgroundColor, width, height, view }: TypeAppParms) {
    super({ backgroundColor, width, height, view });
    App.handle = this;
  }

  /** @description application 초기 세팅  */
  async init() {
    this.stage.alpha = 0;
    this.stage.removeChildren();
    this.mSceneManager = new SceneManager();
    this.mSceneManager.zIndex = 1;
    this.stage.addChild(this.mSceneManager);
    this.stage.sortableChildren = true;
    registVisibleChange();

    await this.mSceneManager.init();
    await this.mSceneManager.start();
  }

  async startInit() {
    const test = new PIXI.Graphics();
    test.beginFill(0xff0000, 1);
    test.lineStyle(2, 0xff0000, 1);
    test.drawRect(0, 0, 40, 40);
    test.endFill();
    test.position.set(1280 / 2, 800 / 2);
    test.zIndex = 2;

    this.stage.addChild(test);

    gsap.to(this.stage, { alpha: 1, duration: 1 });
  }

  /** @description 탭이 안보일 때  */
  onHiddenTab() {
    console.log('탭이 안보일 때');
  }

  /**  @description 탭이 보일 때 */
  onViewTab() {
    console.log('탭이 보일 때');
  }
}
