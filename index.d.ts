declare interface TypeChatStore {
  socket: any;
  socketUserList: string[];
  mySocketId: string;
  myNickName: string;
  chatting: { chat: string; time: string; nickname: string }[];
}

declare interface TypeMapStore {
  mapJson: any;
}

declare interface TypeLayoutStore {
  isLoading: boolean;
  gnbMode: boolean;
}

declare interface TypeAppParms {
  backgroundColor: number;
  width: number;
  height: number;
  view: HTMLCanvasElement;
}

declare interface TypeCanvasInfo {
  backgroundColor: number;
  width: number;
  height: number;
  tileScale: number;
  tileMap: any;
}

declare interface TypeObjectAny {
  [key: string]: any;
}

declare interface TypeObjectStringAry {
  [key: string]: string[];
}

declare interface TypeSceneInfo {
  sceneId: number;
  name: string;
}
