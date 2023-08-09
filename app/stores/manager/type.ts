export interface Shop {
  _id: string;
  name: string;
  maintainer: string;
  phoneNumber: string;
  region: string;
  address: string;
  openingTime: string;
  closingTime: string;
  description: string;
  createdAt: string;
  type: ShopType;
  updatedAt: string;
}
export enum ShopType {
  CENTER = 0, // 中心
  SHOP = 1, // 门店
  HEADQUARTERS = 2, // 总店
}

export interface ManangerState {
  shops: Shop[];
  currentShop: Shop | null;
  // request
  requestGetShops: () => Promise<any>;

  // action
  setCurrentShop: (shop: Shop | null) => void;
}
