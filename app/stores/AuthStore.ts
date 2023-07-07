import { create } from 'zustand';

interface AuthState {
  token: string | null;
  // setSession: (session: Session | null) => void;
  login: (email: string, password: string) => Promise<void>;
  // register: (
  //   email: string,
  //   password: string,
  // ) => Promise<User | AuthError | null>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  token: '123',
  // setAuthority: (token) => set({ token }),
  login: async (email, password) => {
    // if (!email) return Promise.reject('Email is required');
    // if (!password) return Promise.reject('Password is required');
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });
    // if (error) return Promise.reject(error);
    // set({ session: data.session });
    // return Promise.resolve(data.user);
    set({ token: '123' });
    return Promise.resolve();
  },
  logout: async () => {
    // if (error) return Promise.reject(error);
    set({ token: null });
    return Promise.resolve();
  },
}));

export default useAuthStore;
