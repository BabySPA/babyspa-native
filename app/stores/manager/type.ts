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
  HEADQUARTERS = 2, // 总店
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
  };
  role?: {
    name: string;
    roleKey: string;
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
  createdAt?: string;
  updatedAt?: string;
}

interface ShopState {
  shops: Shop[];
  currentShop: Shop;
  // request
  requestGetShops: () => Promise<any>;
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
  requestPatchUserPassword: (password?: string) => Promise<any>;
  requestDeleteUser: () => Promise<any>;

  // action
  setCurrentUser: (user: User) => void;
  setUserFilter: (user: UserFilter) => Promise<any>;
}

interface RoleState {
  roles: Role[];
  currentRole: Role;
  configAuthTree: IConfigAuth[];
  // request
  requestGetRoles: () => Promise<any>;
  requestPostRole: () => Promise<any>;
  requestPatchRole: () => Promise<any>;
  requestDeleteRole: () => Promise<any>;

  // action
  setCurrentRole: (role: Role) => void;
  setConfigAuthTree: (authorities: IConfigAuth[]) => void;
}

export interface TemplateItem {
  name: string;
  children: string[];
}

export interface Template {
  _id: string;
  key: string;
  name: string;
  template: TemplateItem[];
}

interface TemplateState {
  templates: Template[];
  currentSelectTemplateIdx: number;
  currentSelectItemTemplateIdx: number;
  setCurrentSelectTemplateIdx: (idx: number) => void;
  setCurrentSelectItemTemplateIdx: (idx: number) => void;
}

export interface ManangerState
  extends ShopState,
    UserState,
    RoleState,
    TemplateState {}
