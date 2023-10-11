import Application from '@app/app';
import * as PIXI from 'pixijs';
import { productLink, devLink } from '@/util/config';

export class rscManager {
  private static handle: rscManager;
  private mRscObject: TypeObjectAny;

  static get getHandle(): rscManager {
    const handle = rscManager.handle ? rscManager.handle : new rscManager();
    return handle;
  }

  get getRscList() {
    return this.mRscObject;
  }

  constructor() {
    rscManager.handle = this;
    this.mRscObject = {};
  }

  /**
   * @param src 리소스
   * @param common 여러 씬에서 공동으로 쓰일 경우 true, 아니면 안넣어줘도 된다.
   */
  public async loadRsc(src: string, sceneName?: string) {
    const currentSceneName = Application.getHandle.getScene?.info?.name;
    const scene = sceneName ? sceneName : currentSceneName;

    if (this.mRscObject[`${scene}/${src}`]) return;

    PIXI.Assets.add(`${scene}/${src}`, src);
    const isProduct = process.env.NODE_ENV === 'production';
    const link = isProduct ? productLink : devLink;

    try {
      this.mRscObject[`${scene}/${src}`] = await PIXI.Assets.load(`${link}/rsc/${sceneName}/img/${src}`);
    } catch (e) {
      console.error(e);
    }
  }

  /** @description 배열로 리소스 리스트를 보내주면 모든 리소스 로드하는 함수 */
  public async loadAllRsc(rscInfoAry: TypeObjectStringAry) {
    const sceneName = Application.getHandle.getScene?.info?.name;
    for (const src of rscInfoAry.img) {
      await this.loadRsc(src, sceneName);
    }
  }

  public async loadCommonRsc(rscInfoAry: TypeObjectStringAry) {
    for (const src of rscInfoAry.img) {
      await this.loadRsc(src, 'common');
    }
  }

  /**
   * @param srcKey 리소스 이름 ex) bomb.png, bomb.gif
   * @param common 공동으로 쓰이고 있으면 true, 없으면 안넣어줘도 된다.
   * @returns
   */
  public getRsc(srcKey: string, common?: boolean) {
    const sceneName = common ? 'common' : Application.getHandle.getScene?.info?.name;
    const key = `${sceneName}/${srcKey}`;

    return this.mRscObject[key];
  }
}
