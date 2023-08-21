import { Role, RoleStatus, Shop } from '../manager/type';

/**
 * Auth store type
 */
export enum RoleAuthority {
  FLOW_REGISTER = 1000, // 门店信息登记
  FLOW_COLLECTION = 1001, // 门店信息采集
  FLOW_ANALYZE = 1002, // 门店信息分析
  FLOW_EVALUATE = 1003, // 评价反馈
  CUSTOMER_ARCHIVE = 2000, // 客户-客户档案
  CUSTOMER_FOLLOWUP = 2001, // 客户-随访
  MANAGER_SHOP = 3000, // 门店管理
  MANAGER_STAFF = 3001, // 员工管理
  MANAGER_ROLE = 3002, // 角色管理
  MANAGER_TEMPLATE = 3003, // 模板管理
  MANAGER_LOGGER = 3004, // 操作日志
  STATISTIC_SHOP = 4000, // 门店统计
  STATISTIC_MASSAGE = 4001, // 调理统计
  STATISTIC_ANALYZE = 4002, // 分析统计
  STATISTIC_FOLLOWUP = 4003, // 随访统计
}

export type RW = 'RW' | 'R';

export type AuthorityConfig = {
  authority: RoleAuthority;
  rw: RW;
};

export interface ShopsWithRole {
  role: Pick<Role, 'name' | 'authorities' | 'roleKey'>;
  shop: Shop;
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
  clearCache: () => void;
  clearAllStoreCache: () => void;
}
