import { ImageSourcePropType } from 'react-native';
import { RoleAuthority } from '../auth/type';
import { Shop, ShopType } from '../manager/type';

export interface ILayoutConfig {
  image: ImageSourcePropType;
  selectedImage: ImageSourcePropType;
  text: string;
  featureSelected: number;
  noTab?: boolean; // 是否不显示tab
  fragment?: () => JSX.Element; // 若非tab layout，则需要传入fragment
  features: {
    text: string;
    fragment?: (params?: any) => JSX.Element;
    auth: RoleAuthority;
  }[];
}

export type LayoutConfigWithRole = {
  clearCache: () => void;
  layoutConfig: ILayoutConfig[];
  getLayoutConfig: () => ILayoutConfig[];
  currentSelected: number;
  changeCurrentSelected: (index: number) => void;
  changeFeatureSelected: (index: number) => void;
};
