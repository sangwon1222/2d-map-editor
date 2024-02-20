import { rscManager } from '@/app/resource/resourceManager';
import { canvasInfo } from '@/util/config';
import characterSheet from 'public/rsc/home/img/character-1.json';
import * as PIXI from 'pixijs';

export default class CharacterLayout extends PIXI.Container {
  private mCharacter: Character;
  private mPos: number[];
  private mNickname: string;

  get pos(): number[] {
    return this.mPos;
  }
  set pos(v: number[]) {
    this.mPos = v;
  }
  get nickname(): string {
    return this.mNickname;
  }
  constructor(pos: number[], nickname: string) {
    super();
    this.mPos = pos;
    this.mNickname = nickname;
  }

  async init() {
    this.mCharacter = new Character('character-1', this.mNickname);
    await this.mCharacter.init();
    this.addChild(this.mCharacter);
  }

  changeDirection(direction: 'front' | 'back' | 'left' | 'right') {
    this.mCharacter.changeDirection(direction);
  }
}

class Character extends PIXI.Container {
  private mTextures: PIXI.Spritesheet;
  private mCharacter: PIXI.Sprite;

  private mUserIDContainer: PIXI.Container;
  private mUserID: string;

  constructor(name: string, userID: string) {
    super();
    this.mUserID = userID;
  }

  async init() {
    await this.createCharacter();
    await this.createuserID();
  }

  async createCharacter() {
    this.mTextures = new PIXI.Spritesheet(rscManager.getHandle.getRsc('character-1.png'), characterSheet);
    await this.mTextures.parse();
    this.mCharacter = new PIXI.Sprite(this.mTextures.textures['front']);
    this.addChild(this.mCharacter);
  }

  async createuserID() {
    this.mUserIDContainer = new PIXI.Container();
    const bg = new PIXI.Graphics();
    bg.beginFill(0x000000, 0.4);
    bg.drawRect(0, 0, canvasInfo.tileScale, 30);
    bg.endFill();
    bg.y = canvasInfo.tileScale;
    const userID = new PIXI.Text(this.mUserID, { fill: 0xffffff });
    userID.anchor.set(0.5);
    userID.position.set(canvasInfo.tileScale / 2, canvasInfo.tileScale + 14);
    this.mUserIDContainer.addChild(bg, userID);
    this.addChild(this.mUserIDContainer);
  }

  changeDirection(direction: 'front' | 'back' | 'left' | 'right') {
    switch (direction) {
      case 'front':
        this.mCharacter.texture = this.mTextures.textures['front'];
        break;
      case 'back':
        this.mCharacter.texture = this.mTextures.textures['back'];
        break;
      case 'left':
        this.mCharacter.texture = this.mTextures.textures['left'];
        break;
      case 'right':
        this.mCharacter.texture = this.mTextures.textures['right'];
        break;
    }
  }
}
