import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import useAuthStore from '../auth';
import { LayoutConfig } from '~/app/constants';
import { LayoutConfigWithRole } from './type';
import { AuthorityConfig, RoleAuthority } from '../auth/type';
import { ShopType } from '../manager/type';

const getFilteredLayoutConfig = (
  authorityConfig: AuthorityConfig[],
  isCenter: boolean,
) => {
  const filteredConfig = LayoutConfig.map((tab) => {
    const features = tab.features.filter((feature) => {
      const featureAuthority = feature.auth;
      return authorityConfig.some(
        (authority) => authority.authority == featureAuthority,
      );
    });
    return { ...tab, features };
  }).filter((tab) => tab.features.length > 0);

  const f0 = filteredConfig[0];
  if (isCenter && f0.text == '门店') {
    filteredConfig[0].featureSelected = f0.features.findIndex((item) => {
      return item.auth == RoleAuthority.FLOW_ANALYZE;
    });
  }

  return filteredConfig;
};

const initialState = {
  layoutConfig: [],
  currentSelected: 0,
};

const useLayoutStore = create(
  immer<LayoutConfigWithRole>((set, get) => ({
    ...initialState,
    clearCache: () => {
      set({ ...initialState });
    },
    getLayoutConfig: () => {
      if (get().layoutConfig.length > 0) {
        return get().layoutConfig;
      }
      const currentShopWithRole = useAuthStore.getState().currentShopWithRole;

      if (!currentShopWithRole) {
        // 重新登录
        useAuthStore.getState().logout();
        return [];
      }

      if (!currentShopWithRole) {
        set({ layoutConfig: [] });
        return [];
      }

      const filterConfig = getFilteredLayoutConfig(
        currentShopWithRole?.role.authorities,
        currentShopWithRole.shop.type === ShopType.CENTER,
      );

      set((state) => {
        state.layoutConfig = filterConfig;
      });

      return filterConfig;
    },
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

export default useLayoutStore;
