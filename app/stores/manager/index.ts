import { create } from 'zustand';
import request from '~/app/api';
import { immer } from 'zustand/middleware/immer';
import { ManangerState, ShopType } from './type';

export const DefaultShop = {
  name: '',
  maintainer: '',
  phoneNumber: '',
  region: '',
  address: '',
  openingTime: '',
  closingTime: '',
  description: '',
  type: ShopType.SHOP,
};

export const DefaultUser = {
  name: '',
  username: '',
  gender: 1,
  phoneNumber: '',
  idCardNumber: '',
  password: '',
  shop: {
    shopId: '',
    name: '',
  },
  role: {
    name: '',
    roleKey: '',
  },
  description: '',
};

const useManagerStore = create(
  immer<ManangerState>((set, get) => ({
    // shops
    shops: [],
    currentShop: DefaultShop,
    requestGetShops: async () => {
      const { data } = await request.get('/shops');
      set((state) => {
        state.shops = data;
      });
    },
    requestPostShop: () => {
      return request.post('/shops', get().currentShop);
    },
    requestPatchShop: async () => {
      const shop = get().currentShop;
      return request.patch(`/shops/${shop._id}`, get().currentShop);
    },
    setCurrentShop: (shop) => {
      set((state) => {
        state.currentShop = shop;
      });
    },

    // 员工
    users: [],
    currentUser: DefaultUser,
    requestGetUsers: async (shopId) => {
      const { data } = await request.get(`/users?shopId=${shopId}`);
      set((state) => {
        state.users = data;
      });
    },
    requestPostUser: () => {
      return request.post('/users', get().currentUser);
    },
    requestPatchUser: async () => {
      const shop = get().currentShop;
      return request.patch(`/users/${shop._id}`, get().currentUser);
    },
    requestPatchUserPassword: async (password) => {
      const user = get().currentUser;
      return request.patch(`/users/password/${user._id}`, { password });
    },
    setCurrentUser: (user) => {
      set((state) => {
        state.currentUser = user;
      });
    },
  })),
);

export default useManagerStore;
