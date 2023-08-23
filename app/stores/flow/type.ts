import { FlowOperatorConfigItem, FlowOperatorKey } from '~/app/constants';
import { CustomerStatus, Gender } from '~/app/types';

export interface Customer {
  operator: OperatorInfo | null;
  analyst: OperatorInfo | null;
  shop: ShopInfo | null;
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
  flowEvaluate: Evaluate | null;
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

export interface ShopInfo {
  id: string;
  name: string;
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
  statusCount: any;
  // 用于筛选
  allStatus: {
    value: number;
    label: string;
  }[];
}

export type UpdatingImage =
  | {
      name: string;
      uri: string;
    }
  | string;

export type UpdatingAudioFile = {
  name: string;
  uri: string;
  duration: number;
};

type Template = {
  key: string;
  children: string[];
};

type PatchCustomerStatusType = 'register' | 'flow';

export interface GrowthCurveStatisticsResponse {
  date: string;
  heightData: GrowthCurveStatisticsHeight;
  weightData: GrowthCurveStatisticsWeight;
}

export interface GrowthCurveStatisticsHeight {
  height: number;
  heightStandard: number;
  heightComparison: GrowthCurveHeightComparison;
}

export interface GrowthCurveStatisticsWeight {
  weight: number;
  weightStandard: number;
  weightComparison: GrowthCurveWeightComparison;
}

export enum GrowthCurveHeightComparison {
  Small = 'Small', // 矮小
  Shorter = 'Shorter', // 偏矮
  Normal = 'Normal', // 正常
  Taller = 'Taller', // 偏高
}

export enum GrowthCurveWeightComparison {
  Lighter = 'Lighter', // 偏瘦
  Normal = 'Normal', // 正常
  Heavier = 'Heavier', // 超重
  Obesity = 'Obesity', // 肥胖
}

export interface FlowArchive extends Partial<Flow> {
  shop: {
    id: string;
    name: string;
  };
}
export interface FlowState {
  clearCache: () => void;

  allCustomers: Customer[];
  operators: Operator[];
  register: RegisterAndCollection;
  collection: RegisterAndCollection;
  analyze: RegisterAndCollection;
  evaluate: RegisterAndCollection;
  currentFlow: Flow;

  customersArchive: RegisterAndCollection;

  currentRegisterCustomer: RegisterCustomerInfo;
  currentFlowCustomer: Customer;

  requestInitializeData: () => Promise<void>;
  requestAllCustomers: (searchKeywords: string) => Promise<void>;
  requestRegisterCustomers: () => Promise<void>;
  requestCollectionCustomers: () => Promise<void>;
  requestAnalyzeCustomers: () => Promise<void>;
  requestEvaluateCustomers: () => Promise<void>;
  requestGetOperators: () => Promise<void>;
  requestPostCustomerInfo: () => Promise<any>;
  requestPatchCustomerInfo: () => Promise<any>;
  requestPatchFlowToCollection: () => Promise<any>;
  requestPatchFlowToAnalyze: () => Promise<any>;
  requestPutFlowToEvaluate: (evaluate: Evaluate) => Promise<any>;

  // 客户档案
  requestCustomersArchive: () => Promise<void>;
  requestCustomerArchiveHistory: (customerId: string) => Promise<FlowArchive[]>;
  requestCustomerArchiveCourses: (
    customerId: string,
  ) => Promise<FlowArchive[][]>;
  requestCustomerGrowthCurve: (
    customerId: string,
  ) => Promise<GrowthCurveStatisticsResponse[]>;
  requestPatchCustomerStatus: (data: {
    status: number;
    type: PatchCustomerStatusType;
  }) => Promise<any>;
  requestGetFlow: (flowId: string) => Promise<void>;

  updateRegisterFilter: (data: Partial<RegisterAndCollection>) => void;
  updateCollectionFilter: (data: Partial<RegisterAndCollection>) => void;
  updateEvaluateFilter: (data: Partial<RegisterAndCollection>) => void;

  updateCurrentRegisterCustomer: (data: Partial<RegisterCustomerInfo>) => void;
  updateCurrentFlowCustomer: (data: Partial<Customer>) => void;
  updateCollection: (data: Partial<Collect>) => void;
  updateAnalyzeFilter: (data: Partial<RegisterAndCollection>) => void;
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

  addSolutionApplication: (application: Application) => void;
  updateSolutionApplication: (application: Application, idx: number) => void;
  removeSolutionApplication: (idx: number) => void;

  addSolutionMassage: (massage: Massage) => void;
  updateSolutionMassage: (massage: Massage, idx: number) => void;
  removeSolutionMassage: (idx: number) => void;

  updateAnalyzeRemark: (text: string) => void;

  updateFollowUp: (data: Partial<FollowUp>) => void;
  updateNextTime: (data: Partial<NextTime>) => void;
  updateEvaluate: (data: Pick<Evaluate, 'score' | 'remark'>) => void;

  getFlowOperatorConfigByUser: (status: CustomerStatus) => {
    configs: FlowOperatorConfigItem[];
    selectIdx: number;
  };
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
  operator?: {
    id: string;
    name: string;
  };
}

export interface FollowUp {
  isFollowed: boolean;
  followUpTime: string;
}

export interface NextTime {
  hasNext: boolean;
  nextTime: string;
}

export interface Analyze {
  conclusion: string;
  solution: {
    applications: Application[];
    massages: Massage[];
  };
  remark: string;
  followUp: FollowUp;
  next: NextTime;
  operator?: {
    id: string;
    name: string;
  };
  operatorId: string;
  updatedAt: Date;
}

export type Score = 1 | 2 | 3 | 4 | 5;

export interface Evaluate {
  /**
   * 评分
   */
  score: Score;
  /**
   * 评价
   */
  remark: string;

  /**
   * 评价人
   */
  operatorId?: string;

  /**
   * 评价时间
   */
  updatedAt?: Date;
}

export type Flow = {
  _id: string;
  customerId: string;
  collect: Collect;
  analyze: Analyze;
  evaluate: Evaluate | null;
  updatedAt: string;
  createdAt: string;
};
