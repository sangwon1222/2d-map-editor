import { canvasInfo } from './config';
const { tileScale } = canvasInfo;

export const getOneTilePoints = () => {
  return [
    /**1 */
    0,
    0,
    /**2 */
    tileScale,
    tileScale / 2,
    /**3 */
    0,
    tileScale,
    /**4 */
    -tileScale,
    tileScale / 2,
    /**5 */
    0,
    0,
  ];
};

export const getTileCubePoints = () => {
  return [
    /**1 */
    0,
    0,
    /**2 */
    tileScale,
    tileScale / 2,
    /**3 */
    tileScale,
    tileScale * 1.5,
    /**4 */
    0,
    tileScale * 2,
    /**5 */
    -tileScale,
    tileScale * 1.5,
    /**6*/
    -tileScale,
    tileScale / 2,
    /**7*/
    0,
    0,
  ];
};
