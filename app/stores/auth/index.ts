import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import request from '~/app/api';
import { AuthState, RW, RoleAuthority } from './type';

const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      accessToken: null,
      user: null,
      login: async (username: string, password: string) => {
        return new Promise((resolve, reject) => {
          request
            .post('/auth/login', { username, password })
            .then((res) => {
              const { accessToken, ...rest } = res.data;
              const user = { ...rest };
              const isGlobalAdmin =
                user?.role?.authorities.findIndex(
                  (item: any) => item.authority === RoleAuthority.ALL,
                ) !== -1;
              set({
                accessToken: accessToken,
                user: { ...rest, isGlobalAdmin },
              });
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        });
      },
      logout: async () => {
        set({ accessToken: null, user: null });
        return Promise.resolve();
      },
      hasAuthority: (authorityKey: RoleAuthority, rw: RW) => {
        console.log(authorityKey, rw);
        if (get().user?.isGlobalAdmin) {
          return true;
        }
        return (
          get().user?.role.authorities.findIndex((item, index) => {
            if (item.authority === authorityKey) {
              if (rw === 'R') {
                return true;
              } else {
                return item.rw === rw;
              }
            }
            return false;
          }) !== -1
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
