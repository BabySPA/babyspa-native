import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import request from '~/app/api';
import { AuthState, RW, RoleAuthority } from './type';
import useLayoutStore from '../layout';
import useFlowStore from '../flow';
import useManagerStore from '../manager';
import { RoleStatus } from '../manager/type';

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

              if (
                user.currentShopWithRole.role.authorities.length == 0 &&
                user.currentShopWithRole.role.status === RoleStatus.CLOSE
              ) {
                // 当前登录用户没有任何权限
                reject({
                  code: 403,
                  message: '当前登录用户所有角色没有配置任何权限',
                });
                return;
              }

              set({
                accessToken: accessToken,
                user: { ...rest },

                currentShopWithRole: user.currentShopWithRole,
              });

              resolve({ accessToken, user });
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
