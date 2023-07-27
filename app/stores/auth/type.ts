export enum RoleAuthority {
  FLOW_REGISTER = 1000, // 门店信息登记
  FLOW_COLLECTION = 1001, // 门店信息采集
  FLOW_ANALYZE = 1002, // 门店信息分析
  CUSTOMER_ARCHIVE = 2000, // 客户-客户档案
  MANAGER_SHOP = 3000, // 门店管理
  MANAGER_STAFF = 3001, // 员工管理
  LOG_OPERATOR = 4000, // 操作日志
  STATISTIC = 5000, // 统计
  ALL = 9999, // 全部
}

export type RW = 'RW' | 'R';

export interface AuthState {
  accessToken: string | null;
  user: {
    name: string;
    username: string;
    phoneNumber: string;
    shop: {
      id: string;
      name: string;
      region: string;
      address: string;
    };
    role: {
      id: string;
      name: string;
      authorities: {
        authority: RoleAuthority;
        rw: RW;
      }[];
    };
    isGlobalAdmin: boolean;
  } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasAuthority: (authorityKey: RoleAuthority, rw: RW) => boolean;
}
