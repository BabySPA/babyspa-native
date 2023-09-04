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

const initialState = {
  defaultFollowUpSelectShop: { name: '', _id: '' },
  layoutConfig: [],
  currentSelected: 0,
};

export default create(
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
      );

      set({ layoutConfig: filterConfig });
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

    enterToFollowUp: (shop) => {
      if (shop) {
        set({ defaultFollowUpSelectShop: shop });
      }

      const layoutConfig = get().getLayoutConfig();
      const whereCustomerIdx = layoutConfig.findIndex(
        (item) => item.text === '客户',
      );
      if (whereCustomerIdx === -1) {
        return;
      }
      const whereFollowUpIdx = layoutConfig[
        whereCustomerIdx
      ].features.findIndex((item) => item.text === '客户随访');
      if (whereFollowUpIdx === -1) {
        return;
      }

      get().changeCurrentSelected(whereCustomerIdx);
      get().changeFeatureSelected(whereFollowUpIdx);
    },
  })),
);
