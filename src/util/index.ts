import App from '@/app/app';
import crypto from 'crypto-js';
import { canvasInfo } from '@/util/config';

export const resize = (canvasElement: HTMLCanvasElement) => {
  if (!canvasElement) return;
  const { width, height } = canvasInfo;
  const screenRate = innerWidth / innerHeight;
  const canvasRate = width / height;

  const changeWidth = screenRate > canvasRate ? innerHeight * canvasRate : innerWidth;
  const changeHeight = screenRate > canvasRate ? innerHeight * canvasRate : innerWidth / canvasRate;
  canvasElement.setAttribute('style', `width:${changeWidth}px; height: ${changeHeight}px;`);
};

export const setEncode = (data: string, secretKey: string) => {
  if (!data) return null;
  const byte = crypto.AES.encrypt(JSON.stringify(data), secretKey);
  const encode = byte.toString();
  return encode;
};

export const setDecode = (data: string, secretKey: string) => {
  if (!data) return null;
  const byte = crypto.AES.decrypt(data, secretKey);
  const decode = byte.toString(crypto.enc.Utf8);
  return JSON.parse(decode);
};

export const getDegree = (y: number, x: number) => {
  return (Math.atan2(y, x) * 180) / Math.PI;
};

export const getCoordinate = (moveX, moveY, distance, degree) => {
  const x = Math.cos(degree) * distance - moveX;
  const y = Math.sin(degree) * distance - moveY;
  return { x, y };
};

export const getDistance = (y1: number, y2: number, x1: number, x2: number) => {
  return Math.round(Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)));
};

/**
 * @description 탭이 안보일 때 => onHiddenTab()
 * @description 탭이 보일 때 => onViewTab()
 * */
export const registVisibleChange = () => {
  document.addEventListener('visibilitychange', () => {
    const isHidden = document.hidden;
    if (isHidden) App.getHandle.onHiddenTab();
    if (!isHidden) App.getHandle.onViewTab();
  });
};

export const getTime = () => {
  const date = new Date();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  const hour = `0${date.getHours()}`.slice(-2);
  const minute = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);

  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${seconds}`;
};
