export const canvasInfo: Readonly<TypeCanvasInfo> = {
  backgroundColor: 0x000000,
  width: 1400,
  height: 800,
  tileScale: 50,
  tileMap: Array.from({ length: 16 }, () => Array.from({ length: 26 }, () => 'floor-1.png')),
};

export const productLink = 'http://lsw.kr/';
export const devLink: string = location.href;
