import { Toast } from 'native-base';
import { CustomerStatus, Gender } from '~/app/types';

export interface Customer {
  operator: OperatorInfo | null;
  id: string;
  name: string;
  gender: Gender;
  birthday: string;
  nickname: string;
  phoneNumber: string;
  status: CustomerStatus;
  allergy: string;
  updatedAt: string;
  tag: string;
  flowId: string;
}

export interface Operator {
  gender: Gender;
  name: string;
  phoneNumber: string;
  roleKey: string;
  username: string;
}

export interface OperatorInfo {
  id: string;
  name: string;
  phoneNumber: string;
}

export type RegisterCustomerInfo = Partial<Customer>;

export interface RegisterAndCollection {
  customers: Customer[];
  page: number;
  hasNextPage: boolean;
  searchKeywords: string;
  startDate: string;
  endDate: string;
  status: CustomerStatus | -1;
}

export type UpdatingImage =
  | {
      name: string;
      uri: string;
    }
  | string;

export interface FlowState {
  operators: Operator[];
  register: RegisterAndCollection;
  collection: RegisterAndCollection;
  analyze: RegisterAndCollection;
  currentFlow: Flow;

  currentRegisterCustomer: RegisterCustomerInfo;
  currentFlowCustomer: Customer;

  requestRegisterCustomers: () => Promise<void>;
  requestCollectionCustomers: () => Promise<void>;
  requestAnalyzeCustomers: () => Promise<void>;
  requestGetOperators: () => Promise<void>;
  requestPostCustomerInfo: () => Promise<any>;
  requestGetFlow: (flowId: string) => Promise<void>;
  setCurrentRegisterCustomer: (data: Partial<RegisterCustomerInfo>) => void;
  setCurrentFlowCustomer: (data: Customer) => void;
  updateHealthInfo: (data: Partial<HealthInfo>) => void;
  addlingualImage: (updatingImage: UpdatingImage) => void;
  updatelingualImage: (name: string, url: string) => void;
  addLeftHandImage: (updatingImage: UpdatingImage) => void;
  updateLeftHandImage: (name: string, url: string) => void;
  addRightHandImage: (updatingImage: UpdatingImage) => void;
  updateRightHandImage: (name: string, url: string) => void;
}

export interface HealthInfo {
  allergy: string;
  audioFiles: string[];
  leftHandImages: UpdatingImage[];
  rightHandImages: UpdatingImage[];
  lingualImage: UpdatingImage[];
  otherImages: UpdatingImage[];
}

export type Flow = {
  _id: string;
  customerId: string;
  healthInfo: HealthInfo;
  guidance: string;
  conclusions: string[];
  solution: {
    applications: string[];
    massages: string[];
    operatorId: string;
    remark: string;
  };
  followUp: {
    isFollowed: boolean;
    followUpTime: string;
  };
  evaluation: {
    rating: number;
    content: string;
    updatedAt: string;
    operatorId: string;
  };
  createdAt: string;
  updatedAt: string;
};
