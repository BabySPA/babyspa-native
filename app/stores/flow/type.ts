import { FlowOperatorConfigItem, FlowOperatorKey } from '~/app/constants';
import { FlowStatus, Gender } from '~/app/types';
import { Shop } from '../manager/type';

export enum RegisterStatus {
  NOT_SET = -1,
  CANCEL = 0,
  DONE = 1,
}

export enum CollectStatus {
  NOT_SET = -1,
  CANCEL = 0,
  DONE = 1,
}

export enum AnalyzeStatus {
  NOT_SET = -1,
  CANCEL = 0,
  DONE = 1,
  IN_PROGRESS = 2,
}

export enum EvaluateStatus {
  NOT_SET = -1,
  CANCEL = 0,
  DONE = 1,
}

export interface FlowItemResponse {
  _id: string;
  register: Register;
  collect: Collect;
  evaluate: Evaluate;
  analyze: Analyze;
  collectionOperator: OperatorInfo | null;
  analyzeOperator: OperatorInfo | null;
  evaluateOperator: OperatorInfo | null;
  followUpOperator: OperatorInfo | null;
  customer: Customer;
  shop: Partial<Shop>;
  updatedAt: string;
  tag: string;
  projectId?: string;
}

export interface Operator {
  gender: Gender;
  name: string;
  phoneNumber: string;
  roleKey: string;
  username: string;
}

export interface OperatorInfo {
  _id: string;
  name: string;
}

export interface Customer {
  _id: string;
  name: string;
  gender: Gender;
  birthday: string;
  nickname: string;
  phoneNumber: string;
  allergy?: string;
  updatedAt?: string;
}

export interface QueryFlowList {
  flows: FlowItemResponse[];
  searchKeywords: string;
  startDate: string;
  endDate: string;
  status: FlowStatus;
  shopId?: string;
  // 用于筛选
  allStatus?: {
    value: number;
    label: string;
  }[];
}

