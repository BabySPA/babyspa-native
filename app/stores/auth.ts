import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import request from '~/app/api';

interface AuthState {
  accessToken: string | null;
  user: {
    name: string;
    username: string;
    phoneNumber: string;
    shop: {
      id: string;
      name: string;
      region: string;
      address: string;
    };
    role: {
      id: string;
      name: string;
      authorities: string;
    };
  } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

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
              set({ accessToken: accessToken, user: { ...rest } });
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
    }),
    {
      name: 'local-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useAuthStore;
