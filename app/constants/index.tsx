import Register from '../screens/home/fragments/register';
import Collection from '../screens/home/fragments/collection';
import Analyze from '../screens/home/fragments/analyze';
import Evaluate from '../screens/home/fragments/evaluate';
import FollowUpVisit from '../screens/home/fragments/follow-up-visit';
import Archive from '../screens/home/fragments/archive';
import ShopCenter from '../screens/home/fragments/shop-center';
import StatisticsVisit from '../screens/home/fragments/statistics-visit';
import StatisticsShop from '../screens/home/fragments/statistics-shop';
import StatisticsMassage from '../screens/home/fragments/statistics-massage';
import StatisticsAnalyze from '../screens/home/fragments/statistics-analyze';
import { RW, RoleAuthority } from '../stores/auth/type';
import { FlowStatus } from '../types';
import { ILayoutConfig } from '../stores/layout/type';
import {
  AnalyzeStatus,
  CollectStatus,
  FlowItemResponse,
  FollowUpResult,
  FollowUpStatus,
  RegisterStatus,
  Score,
} from '../stores/flow/type';
import { ShopType } from '../stores/manager/type';

export const EvaluateTextConfig = {
  ['TODO']: {
    text: '待评价',
    textColor: '#FE9505',
    bgColor: 'rgba(254, 149, 5, 0.2)',
  },
  ['DONE']: {
    text: '已评价',
    textColor: '#00B49E',
    bgColor: 'rgba(0, 180, 158, 0.2)',
  },
};

export const FollowUpStatusTextConfig = {
  [FollowUpStatus.NOT_SET]: {
    text: '未设置随访',
    textColor: '#FE9505',
    bgColor: 'rgba(254, 149, 5, 0.2)',
  },
  [FollowUpStatus.WAIT]: {
    text: '待随访',
    textColor: '#FE9505',
    bgColor: 'rgba(254, 149, 5, 0.2)',
  },
  [FollowUpStatus.DONE]: {
    text: '已随访',
    textColor: '#00B49E',
    bgColor: 'rgba(0, 180, 158, 0.2)',
  },
  [FollowUpStatus.OVERDUE]: {
    text: '已逾期',
    textColor: '#FB6459',
    bgColor: 'rgba(251, 100, 89, 0.2)',
  },
  [FollowUpStatus.CANCEL]: {
    text: '已取消',
    textColor: '#777777',
    bgColor: 'rgba(119, 119, 119, 0.2)',
  },
};

export const getFollowUpStatusTextConfig = (
  status: FollowUpStatus | undefined,
) => {
  // @ts-ignore
  return FollowUpStatusTextConfig[status];
};

export const getFlowStatus = (flow: FlowItemResponse): FlowStatus => {
  if (
    flow.register.status == RegisterStatus.DONE &&
    flow.collect.status === CollectStatus.NOT_SET
  ) {
    // 待采集
    return FlowStatus.ToBeCollected;
  } else if (
    flow.collect.status === CollectStatus.DONE &&
    (flow.analyze.status === AnalyzeStatus.NOT_SET ||
      flow.analyze.status === AnalyzeStatus.IN_PROGRESS)
  ) {
    // 待分析
    return FlowStatus.ToBeAnalyzed;
  } else if (flow.analyze.status === AnalyzeStatus.DONE) {
    // 已完成
    return FlowStatus.Analyzed;
  } else if (flow.register.status === RegisterStatus.CANCEL) {
    return FlowStatus.RegisterCanceled;
  } else if (flow.collect.status === CollectStatus.CANCEL) {
    return FlowStatus.CollectCanceled;
  }
  return FlowStatus.NO_SET;
};

export const getStatusTextConfig = (status: FlowStatus) => {
  if (status == FlowStatus.ToBeCollected) {
    return {
      text: '待采集',
      textColor: '#FE9505',
      bgColor: 'rgba(254, 149, 5, 0.2)',
    };
  } else if (status == FlowStatus.ToBeAnalyzed) {
    return {
      text: '待分析',
      textColor: '#2AA1F7',
      bgColor: 'rgba(42, 161, 247, 0.2)',
    };
  } else if (status == FlowStatus.Analyzed) {
    return {
      text: '已完成',
      textColor: '#00B49E',
      bgColor: 'rgba(0, 180, 158, 0.2)',
    };
  } else if (
    status == FlowStatus.RegisterCanceled ||
    status == FlowStatus.CollectCanceled ||
    status == FlowStatus.AnalyzeCanceled ||
    status == FlowStatus.EvaluateCanceled ||
    status == FlowStatus.FollowUpCanceled
  ) {
    return {
      text: '已取消',
      textColor: '#777',
      bgColor: 'rgba(119, 119, 119, 0.2)',
    };
  }
};

