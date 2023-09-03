import { create } from 'zustand';

interface LoadingState {
  loading: boolean;
  openLoading: () => void;
  closeLoading: () => void;
}

const useGlobalLoading = create<LoadingState>((set, get) => ({
  loading: false,
  openLoading: () => {
    set({ loading: true });
  },

  closeLoading: () => {
    set({ loading: false });
  },
}));

export default useGlobalLoading;
