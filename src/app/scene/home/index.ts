import { useAuthStore } from '@/store/auth';
import { canvasInfo } from '@/util/config';
import { useMapStore } from '@/store/map';
import CharacterLayout from './character';
import MapLayout, { Tile } from './mapLayout';
import MapApi from '@/api/map';
import * as PIXI from 'pixijs';
import Scene from '../scene';
import gsap from 'gsap';
import { useSocketStore } from '@/store/socket';
import { SocketIo } from '@/socket';
import { useLayoutStore } from '@/store/layout';
import { debounce } from 'lodash-es';

const { tileScale } = canvasInfo;

export default class Home extends Scene {
  private mMapLayout: MapLayout;
  private mMoveTimer: gsap.core.Timeline;
  private mMoveTimeline: { [key: string]: gsap.core.Timeline };
  private mMovingCharacter: { [key: number]: CharacterLayout };
  private mBackupPoint: number[];

  get moveTimer(): gsap.core.Timeline {
    return this.mMoveTimer;
  }

  constructor(sceneId: number, name: string) {
    super(sceneId, name);
    this.mMovingCharacter = {};
    this.mMoveTimeline = {};
  }

  async init() {
    useLayoutStore.isLoading = true;
    this.sortableChildren = true;
    this.mBackupPoint = [0, 0];
    this.mMapLayout = new MapLayout();
    await this.mMapLayout.init();
    this.mMapLayout.zIndex = 1;
    this.addChild(this.mMapLayout);

    this.mMapLayout.handlePointerDown = debounce(
      async (e: PIXI.FederatedPointerEvent, destinations: number[]) => {
        if (destinations[0] == this.mBackupPoint[0] && destinations[1] == this.mBackupPoint[1]) return;
        this.mBackupPoint = destinations;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        await this.socketMoving(useAuthStore.userID, destinations);
      },
      500,
      { leading: false, trailing: true },
    );

    useSocketStore.socket = new SocketIo();
    await useSocketStore.socket.init();
  }

  async insertUser(users: { nickname: number[] }) {
    const nicknameList = Object.keys(users);
    for (let i = 0; i < nicknameList.length; i++) {
      const nickname = nicknameList[i];
      const path = users[nicknameList[i]];
      if (this.mMovingCharacter[nickname]) {
        this.removeChild(this.mMovingCharacter[nickname]);
        delete this.mMovingCharacter[nickname];
      }
      this.mMovingCharacter[nickname] = new CharacterLayout(path, nickname);
      await this.mMovingCharacter[nickname].init();
      this.mMovingCharacter[nickname].zIndex = 2;
      this.mMovingCharacter[nickname].position.set(tileScale, tileScale);
      this.addChild(this.mMovingCharacter[nickname]);
    }

    useLayoutStore.isLoading = false;
  }

  async updateUserPos(users: { nickname: string; path: number[] }[]) {
    console.log('update-user-pos', users);
  }

  async startGame() {
    console.log('start', this.info);
  }

  async socketMoving(nickname: string, destinations: number[]) {
    useSocketStore.socket.emit('remove-prev-move', { nickname: useAuthStore.userID });
    this.mMoveTimeline[nickname]?.kill();
    const character = this.mMovingCharacter[nickname];
    if (!character) return;
    const [x, y] = [Math.round(character.x / tileScale), Math.round(character.y / tileScale)];
    const { ok, data } = await MapApi.getMovePath(useMapStore.mapData, [x, y], destinations);
    if (ok) {
      useSocketStore.socket.emit('user-move', { nickname: useAuthStore.userID, pathList: data });
    }
  }

  async move(nickname: string, path: number[], prev: number[]) {
    if (this.mMoveTimeline[nickname]) this.mMoveTimeline[nickname].kill();
    this.mMoveTimeline[nickname] = null;
    const character = this.mMovingCharacter[nickname];
    if (!character) return;
    const x = Math.ceil(character.x / tileScale);
    const y = Math.ceil(character.y / tileScale);

    const characterPos = [x, y];
    this.mMoveTimeline[nickname] = gsap.timeline();
    this.mMoveTimeline[nickname].fromTo(
      character,
      { x: prev[0] * tileScale, y: prev[1] * tileScale },
      {
        x: path[0] * tileScale,
        y: path[1] * tileScale,
        duration: 0.15,
        onStart: () => {
          if (path[1] > characterPos[1]) character.changeDirection('front');
          if (path[1] < characterPos[1]) character.changeDirection('back');
          if (path[0] > characterPos[0]) character.changeDirection('right');
          if (path[0] < characterPos[0]) character.changeDirection('left');
        },
        onComplete: () => {
          character.position.set(path[0] * tileScale, path[1] * tileScale);
          character.pos = path;
        },
        ease: 'none',
      },
    );
  }

  leaveUser(nickname: string) {
    this.removeChild(this.mMovingCharacter[nickname]);
    delete this.mMovingCharacter[nickname];
  }
}
