import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import request from '~/app/api';
import { AuthState, RW, RoleAuthority } from './type';
import useLayoutStore from '../layout';
import useFlowStore from '../flow';
import useManagerStore from '../manager';
import useMessageStore from '../message';

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
      selectLoginShop: ({ accessToken, user, currentShopWithRole }) => {
        useManagerStore.getState().requestGetTemplates();
        useManagerStore.getState().requestGetRoles();
        useManagerStore.getState().requestGetShops();
        useFlowStore.getState().requestGetInitializeData();
        useMessageStore.getState().requestMessages();
        set({
          accessToken,
          user,
          currentShopWithRole,
        });
      },
      login: async (username: string, password: string) => {
        return new Promise((resolve, reject) => {
          request
            .post('/auth/login', { username, password })
            .then((res) => {
              const { accessToken, ...rest } = res.data;
              const user = { ...rest };

              if (user.shopsWithRole.length == 0) {
                reject({
                  code: 403,
                  message: '当前登录用户所有角色没有配置任何权限',
                });
              } else if (user.shopsWithRole.length == 1) {
                // 直接登录
                set({
                  accessToken: accessToken,
                  user: { ...rest },
                  currentShopWithRole: user.shopsWithRole[0],
                });
                useLayoutStore.getState().clearCache();
                useManagerStore.getState().requestGetTemplates();
                useManagerStore.getState().requestGetRoles();
                useManagerStore.getState().requestGetShops();
                useFlowStore.getState().requestGetInitializeData();

                resolve({
                  accessToken: accessToken,
                  user: { ...rest },
                  shouldChooseShops: false,
                });
              } else {
                useLayoutStore.getState().clearCache();
                // 选择店铺
                resolve({
                  accessToken: accessToken,
                  user: { ...rest },
                  shouldChooseShops: true,
                });
              }
            })
            .catch((err) => {
              reject(err);
            });
        });
      },
      changeCurrentShopWithRole: async (shopWithRole) => {
        set({ currentShopWithRole: shopWithRole });

        useLayoutStore.getState().clearCache();
        useFlowStore.getState().clearCache();
        useManagerStore.getState().clearCache();
        useMessageStore.getState().clearCache();

        useMessageStore.getState().requestMessages();
        await useFlowStore.getState().requestGetInitializeData();
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
        useFlowStore.getState().clearCache();
        useManagerStore.getState().clearCache();
        useMessageStore.getState().clearCache();
      },
    }),
    {
      name: 'local-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useAuthStore;
