/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackList> | undefined;
  App: NavigatorScreenParams<AppStackList> | undefined;
  Register: undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type AppStackList = {
  Home: undefined;
  Register: undefined;
};

export type AppStackScreenProps<T extends keyof AppStackList> =
  NativeStackScreenProps<AppStackList, T>;

export type AuthStackList = {
  Login: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackList> =
  NativeStackScreenProps<AuthStackList, T>;
