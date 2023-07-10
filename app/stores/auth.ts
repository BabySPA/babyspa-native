import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import request from "~/app/api";

interface AuthState {
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      accessToken: null,
      // setAuthority: (token) => set({ token }),
      login: async (username: string, password: string) => {
        // set({ accessToken: "123" });
        request
          .post("/auth/login", {
            username,
            password,
          })
          .then((res) => {
            const { accessToken } = res.data;
            set({ accessToken: accessToken });
            return Promise.resolve();
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      },
      logout: async () => {
        set({ accessToken: null });
        return Promise.resolve();
      },
    }),
    {
      name: "local-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
