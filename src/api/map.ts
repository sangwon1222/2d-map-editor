import axiosApi from './index';

class MapApi {
  getMap = async () => {
    try {
      const { data } = await axiosApi.get('map/get-map');
      return data;
    } catch (e) {
      console.error('get-map ERROR', e);
      return { ok: false, msg: e.message ? e.message : '' };
    }
  };

  getMovePath = async (mapData, startPos: number[], endPos: number[]) => {
    try {
      const { data } = await axiosApi.post('map/move-character', { mapData, startPos, endPos });
      return data;
    } catch (e) {
      console.error('map/move-character ERROR', e);
      return { ok: false, msg: e.message ? e.message : '' };
    }
  };
}

export default new MapApi();
