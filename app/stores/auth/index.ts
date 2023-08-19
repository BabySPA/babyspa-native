import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import request from '~/app/api';
import { AuthState, RW, RoleAuthority, ShopsWithRole } from './type';
import { generateMixinRoles } from '~/app/utils';
import useLayoutStore from '../layout';
import useFlowStore from '../flow';
import useManagerStore from '../manager';

const initialState = {
  accessToken: null,
  user: null,
  currentShopWithRole: null,
};

const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      ...initialState,
      clearCache: () => {
        set({ ...initialState });
      },
      login: async (username: string, password: string) => {
        return new Promise((resolve, reject) => {
          request
            .post('/auth/login', { username, password })
            .then((res) => {
              const { accessToken, ...rest } = res.data;
              const user = { ...rest };
              set({
                accessToken: accessToken,
                user: { ...rest },

                currentShopWithRole: {
                  shop: user.shopsWithRole[0].shop,
                  role: generateMixinRoles(user.shopsWithRole[0].roles),
                },
              });

              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        });
      },
      setCurrentShopWithRole: (shopId: string) => {
        const user = get().user;
        const idx = user?.shopsWithRole.findIndex(
          (item) => item.shop._id === shopId,
        );
        if (idx) {
          set({ currentShopWithRole: user?.shopsWithRole[idx] });
        } else {
          console.log('切换门店失败！');
        }
      },
      logout: async () => {
        get().clearAllStoreCache();
        return Promise.resolve();
      },
      hasAuthority: (authorityKey: RoleAuthority, rw: RW) => {
        return (
          get().currentShopWithRole?.role.authorities.findIndex(
            (item, index) => {
              if (item.authority === authorityKey) {
                if (rw === 'R') {
                  return true;
                } else {
                  return item.rw === rw;
                }
              }
              return false;
            },
          ) !== -1
        );
      },
      clearAllStoreCache: () => {
        useAuthStore.getState().clearCache();
        useLayoutStore.getState().clearCache();
        useFlowStore.getState().clearCache();
        useManagerStore.getState().clearCache();
      },
    }),
    {
      name: 'local-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useAuthStore;
