import { rscManager } from '@/app/resource/resourceManager';
import * as PIXI from 'pixijs';

export default class CharacterLayout extends PIXI.Container {
  private mCharacter: Character;
  constructor() {
    super();
  }

  async init() {
    this.mCharacter = new Character('character-1');
    await this.mCharacter.init();
    this.addChild(this.mCharacter);
  }

  changeDirection(direction: 'l' | 'r' | 'b-l' | 'b-r') {
    this.mCharacter.changeDirection(direction);
  }
}

class Character extends PIXI.Container {
  private mTextures: {
    front: { left: PIXI.Texture; right: PIXI.Texture };
    back: { left: PIXI.Texture; right: PIXI.Texture };
  };
  private mCharacter: PIXI.Sprite;
  constructor(name: string) {
    super();
    this.mTextures = {
      front: {
        left: rscManager.getHandle.getRsc(`${name}-l.png`),
        right: rscManager.getHandle.getRsc(`${name}-r.png`),
      },
      back: {
        left: rscManager.getHandle.getRsc(`${name}-b-l.png`),
        right: rscManager.getHandle.getRsc(`${name}-b-r.png`),
      },
    };
  }

  async init() {
    this.mCharacter = new PIXI.Sprite();
    this.mCharacter.texture = this.mTextures.front.right;
    this.addChild(this.mCharacter);
  }

  changeDirection(direction: 'l' | 'r' | 'b-l' | 'b-r') {
    switch (direction) {
      case 'l':
        this.mCharacter.texture = this.mTextures.front.left;
        break;
      case 'r':
        this.mCharacter.texture = this.mTextures.front.right;
        break;
      case 'b-l':
        this.mCharacter.texture = this.mTextures.back.left;
        break;
      case 'b-r':
        this.mCharacter.texture = this.mTextures.back.right;
        break;
    }
  }
}
