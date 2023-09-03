import { create } from 'zustand';

interface LoadingState {
  loading: boolean;
  spinner: boolean;
  openLoading: (spinner?: boolean) => void;
  closeLoading: () => void;
}

const useGlobalLoading = create<LoadingState>((set, get) => ({
  loading: false,
  spinner: true,
  openLoading: (spinner?: boolean) => {
    set({ loading: true, spinner: spinner ?? true });
  },

  closeLoading: () => {
    set({ loading: false, spinner: true });
  },
}));

export default useGlobalLoading;
