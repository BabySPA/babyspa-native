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
import { RW, RoleAuthority } from '../stores/auth/type';
import { CustomerStatus } from '../types';
import { ILayoutConfig } from '../stores/layout/type';

type StatusOperateConfig = {
  [key in CustomerStatus]: {
    operate?: string;
  };
};

export const StatusOperateConfig: StatusOperateConfig = {
  [CustomerStatus.ToBeCollected]: {
    operate: '采集',
  },
  [CustomerStatus.ToBeAnalyzed]: {
    operate: '分析',
  },
  [CustomerStatus.Completed]: {},
  [CustomerStatus.Canceled]: {},
};

export const StatusTextConfig = {
  [CustomerStatus.ToBeCollected]: {
    text: '待采集',
    textColor: '#FE9505',
    bgColor: 'rgba(254, 149, 5, 0.2)',
  },
  [CustomerStatus.ToBeAnalyzed]: {
    text: '待分析',
    textColor: '#2AA1F7',
    bgColor: 'rgba(42, 161, 247, 0.2)',
  },
  [CustomerStatus.Completed]: {
    text: '已完成',
    textColor: '#00B49E',
    bgColor: 'rgba(0, 180, 158, 0.2)',
  },
  [CustomerStatus.Canceled]: {
    text: '已取消',
    textColor: '#777',
    bgColor: 'rgba(119, 119, 119, 0.2)',
  },
};

export const LayoutConfig: ILayoutConfig[] = [
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

export interface FlowOperatorConfigItem {
  text: string;
  key: string;
  auth: RoleAuthority;
  disabled: boolean;
}

export enum FlowOperatorKey {
  healthInfo = 'healthInfo',
  guidance = 'guidance',
  conclusions = 'conclusions',
  solution = 'solution',
}

export const FlowOperatorConfig: FlowOperatorConfigItem[] = [
  {
    text: '健康资料',
    key: FlowOperatorKey.healthInfo,
    auth: RoleAuthority.FLOW_COLLECTION,
    disabled: false,
  },
  {
    text: '调理导向',
    key: FlowOperatorKey.guidance,
    auth: RoleAuthority.FLOW_COLLECTION,
    disabled: false,
  },
  {
    text: '分析结论',
    key: FlowOperatorKey.conclusions,
    auth: RoleAuthority.FLOW_ANALYZE,
    disabled: false,
  },
  {
    text: '调理方案',
    key: FlowOperatorKey.solution,
    auth: RoleAuthority.FLOW_ANALYZE,
    disabled: false,
  },
];

export const SolutionDefault = {
  application: {
    name: '消肿止痛贴（0.4g/2ml）',
    count: 1,
    duration: 0,
    acupoint: '太阳穴',
  },
  massage: {
    name: '小儿推拿',
    count: 1,
    remark: '暂无',
  },
};
