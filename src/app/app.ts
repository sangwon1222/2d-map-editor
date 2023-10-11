import * as PIXI from 'pixijs';
import SceneManager from '@app/sceneManager';
import Scene from '@app/scene/scene';
import { registVisibleChange } from '@/util';
import gsap from 'gsap';
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
    this.renderer.options.antialias = true;
    App.handle = this;
  }

  /** @description application 초기 세팅  */
  async init() {
    this.stage.alpha = 0;
    this.stage.removeChildren();
    this.mSceneManager = new SceneManager();
    this.stage.addChild(this.mSceneManager);
    this.stage.sortableChildren = true;
    this.mSceneManager.zIndex = 1;

    registVisibleChange();

    await this.mSceneManager.init();
    await this.mSceneManager.start();
  }

  async startInit() {
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
