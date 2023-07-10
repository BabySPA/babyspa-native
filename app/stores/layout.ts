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

interface ILayoutConfig {
  image: ImageSourcePropType;
  selectedImage: ImageSourcePropType;
  text: string;
  featureSelected: number;
  features: {
    text: string;
    fragment: () => JSX.Element;
  }[];
}

type LayoutConfigWithRole = {
  layoutConfig: ILayoutConfig[];
  currentSelected: number;
  changeCurrentSelected: (index: number) => void;
  changeFeatureSelected: (index: number) => void;
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
      },
      {
        text: '信息采集',
        fragment: Collection,
      },
      {
        text: '信息分析',
        fragment: Analyze,
      },
      {
        text: '信息反馈',
        fragment: Feedback,
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
      },
      {
        text: '客户随访',
        fragment: FollowUpVisit,
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
      },
      {
        text: '理疗统计',
        fragment: StatisticsMassage,
      },
      {
        text: '随访统计',
        fragment: StatisticsVisit,
      },
    ],
  },
];

export default create(
  immer<LayoutConfigWithRole>((set, get) => ({
    layoutConfig: LayoutConfig,
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
