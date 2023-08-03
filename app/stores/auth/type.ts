export enum RoleAuthority {
  FLOW_REGISTER = 1000, // 门店信息登记
  FLOW_COLLECTION = 1001, // 门店信息采集
  FLOW_ANALYZE = 1002, // 门店信息分析
  FLOW_EVALUATE = 1003, // 评价反馈
  CUSTOMER_ARCHIVE = 2000, // 客户-客户档案
  CUSTOMER_FOLLOWUP = 2001, // 客户-随访
  MANAGER_SHOP = 3000, // 门店管理
  MANAGER_STAFF = 3001, // 员工管理
  LOG_OPERATOR = 4000, // 操作日志
  STATISTIC_SHOP = 5000, // 门店统计
  STATISTIC_MASSAGE = 5001, // 调理统计
  STATISTIC_ANALYZE = 5002, // 分析统计
  STATISTIC_FOLLOWUP = 5002, // 随访统计
  ALL = 9999, // 全部
}

export type RW = 'RW' | 'R';

export type AuthorityConfig = {
  authority: RoleAuthority;
  rw: RW;
};

export interface ShopsWithRole {
  role: {
    _id: string;
    name: string;
    authorities: AuthorityConfig[];
  };
  shop: {
    _id: string;
    name: string;
    address: string;
    region: string;
  };
  isGlobalAdmin: boolean;
}

export interface AuthState {
  accessToken: string | null;
  user: {
    name: string;
    username: string;
    phoneNumber: string;
    shopsWithRole: ShopsWithRole[];
  } | null;
  currentShopWithRole: ShopsWithRole | null;
  setCurrentShopWithRole: (shopId: string) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasAuthority: (authorityKey: RoleAuthority, rw: RW) => boolean;
}
