import { create } from 'zustand';
import request from '~/app/api';
import { immer } from 'zustand/middleware/immer';
import { ManangerState } from './type';

const useManagerStore = create(
  immer<ManangerState>((set, get) => ({
    shops: [],
    currentShop: null,
    requestGetShops: async () => {
      const { data } = await request.get('/shops');
      set((state) => {
        state.shops = data;
      });
    },
    setCurrentShop: (shop) => {
      set((state) => {
        state.currentShop = shop;
      });
    },
    // register: defaultRegisterAndCollection,
    // updateEvaluate: (evaluate) => {
    //   return set((state) => {
    //     state.currentFlow.evaluate = {
    //       ...state.currentFlow.evaluate,
    //       ...evaluate,
    //     };
    //   });
    // },
  })),
);

export default useManagerStore;
