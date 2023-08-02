import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import request from '~/app/api';
import { AuthState, RW, RoleAuthority, ShopsWithRole } from './type';

const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      accessToken: null,
      user: null,
      currentShopWithRole: null,
      login: async (username: string, password: string) => {
        return new Promise((resolve, reject) => {
          request
            .post('/auth/login', { username, password })
            .then((res) => {
              const { accessToken, ...rest } = res.data;
              const user = { ...rest };
              user.shopsWithRole = user.shopsWithRole.map(
                (item: ShopsWithRole) => ({
                  ...item,
                  isGlobalAdmin:
                    item?.role?.authorities.findIndex(
                      (item) => item.authority === RoleAuthority.ALL,
                    ) !== -1,
                }),
              );

              set({
                accessToken: accessToken,
                user: { ...rest },
                currentShopWithRole: user.shopsWithRole[0],
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
        set({ accessToken: null, user: null });
        return Promise.resolve();
      },
      hasAuthority: (authorityKey: RoleAuthority, rw: RW) => {
        if (get().currentShopWithRole?.isGlobalAdmin) {
          return true;
        }
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
    }),
    {
      name: 'local-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useAuthStore;
