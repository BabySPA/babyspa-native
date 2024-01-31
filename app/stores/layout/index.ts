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
  let featureSelected = 0;
  const filterConfig = LayoutConfig.map((tab) => {
    const features = tab.features.filter((feature) => {
      const featureAuthority = feature.auth;
      return authorityConfig.some(
        (authority) => authority.authority == featureAuthority,
      );
    });
    return { ...tab, features };
  }).filter((tab) => tab.features.length > 0);

  const f0 = filterConfig[0];
  if (isCenter && f0.text == '门店') {
    featureSelected = f0.features.findIndex((item) => {
      return item.auth == RoleAuthority.FLOW_ANALYZE;
    });
  }

  return { filterConfig, featureSelected };
};

const initialState = {
  layoutConfig: [],
  currentSelected: 0,
  featureSelected: 0,
  originFeatureSelected: 0,
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

      const { filterConfig, featureSelected } = getFilteredLayoutConfig(
        currentShopWithRole?.role.authorities,
        currentShopWithRole.shop.type === ShopType.CENTER,
      );

      set((state) => {
        state.layoutConfig = filterConfig;
        state.featureSelected = featureSelected;
        state.originFeatureSelected = featureSelected;
      });

      return filterConfig;
    },
    changeCurrentSelected: (index: number) => {
      set((state) => {
        state.currentSelected = index;
        state.featureSelected = index === 0 ? state.originFeatureSelected : 0;
      });
    },
    changeFeatureSelected: (index: number) => {
      set({ featureSelected: index });
    },
  })),
);

export default useLayoutStore;