export interface IConfigAuth {
  text: string;
  hasAuth: boolean;
  isOpen: boolean;
  features: {
    text: string;
    hasAuth: boolean;
    auth: RoleAuthority;
  }[];
}
export const ConfigAuthTree: IConfigAuth[] = [
  {
    text: '门店',
    hasAuth: true,
    isOpen: true,
    features: [
      {
        text: '信息登记',
        hasAuth: true,
        auth: RoleAuthority.FLOW_REGISTER,
      },
      {
        text: '信息采集',
        hasAuth: true,
        auth: RoleAuthority.FLOW_COLLECTION,
      },
      {
        text: '信息分析（中心）',
        hasAuth: true,
        auth: RoleAuthority.FLOW_ANALYZE,
      },
      {
        text: '评价反馈（中心）',
        hasAuth: true,
        auth: RoleAuthority.FLOW_EVALUATE,
      },
    ],
  },
  {
    text: '客户',
    hasAuth: true,
    isOpen: true,
    features: [
      {
        text: '客户档案',
        hasAuth: true,
        auth: RoleAuthority.CUSTOMER_ARCHIVE,
      },
      {
        text: '客户随访',
        hasAuth: true,
        auth: RoleAuthority.CUSTOMER_FOLLOWUP,
      },
    ],
  },
  {
    text: '管理',
    hasAuth: true,
    isOpen: true,
    features: [
      {
        text: '门店管理（中心）',
        auth: RoleAuthority.MANAGER_SHOP,
        hasAuth: true,
      },
      {
        text: '员工管理',
        auth: RoleAuthority.MANAGER_STAFF,
        hasAuth: true,
      },
      {
        text: '角色管理',
        auth: RoleAuthority.MANAGER_ROLE,
        hasAuth: true,
      },
      {
        text: '模版管理',
        auth: RoleAuthority.MANAGER_TEMPLATE,
        hasAuth: true,
      },
      {
        text: '操作日志',
        auth: RoleAuthority.MANAGER_LOGGER,
        hasAuth: true,
      },
    ],
  },
  {
    text: '统计',
    hasAuth: true,
    isOpen: true,
    features: [
      {
        text: '门店统计',
        auth: RoleAuthority.STATISTIC_SHOP,
        hasAuth: true,
      },
      {
        text: '调理统计',
        auth: RoleAuthority.STATISTIC_MASSAGE,
        hasAuth: true,
      },
      {
        text: '分析统计（中心）',
        auth: RoleAuthority.STATISTIC_ANALYZE,
        hasAuth: true,
      },
      {
        text: '随访统计',
        auth: RoleAuthority.STATISTIC_FOLLOWUP,
        hasAuth: true,
      },
    ],
  },
];

export const LayoutConfig: ILayoutConfig[] = [
  {
    image: require('~/assets/images/tab_01.png'),
    selectedImage: require('~/assets/images/tab_01_selected.png'),
    text: '门店',
    featureSelected: 0,
    features: [
      {
        text: '信息登记',
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
        text: '评价反馈',
        fragment: Evaluate,
        auth: RoleAuthority.FLOW_EVALUATE,
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
    noTab: true,
    text: '管理',
    featureSelected: 0,
    fragment: ShopCenter,
    features: [
      {
        text: '门店管理',
        auth: RoleAuthority.MANAGER_SHOP,
      },
      {
        text: '员工管理',
        auth: RoleAuthority.MANAGER_STAFF,
      },
      {
        text: '角色管理',
        auth: RoleAuthority.MANAGER_ROLE,
      },
      {
        text: '模版管理',
        auth: RoleAuthority.MANAGER_TEMPLATE,
      },
      {
        text: '操作日志',
        auth: RoleAuthority.MANAGER_LOGGER,
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
        fragment: StatisticsAnalyze,
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

export const SolutionDefault = {
  application: {
    name: '消肿止痛贴（0.4g/2ml）',
    count: 1,
    duration: 0,
    acupoint: '',
  },
  massage: {
    name: '小儿推拿',
    count: 1,
    remark: '',
  },
};
export const EvaluateStores: Score[] = [1, 2, 3, 4, 5];
export const EvaluateStoreConfig: Record<Score, string> = {
  // 1分：不满意
  // 2分：一般
  // 3分：满意
  // 4分：很满意
  // 5分：非常满意
  1: '不满意',
  2: '一般',
  3: '满意',
  4: '很满意',
  5: '非常满意',
};

export const TemplateGroupKeys = {
  allergy: 'allergy',
  guidance: 'guidance',
  conclusion: 'conclusion',
  ['application-acupoint']: 'application-acupoint',
  ['massage-remark']: 'massage-remark',
  ['flow-remark']: 'flow-remark',
};

export const FollowUpResultText = {
  // 恢复良好
  [FollowUpResult.GOOD]: '恢复良好',
  // 恢复欠佳
  [FollowUpResult.BAD]: '恢复欠佳',
  // 未改善加重了
  [FollowUpResult.WORSE]: '未改善加重了',
};
