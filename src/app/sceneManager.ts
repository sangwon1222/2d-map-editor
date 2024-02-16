import * as PIXI from 'pixijs';
import Scene from '@app/scene/scene';
import { rscManager } from '@app/resource/resourceManager';
import rsc from '@app/resource/resouce.json';
import { useLayoutStore } from '@store/layout';
import Home from '@/app/scene/home';
import { find } from 'lodash-es';

export default class SceneManager extends PIXI.Container {
  private mSceneAry: Array<Scene>;
  private mCurrentSceneIdx: number;

  get currentScene(): Scene {
    return this.mSceneAry[this.mCurrentSceneIdx];
  }

  get currentSceneInfo(): TypeSceneInfo {
    return this.mSceneAry[this.mCurrentSceneIdx].info;
  }

  constructor() {
    super();

    this.mSceneAry = [];
    this.mCurrentSceneIdx = 0;
  }

  async init() {
    this.mCurrentSceneIdx = 0;
    this.mSceneAry = [new Home(0, 'home')];
  }

  async start() {
    const { name } = this.mSceneAry[0].info;
    try {
      await rscManager.getHandle.loadCommonRsc(rsc.common);
      await rscManager.getHandle.loadAllRsc(rsc[name]);
    } catch (e) {
      console.log(e);
      location.replace(location.origin);
    }
    await this.changeScene(name);
  }

  async changeScene(sceneName: string) {
    console.log(`--we go [${sceneName}]`);

    await rscManager.getHandle.loadAllRsc(rsc[sceneName]);
    useLayoutStore.isLoading = true;
    this.removeChildren();
    await this.mSceneAry[this.mCurrentSceneIdx]?.endGame();
    const scene = find(this.mSceneAry, (e) => sceneName === e.info.name);
    await scene.init();
    this.addChild(scene);
    await scene.startGame();
    useLayoutStore.isLoading = false;
  }
}
