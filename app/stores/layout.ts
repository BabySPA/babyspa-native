import { create } from 'zustand';
import Register from '../screens/home/fragments/register';
import Collection from '../screens/home/fragments/collection';
import Analyze from '../screens/home/fragments/analyze';
import Feedback from '../screens/home/fragments/feedback';
import FollowUpVisit from '../screens/home/fragments/follow-up-visit';
import Archive from '../screens/home/fragments/archive';
import ShopCenter from '../screens/home/fragments/archive';
import StatisticsVisit from '../screens/home/fragments/statistics-visit';
import StatisticsShop from '../screens/home/fragments/statistics-shop';
import StatisticsMassage from '../screens/home/fragments/statistics-massage';
import { ImageSourcePropType } from 'react-native';
import { immer } from 'zustand/middleware/immer';
import useAuthStore from './auth';
import { AuthorityConfig, RoleAuthority } from './auth/type';

interface ILayoutConfig {
  image: ImageSourcePropType;
  selectedImage: ImageSourcePropType;
  text: string;
  featureSelected: number;
  features: {
    text: string;
    fragment: () => JSX.Element;
    auth: RoleAuthority;
  }[];
}

type LayoutConfigWithRole = {
  layoutConfig: ILayoutConfig[];
  getLayoutConfig: () => ILayoutConfig[];
  currentSelected: number;
  changeCurrentSelected: (index: number) => void;
  changeFeatureSelected: (index: number) => void;
};

const getFilteredLayoutConfig = (authorityConfig: AuthorityConfig[]) => {
  const filteredConfig = LayoutConfig.map((tab) => {
    const features = tab.features.filter((feature) => {
      const featureAuthority = feature.auth;
      return authorityConfig.some(
        (authority) => authority.authority === featureAuthority,
      );
    });
    return { ...tab, features };
  }).filter((tab) => tab.features.length > 0);

  return filteredConfig;
};

const LayoutConfig: ILayoutConfig[] = [
  {
    image: require('~/assets/images/tab_01.png'),
    selectedImage: require('~/assets/images/tab_01_selected.png'),
    text: '门店',
    featureSelected: 0,
    features: [
      {
        text: '登记',
        fragment: Register,
        auth: RoleAuthority.FLOW_REGISTER,
      },
      {
        text: '信息采集',
        fragment: Collection,
        auth: RoleAuthority.FLOW_COLLECTION,
      },
      {
        text: '信息分析',
        fragment: Analyze,
        auth: RoleAuthority.FLOW_ANALYZE,
      },
      {
        text: '信息反馈',
        fragment: Feedback,
        auth: RoleAuthority.FLOW_FEEDBACK,
      },
    ],
  },
  {
    image: require('~/assets/images/tab_02.png'),
    selectedImage: require('~/assets/images/tab_02_selected.png'),
    text: '客户',
    featureSelected: 0,
    features: [
      {
        text: '客户档案',
        fragment: Archive,
        auth: RoleAuthority.CUSTOMER_ARCHIVE,
      },
      {
        text: '客户随访',
        fragment: FollowUpVisit,
        auth: RoleAuthority.CUSTOMER_FOLLOWUP,
      },
    ],
  },
  {
    image: require('~/assets/images/tab_03.png'),
    selectedImage: require('~/assets/images/tab_03_selected.png'),
    text: '管理',
    featureSelected: 0,
    features: [
      {
        text: '门店中心',
        fragment: ShopCenter,
        auth: RoleAuthority.MANAGER_SHOP,
      },
    ],
  },
  {
    image: require('~/assets/images/tab_04.png'),
    selectedImage: require('~/assets/images/tab_04_selected.png'),
    text: '统计',
    featureSelected: 0,
    features: [
      {
        text: '门店统计',
        fragment: StatisticsShop,
        auth: RoleAuthority.STATISTIC_SHOP,
      },
      {
        text: '调理统计',
        fragment: StatisticsMassage,
        auth: RoleAuthority.STATISTIC_MASSAGE,
      },
      {
        text: '分析统计',
        fragment: StatisticsVisit,
        auth: RoleAuthority.STATISTIC_ANALYZE,
      },
      {
        text: '随访统计',
        fragment: StatisticsVisit,
        auth: RoleAuthority.STATISTIC_FOLLOWUP,
      },
    ],
  },
];

export default create(
  immer<LayoutConfigWithRole>((set, get) => ({
    layoutConfig: [],
    getLayoutConfig: () => {
      if (get().layoutConfig.length > 0) {
        return get().layoutConfig;
      }
      const user = useAuthStore.getState().user;
      if (!user) {
        return [];
      }
      if (user.isGlobalAdmin) {
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
        state.getLayoutConfig()[state.currentSelected].featureSelected = index;
      });
    },
  })),
);
