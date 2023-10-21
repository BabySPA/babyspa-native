/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { Shop } from '../stores/manager/type';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export enum CustomerScreenType {
  collection = 'collection',
  register = 'register',
}

export interface OssConfig {
  accessId: string;
  host: string;
  policy: string;
  signature: string;
  expire: number;
}

export enum FlowStatus {
  NO_SET = -1, // 无状态
  Registered, // 已登记
  RegisterCanceled, // 登记取消
  ToBeCollected, // 待采集
  Collected, // 已采集
  CollectCanceled, // 采集取消
  ToBeAnalyzed, // 待分析
  AnalyzeInProgress, //  分析中
  Analyzed, // 已分析
  AnalyzeCanceled, // 分析取消
  ToBeEvaluated, // 待评价
  Evaluated, // 已评价
  EvaluateCanceled, // 评价取消
  ToBeFollowedUp, // 待跟进
  FollowedUp, // 已跟进
  FollowUpCanceled, // 跟进取消
}

export enum Gender {
  WOMAN = 0,
  MAN = 1,
}

// 操作类型仅用于首页公共组件区分类型
export enum OperateType {
  Register = 0,
  Collection,
  Analyze,
  Evaluate,
}

export type FlowFrom =
  | 'analyze'
  | 'evaluate'
  | 'evaluate-detail'
  | 'follow-up'
  | 'follow-up-detail';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackList> | undefined;
  App: NavigatorScreenParams<AppStackList> | undefined;
  RegisterCustomer: {
    type: CustomerScreenType;
  };
  CustomerDetail: undefined;
  AddNewCustomer: undefined;
  Flow: {
    type: FlowStatus;
  };
  FlowInfo: {
    from: FlowFrom;
  };
  Modal: undefined;
  NotFound: undefined;
  Camera: {
    type: 'lingual' | 'lefthand' | 'righthand' | 'other';
  };
  ManagerLogger: undefined;
  ManagerShop: undefined;
  ManagerRole: undefined;
  ManagerTemplate: undefined;
  ManagerUser: undefined;
  CustomerArchive: {
    defaultSelect?: number;
  };
  Personal: undefined;
  AnalyzeInfo: undefined;
  ShopDetail: {
    type: 'edit' | 'detail';
  };
  UserDetail: {
    type: 'edit' | 'detail';
  };
  RoleDetail: {
    type: 'edit' | 'detail';
  };
  FollowUp: {
    currentShop: Pick<Shop, 'name' | '_id'>;
  };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, Screen>;

export type AppStackList = {
  Home: undefined;
  RegisterCustomer: {
    type: CustomerScreenType;
  };
  CustomerDetail: undefined;
  AddNewCustomer: undefined;
  Flow: {
    type: FlowStatus;
  };
  FlowInfo: {
    from: FlowFrom;
  };
  Camera: {
    type: 'lingual' | 'lefthand' | 'righthand' | 'other';
  };
  ManagerLogger: undefined;
  ManagerShop: undefined;
  ManagerRole: undefined;
  ManagerTemplate: undefined;
  ManagerUser: undefined;
  CustomerArchive: {
    defaultSelect?: number;
  };
  Personal: undefined;
  AnalyzeInfo: undefined;
  ShopDetail: {
    type: 'edit' | 'detail';
  };
  UserDetail: {
    type: 'edit' | 'detail';
  };
  RoleDetail: {
    type: 'edit' | 'detail';
  };
  FollowUp: {
    currentShop: Pick<Shop, 'name' | '_id'>;
  };
};

export type AppStackScreenProps<T extends keyof AppStackList> =
  StackScreenProps<AppStackList, T>;

export type AuthStackList = {
  Login: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackList> =
  StackScreenProps<AuthStackList, T>;
