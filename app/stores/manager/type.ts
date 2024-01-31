import { IConfigAuth } from '~/app/constants';
import { AuthorityConfig } from '../auth/type';

export interface Shop {
  _id?: string;
  name: string;
  maintainer: string;
  phoneNumber: string;
  region: string;
  address: string;
  openingTime: string;
  closingTime: string;
  description: string;
  type: ShopType;
  createdAt?: string;
  updatedAt?: string;
}

export enum ShopType {
  CENTER = 0, // 中心
  SHOP = 1, // 门店
}

export enum RoleStatus {
  CLOSE = 0,
  OPEN = 1,
}

export interface User {
  _id?: string;
  name: string;
  username: string;
  gender: number;
  phoneNumber: string;
  idCardNumber: string;
  password: string;
  shop?: {
    originalShopId?: string; // 员工编辑 - 更新门店时，需要记录更新前的门店id，若与shopId不同，则后端需要决定是否删除原有门店
    shopId: string;
    name: string;
    type: ShopType;
  };
  role?: {
    name: string;
    roleKey: string;
    type: ShopType;
  };
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  _id?: string;
  name: string;
  roleKey: string;
  description: string;
  status: RoleStatus;
  authorities: AuthorityConfig[];
  type: ShopType;
  createdAt?: string;
  updatedAt?: string;
}

interface ShopState {
  shops: Shop[];
  currentShop: Shop;
  // request
  requestGetShops: (searchKeyword?: string) => Promise<any>;
  requestPostShop: () => Promise<any>;
  requestPatchShop: () => Promise<any>;

  // action
  setCurrentShop: (shop: Shop) => void;
}

interface UserFilter {
  name: string;
  shop: {
    id: string;
    name: string;
  };
}

export interface UserState {
  // 员工
  users: User[];
  currentUser: User;
  userFilter: UserFilter;
  // request
  requestGetUsers: () => Promise<any>;
  requestPostUser: () => Promise<any>;
  requestPatchUser: () => Promise<any>;
  requestPatchUserPassword: (userId: string, password?: string) => Promise<any>;
  requestDeleteUser: () => Promise<any>;

  // action
  setCurrentUser: (user: User) => void;
  updateCurrentUser: (user: Partial<User>) => void;
  setUserFilter: (user: UserFilter) => Promise<any>;
}

interface RoleState {
  roles: Role[];
  currentRole: Role;
  // request
  requestGetRoles: () => Promise<any>;
  requestPostRole: () => Promise<any>;
  requestPatchRole: () => Promise<any>;
  requestDeleteRole: () => Promise<any>;

  // action
  setCurrentRole: (role: Role) => void;
}

export interface ExtraItem {
  extra: { title: string; content: string };
}

export interface TemplateItem {
  name: string;
  children: string[] | ExtraItem[] | TemplateItem[];
}

export interface Template {
  _id: string;
  key: string;
  name: string;
  groups: TemplateItem[];
}

interface LogState {
  logs: any[];
  logFilter: {
    searchKeywords: string;
    startDate: string;
    endDate: string;
  };
  requestGetLogs: () => Promise<any>;
  setLogFilter: (
    filter: Partial<{
      searchKeywords: string;
      startDate: string;
      endDate: string;
    }>,
  ) => Promise<any>;
}

interface TemplateState {
  templates: Template[];

  currentSelectTemplateIdx: number;

  requestGetTemplates: () => Promise<any>;
  requestPatchTemplateGroup: (
    group?: TemplateItem & {
      originalName?: string;
      groupName?: string;
      originalGroupName?: string;
    },
    extra?: { isGroup: boolean },
  ) => Promise<any>;
  requestPatchTemplateGroups: (groups: TemplateItem[]) => Promise<any>;
  requestDeleteTemplateGroup: (
    groupName: string,
    extra?: { groupIdx?: number },
  ) => Promise<any>;

  setCurrentSelectTemplateIdx: (idx: number) => void;

  setCurrentSelectTemplateItemTexts: (gidx: number, texts: string[]) => void;

  getTemplateGroups: (groupKey: string) => Template | undefined;
}

export interface ManangerState
  extends ShopState,
    UserState,
    RoleState,
    TemplateState,
    LogState {
  clearCache: () => void;
}