export interface QueryCustomerList {
  customers: Customer[];
  searchKeywords: string;
  startDate: string;
  endDate: string;
  status: FlowStatus | -1;
  shopId?: string;
  // 用于筛选
  allStatus?: {
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

type PatchFlowStatusType = 'register' | 'flow';

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

export type StatisticFlowWithDate = {
  date: string;
  counts: {
    register?: number;
    collect?: number;
    analyze?: number;
    massage?: number; // 推拿数量
    application?: number; // 贴敷数量
  };
};

export interface FlowState {
  clearCache: () => void;

  allCustomers: Customer[];
  operators: Operator[];
  register: QueryFlowList;
  collection: QueryFlowList;
  analyze: QueryFlowList;
  evaluate: QueryFlowList;
  currentFlow: FlowItemResponse;

  archiveCustomers: QueryCustomerList;

  customersFollowUp: QueryFlowList;

  currentArchiveCustomer: Customer;

  statisticShops: StatisticShop[];
  statisticShop: StatisticShop;
  statisticFlowWithDate: StatisticFlowWithDate[];

  requsetGetHomeList: () => void;
  requestGetInitializeData: () => void;
  requestGetFlowById: (flowId: string) => Promise<FlowItemResponse>;
  requestAllCustomers: (searchKeywords: string) => Promise<any>;
  requestGetRegisterFlows: () => Promise<any>;
  requestGetCollectionFlows: () => Promise<any>;
  requestGetAnalyzeFlows: () => Promise<any>;
  requestGetEvaluateFlows: () => Promise<any>;
  requestGetOperators: () => Promise<any>;
  requestDeleteCustomer: (customerId: string) => Promise<any>;
  requestPostRegisterInfo: () => Promise<any>;
  requestPatchCustomerInfo: () => Promise<any>;
  requestPostCustomerArchive: (customer: Partial<Customer>) => Promise<any>;
  requestPatchCustomerArchive: (customer: Partial<Customer>) => Promise<any>;
  requestPatchFlowToCollection: () => Promise<any>;
  requestPatchFlowToAnalyze: () => Promise<any>;
  requestPutFlowToEvaluate: (evaluate: Evaluate) => Promise<any>;

  requestStartAnalyze: () => Promise<FlowItemResponse>;

  // 客户档案
  requestArchiveCustomers: () => Promise<any>;
  requestCustomerArchiveHistory: (
    customerId: string,
  ) => Promise<FlowItemResponse[]>;
  requestCustomerArchiveCourses: (
    customerId: string,
  ) => Promise<FlowItemResponse[][]>;
  requestCustomerGrowthCurve: (
    customerId: string,
  ) => Promise<GrowthCurveStatisticsResponse[]>;

  requestPutCustomerGrowthCurve: (
    customerId: string,
    { height, weight }: { height: number; weight: number },
  ) => Promise<GrowthCurveStatisticsResponse>;
  requestPatchCustomerGrowthCurve: (
    customerId: string,
    { height, weight, date }: { height: number; weight: number; date: string },
  ) => Promise<GrowthCurveStatisticsResponse>;
  requestPatchRegisterStatus: (data: {
    status: RegisterStatus;
  }) => Promise<any>;

  requestPatchCollectionStatus: (data: {
    status: CollectStatus;
  }) => Promise<any>;
  requestPatchAnalyzeStatus: (data: { status: AnalyzeStatus }) => Promise<any>;

  // 客户随访
  requestGetFollowUps: () => Promise<any>;
  requestPatchFollowUp: (data: Partial<FollowUp>) => Promise<any>;

  updateRegisterFilter: (data: Partial<QueryFlowList>) => void;
  updateCollectionFilter: (data: Partial<QueryFlowList>) => void;
  updateEvaluateFilter: (data: Partial<QueryFlowList>) => void;
  updateArchiveCustomersFilter: (data: Partial<QueryFlowList>) => void;
  updateCustomersFollowupFilter: (data: Partial<QueryFlowList>) => void;

  updateCurrentFlow: (data: Partial<FlowItemResponse>) => void;
  updateCurrentArchiveCustomer: (data: Partial<Customer>) => void;
  updateCollection: (data: Partial<Collect>) => void;
  updateAnalyzeFilter: (data: Partial<QueryFlowList>) => void;
  updateAnalyze: (data: Partial<Analyze>) => void;

  addLingualImage: (updating: UpdatingImage) => void;
  updateLingualImage: (name: string, url: string) => void;
  removeLingualImage: (idx: number) => void;
  addLeftHandImage: (updating: UpdatingImage) => void;
  updateLeftHandImage: (name: string, url: string) => void;
  removeLeftHandImage: (idx: number) => void;
  addRightHandImage: (updating: UpdatingImage) => void;
  updateRightHandImage: (name: string, url: string) => void;
  removeRightHandImage: (idx: number) => void;
  addOtherImage: (updating: UpdatingImage) => void;
  updateOtherImage: (name: string, url: string) => void;
  removeOtherImage: (idx: number) => void;
  addAudioFile: (updating: UpdatingAudioFile) => void;
  updateAudioFile: (name: string, url: string) => void;
  removeAudioFile: (idx: number) => void;

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

  getFlowOperatorConfigByUser: (status: FlowStatus) => {
    configs: FlowOperatorConfigItem[];
    selectIdx: number;
  };

  requestGetStatisticFlow: (params: {
    startDate: string;
    endDate: string;
    shopId: string;
  }) => Promise<any>;

  requestGetStatisticFlowWithShop: (params: {
    startDate: string;
    endDate: string;
  }) => Promise<any>;

  calculateStatisticFlowWithDate: (
    data: any,
    startDate: string,
    endDate: string,
  ) => void;
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

export interface Register {
  customerId: any;
  status: RegisterStatus;
  operatorId: string;
  updatedAt: string;
}

export interface Collect {
  status: CollectStatus;
  healthInfo: HealthInfo;
  guidance: string;
  updatedAt?: string;
}

/**
 * 随访
 */
export interface FollowUp {
  /**
   * 随访编号
   */
  id?: string;
  /**
   * 随访状态
   */
  followUpStatus: FollowUpStatus;

  /**
   * 随访时间
   */
  followUpTime: string;

  /**
   * 实际随访时间
   */
  actualFollowUpTime?: string;

  /**
   * 随访人
   */
  operatorId?: string;

  operator?: OperatorInfo;

  /**
   * 随访结果
   */
  followUpResult?: FollowUpResult;

  /**
   * 随访内容
   */
  followUpContent?: string;
}

export enum FollowUpStatus {
  // 随访未设置
  NOT_SET = 0,
  // 待随访
  WAIT,
  // 已随访
  DONE,
  // 取消随访
  CANCEL,
  // 已逾期
  OVERDUE,
}

export enum FollowUpResult {
  // 恢复良好
  GOOD = 0,
  // 恢复欠佳
  BAD,
  // 未改善加重了
  WORSE,
}

export interface NextTime {
  hasNext: boolean;
  nextTime: string;
}

export interface Solution {
  /**
   * 贴敷
   */
  applications: Application[];
  /**
   * 推拿
   */
  massages: Massage[];
}

/**
 * 贴敷
 */
export interface Application {
  name: string; // 贴敷名称
  count: number; // 贴敷数量
  acupoint: string; // 贴敷穴位
}

/**
 * 推拿
 */
export interface Massage {
  name: string; // 推拿名称
  count: number; // 推拿数量
  remark: string; // 推拿备注
}
/**
 * 复推
 */
export interface Next {
  /**
   * 是否复推
   */
  hasNext: boolean;
  /**
   * 复推时间
   */
  nextTime: string;
}

export interface Analyze {
  status: AnalyzeStatus;

  /**
   * 原调理方案，现注意事项
   */
  conclusion: string;
  /**
   * 调理方案
   */
  solution: Solution;
  /**
   * 注意事项（废弃）
   */
  remark: string;
  /**
   * 随访
   */
  followUp: FollowUp;
  /**
   * 复推
   */
  next: Next;

  /**
   * 是否可编辑
   */
  editable?: number | false;

  updatedAt?: string;
}

export type Score = 1 | 2 | 3 | 4 | 5;

export interface Evaluate {
  status: EvaluateStatus;
  /**
   * 评分
   */
  score?: Score;
  /**
   * 评价
   */
  remark?: string;

  /**
   * 评价人
   */
  operatorId?: string;

  /**
   * 评价时间
   */
  updatedAt?: string;
}

export type StatisticShop = {
  shop: Pick<Shop, '_id' | 'name'>;
  counts: {
    register: number;
    collect: number;
    analyze: number;
    analyzeError: number;
    massage: number; // 推拿数量
    application: number; // 贴敷数量
  };
  flows: FlowItemResponse[];
};
