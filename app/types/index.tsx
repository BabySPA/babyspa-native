/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStatus } from '../constants';
import { Customer } from '../stores/flow';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export enum CustomerScreenType {
  collection = 'collection',
  register = 'register',
}
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackList> | undefined;
  App: NavigatorScreenParams<AppStackList> | undefined;
  CustomerInfo: {
    type: CustomerScreenType;
  };
  Flow: {
    status: CustomerStatus;
    customer: Customer;
  };
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type AppStackList = {
  Home: undefined;
  CustomerInfo: {
    type: CustomerScreenType;
  };
  Flow: {
    status: CustomerStatus;
    customer: Customer;
  };
};

export type AppStackScreenProps<T extends keyof AppStackList> =
  NativeStackScreenProps<AppStackList, T>;

export type AuthStackList = {
  Login: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackList> =
  NativeStackScreenProps<AuthStackList, T>;
