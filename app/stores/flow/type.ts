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
  uploadFile: (uri: string, fileName: string) => Promise<any>;
  openMediaLibrary: (toast: typeof Toast) => Promise<string>;
}

export interface HealthInfo {
  allergy: string;
  audioFiles: string[];
  leftHandImages: string[];
  rightHandImages: string[];
  lingualImage: string[];
  otherImages: string[];
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
