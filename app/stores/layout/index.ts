import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import useAuthStore from '../auth';
import { LayoutConfig } from '~/app/constants';
import { LayoutConfigWithRole } from './type';
import { AuthorityConfig } from '../auth/type';

const getFilteredLayoutConfig = (authorityConfig: AuthorityConfig[]) => {
  const filteredConfig = LayoutConfig.map((tab) => {
    const features = tab.features.filter((feature) => {
      const featureAuthority = feature.auth;
      return authorityConfig.some(
        (authority) => authority.authority == featureAuthority,
      );
    });
    return { ...tab, features };
  }).filter((tab) => tab.features.length > 0);

  return filteredConfig;
};

export default create(
  immer<LayoutConfigWithRole>((set, get) => ({
    layoutConfig: [],
    getLayoutConfig: () => {
      if (get().layoutConfig.length > 0) {
        return get().layoutConfig;
      }
      const user = useAuthStore.getState().user;

      if (!user) {
        set({ layoutConfig: [] });
        return [];
      }
      if (user.isGlobalAdmin) {
        set({ layoutConfig: LayoutConfig });
        return LayoutConfig;
      }

      const filterConfig = getFilteredLayoutConfig(user?.role.authorities);

      set({ layoutConfig: filterConfig });
      return filterConfig;
    },
    currentSelected: 0,
    changeCurrentSelected: (index: number) => {
      set({ currentSelected: index });
    },
    changeFeatureSelected: (index: number) => {
      return set((state) => {
        state.layoutConfig[state.currentSelected].featureSelected = index;
      });
    },
  })),
);
