/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Customer } from '../stores/flow/type';

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

export enum CustomerStatus {
  Completed, // 已完成
  Canceled, // 已取消
  ToBeCollected, // 待收集
  ToBeAnalyzed, // 待分析
  ToBeEvaluated, // 待评价
  Evaluated, // 已评价
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
  FOLLOWUP,
}

export type FlowFrom = 'analyze' | 'evaluate' | 'evaluate-detail';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackList> | undefined;
  App: NavigatorScreenParams<AppStackList> | undefined;
  RegisterCustomer: {
    type: CustomerScreenType;
  };
  CustomerDetail: undefined;
  AddNewCustomer: undefined;
  Flow: {
    type: CustomerStatus;
  };
  FlowInfo: {
    from: FlowFrom;
  };
  Modal: undefined;
  NotFound: undefined;
  Camera: undefined;
  ManagerLogger: undefined;
  ManagerShop: undefined;
  ManagerRole: undefined;
  ManagerTemplate: undefined;
  ManagerUser: undefined;
  CustomerArchive: {
    customer: Customer;
  };
  ShopDetail: {
    type: 'edit' | 'detail';
  };
  UserDetail: {
    type: 'edit' | 'detail';
  };
  RoleDetail: {
    type: 'edit' | 'detail';
  };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type AppStackList = {
  Home: undefined;
  RegisterCustomer: {
    type: CustomerScreenType;
  };
  CustomerDetail: undefined;
  AddNewCustomer: undefined;
  Flow: {
    type: CustomerStatus;
  };
  FlowInfo: {
    from: FlowFrom;
  };
  Camera: undefined;
  ManagerLogger: undefined;
  ManagerShop: undefined;
  ManagerRole: undefined;
  ManagerTemplate: undefined;
  ManagerUser: undefined;
  CustomerArchive: {
    customer: Customer;
  };
  ShopDetail: {
    type: 'edit' | 'detail';
  };
  UserDetail: {
    type: 'edit' | 'detail';
  };
  RoleDetail: {
    type: 'edit' | 'detail';
  };
};

export type AppStackScreenProps<T extends keyof AppStackList> =
  NativeStackScreenProps<AppStackList, T>;

export type AuthStackList = {
  Login: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackList> =
  NativeStackScreenProps<AuthStackList, T>;
