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

export interface User {
  _id?: string;
  name: string;
  username: string;
  gender: number;
  phoneNumber: string;
  idCardNumber: string;
  password: string;
  shop?: {
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

export interface ManangerState {
  shops: Shop[];
  currentShop: Shop;
  // request
  requestGetShops: () => Promise<any>;
  requestPostShop: () => Promise<any>;
  requestPatchShop: () => Promise<any>;

  // action
  setCurrentShop: (shop: Shop) => void;

  // 员工
  users: User[];
  currentUser: User;
  // request
  requestGetUsers: (shopId: string) => Promise<any>;
  requestPostUser: () => Promise<any>;
  requestPatchUser: () => Promise<any>;
  requestPatchUserPassword: (password?: string) => Promise<any>;

  // action
  setCurrentUser: (user: User) => void;
}
