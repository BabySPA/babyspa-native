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

  requestInitializeData: () => Promise<void>;
  requestRegisterCustomers: () => Promise<void>;
  requestCollectionCustomers: () => Promise<void>;
  requestAnalyzeCustomers: () => Promise<void>;
  requestGetOperators: () => Promise<void>;
  requestPostCustomerInfo: () => Promise<any>;
  requestPatchCustomerInfo: () => Promise<any>;
  requestPatchFlowToCollection: () => Promise<any>;
  requestPatchCustomerStatus: (data: { status: number }) => Promise<any>;
  requestGetFlow: (flowId: string) => Promise<void>;

  updateCurrentRegisterCustomer: (data: Partial<RegisterCustomerInfo>) => void;
  updateCurrentFlowCustomer: (data: Partial<Customer>) => void;
  updateCollection: (data: Partial<Collect>) => void;
  updateAnalyze: (data: Partial<Analyze>) => void;

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

export interface Collect {
  healthInfo: HealthInfo;
  guidance: string;
  operatorId: string;
  updatedAt: Date;
}

export interface Analyze {
  conclusion: string;
  solution: {
    applications: Application[];
    massages: Massage[];
  };
  remark: string;
  followUp: {
    isFollowed: boolean;
    followUpTime: string;
  };
  next: {
    hasNext: boolean;
    nextTime: string;
  };
  operatorId: string;
  updatedAt: Date;
}

export type Flow = {
  _id: string;
  customerId: string;
  collect: Collect;
  analyze: Analyze;
  updatedAt: string;
  createdAt: string;
};
