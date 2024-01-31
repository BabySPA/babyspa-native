import { ImageSourcePropType } from 'react-native';
import { RoleAuthority } from '../auth/type';
import { Shop, ShopType } from '../manager/type';

export interface ILayoutConfig {
  image: ImageSourcePropType;
  selectedImage: ImageSourcePropType;
  text: string;
  noTab?: boolean; // 是否不显示tab
  features: {
    text: string;
    auth: RoleAuthority;
  }[];
}

export type LayoutConfigWithRole = {
  clearCache: () => void;
  layoutConfig: ILayoutConfig[];
  getLayoutConfig: () => ILayoutConfig[];
  currentSelected: number;
  featureSelected: number;
  originFeatureSelected: number;
  changeCurrentSelected: (index: number) => void;
  changeFeatureSelected: (index: number) => void;
};
