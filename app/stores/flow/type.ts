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

export type UpdatingAudioFile =
  | {
      name: string;
      uri: string;
    }
  | string;

type Template = {
  key: string;
  children: string[];
};

export interface FlowState {
  operators: Operator[];
  register: RegisterAndCollection;
  collection: RegisterAndCollection;
  analyze: RegisterAndCollection;
  currentFlow: Flow;
  guidanceTemplate: Template[];

  currentRegisterCustomer: RegisterCustomerInfo;
  currentFlowCustomer: Customer;

  requestRegisterCustomers: () => Promise<void>;
  requestCollectionCustomers: () => Promise<void>;
  requestAnalyzeCustomers: () => Promise<void>;
  requestGetOperators: () => Promise<void>;
  requestPostCustomerInfo: () => Promise<any>;
  requestPatchFlowToAnalysis: () => Promise<any>;
  requestGetFlow: (flowId: string) => Promise<void>;

  updateCurrentRegisterCustomer: (data: Partial<RegisterCustomerInfo>) => void;
  updateCurrentFlowCustomer: (data: Partial<Customer>) => void;
  updateCurrentFlow: (data: Partial<Flow>) => void;
  updateHealthInfo: (data: Partial<HealthInfo>) => void;

  addLingualImage: (updating: UpdatingImage) => void;
  updateLingualImage: (name: string, url: string) => void;

  addLeftHandImage: (updating: UpdatingImage) => void;
  updateLeftHandImage: (name: string, url: string) => void;

  addRightHandImage: (updating: UpdatingImage) => void;
  updateRightHandImage: (name: string, url: string) => void;

  addOtherImage: (updating: UpdatingImage) => void;
  updateOtherImage: (name: string, url: string) => void;

  addAudioFile: (updating: UpdatingAudioFile) => void;
  updateAudioFile: (name: string, url: string) => void;
}

export interface HealthInfo {
  allergy: string;
  audioFiles: UpdatingAudioFile[];
  leftHandImages: UpdatingImage[];
  rightHandImages: UpdatingImage[];
  lingualImage: UpdatingImage[];
  otherImages: UpdatingImage[];
}

export interface Conclusion {
  content: string;
  updatedAt: string;
  operator: OperatorInfo;
}

export interface Massage {
  name: string;
  count: number;
  remark: string;
}

export interface Application {
  name: string;
  count: number;
  duration: number;
  acupoint: string;
}

export type Flow = {
  _id: string;
  customerId: string;
  healthInfo: HealthInfo;
  guidance: string;
  conclusions: Conclusion[];
  solution: {
    applications: Application[];
    massages: Massage[];
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
