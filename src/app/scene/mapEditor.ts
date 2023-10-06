import Scene from '@app/scene/scene';

/**
 * @params {number} - scene id
 * @params {string} - scene name
 */
export default class MapEditor extends Scene {
  constructor(sceneId: number, name: string) {
    super(sceneId, name);
    console.log('map-editor 정보: ', this.info);
  }
}
