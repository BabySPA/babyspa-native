import { create } from 'zustand';

interface LoadingState {
  loading: boolean;
  spinner: boolean;
  loadingText: string;
  openLoading: (spinner?: boolean, loadingText?: string) => void;
  closeLoading: () => void;
}

const useGlobalLoading = create<LoadingState>((set, get) => ({
  loading: false,
  spinner: true,
  loadingText: '',
  openLoading: (spinner?: boolean, loadingText?: string) => {
    set({
      loading: true,
      spinner: spinner ?? true,
      loadingText: loadingText ?? '',
    });
  },

  closeLoading: () => {
    set({ loading: false, spinner: true });
  },
}));

export default useGlobalLoading;
