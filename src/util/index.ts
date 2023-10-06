import App from '@/app/app';
import { canvasInfo } from '@/util/config';

export const resize = (canvasElement: HTMLCanvasElement) => {
  if (!canvasElement) return;

  const { width, height } = canvasInfo;
  const screenRate = innerWidth / innerHeight;
  const canvasRate = width / height;

  if (screenRate > canvasRate) {
    canvasElement.style.width = `${innerHeight * canvasRate}px`;
    canvasElement.style.height = `${innerHeight}px`;
  } else {
    canvasElement.style.width = `${innerWidth}px`;
    canvasElement.style.height = `${innerWidth / canvasRate}px`;
  }
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
