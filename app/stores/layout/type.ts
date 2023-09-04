import { ImageSourcePropType } from 'react-native';
import { RoleAuthority } from '../auth/type';
import { Shop } from '../manager/type';

export interface ILayoutConfig {
  image: ImageSourcePropType;
  selectedImage: ImageSourcePropType;
  text: string;
  featureSelected: number;
  noTab?: boolean; // 是否不显示tab
  fragment?: () => JSX.Element; // 若非tab layout，则需要传入fragment
  features: {
    text: string;
    fragment?: () => JSX.Element;
    auth: RoleAuthority;
  }[];
}

export type LayoutConfigWithRole = {
  clearCache: () => void;
  layoutConfig: ILayoutConfig[];
  defaultFollowUpSelectShop: Pick<Shop, 'name' | '_id'>;
  getLayoutConfig: () => ILayoutConfig[];
  currentSelected: number;
  changeCurrentSelected: (index: number) => void;
  changeFeatureSelected: (index: number) => void;
  enterToFollowUp: (params?: Pick<Shop, 'name' | '_id'>) => void;
};
