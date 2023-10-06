import { create } from 'zustand';
import request from '~/app/api';
import { FlowOperatorConfigItem, FlowOperatorKey } from '../../constants';
import dayjs from 'dayjs';
import { immer } from 'zustand/middleware/immer';
import { produce } from 'immer';
import { FlowStatus, Gender } from '../../types';
import {
  AnalyzeStatus,
  CollectStatus,
  EvaluateStatus,
  FlowItemResponse,
  FlowState,
  FollowUp,
  FollowUpStatus,
  RegisterStatus,
  StatisticShop,
} from './type';
import useAuthStore from '../auth';
import { RoleAuthority } from '../auth/type';
import { fuzzySearch, generateFlowCounts } from '~/app/utils';
import useManagerStore from '../manager';
import { generateFollowUpFlows } from '~/app/utils/generateFlowCounts';

const DefaultFlowListData = {
  flows: [],
  searchKeywords: '',
  status: FlowStatus.NO_SET,
  startDate: dayjs().format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
};

const DefaultStatisticShop = {
  shop: {
    _id: '',
    name: '',
  },
  flows: [],
  counts: {
    register: 0,
    collect: 0,
    analyze: 0,
    analyzeError: 0,
    massage: 0,
    application: 0,
  },
};

const DefaultCustomerListData = {
  customers: [],
  searchKeywords: '',
  status: FlowStatus.NO_SET,
  startDate: dayjs().format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
};

export const DefaultCustomer = {
  _id: '',
  name: '',
  nickname: '',
  birthday: '',
  gender: Gender.MAN,
  allergy: '',
  phoneNumber: '',
};

export const DefaultFlow = {
  shopId: '',
  customer: DefaultCustomer,
  _id: '',
  collectionOperator: null,
  analyzeOperator: null,
  evaluateOperator: null,
  followUpOperator: null,
  register: {
    customerId: '',
    status: RegisterStatus.DONE,
    operatorId: '',
    updatedAt: new Date().toString(),
  },
  collect: {
    status: CollectStatus.NOT_SET,
    healthInfo: {
      allergy: '',
      audioFiles: [],
      leftHandImages: [],
      rightHandImages: [],
      lingualImage: [],
      otherImages: [],
    },
    guidance: '',
  },
  analyze: {
    status: AnalyzeStatus.NOT_SET,
    conclusion: '',
    solution: {
      applications: [],
      massages: [],
    },
    followUp: {
      id: '',
      followUpStatus: FollowUpStatus.NOT_SET,
      followUpTime: '',
    },
    next: {
      hasNext: false,
      nextTime: '',
    },
    remark: '',
    editable: 0,
  },
  evaluate: {
    status: EvaluateStatus.NOT_SET,
  },
  shop: {},
  updatedAt: new Date().toString(),
  tag: '',
};

const initialState = {
  allCustomers: [],
  register: {
    ...DefaultFlowListData,
    allStatus: [
      { label: '全部', value: -1 },
      { label: '待采集', value: FlowStatus.ToBeCollected },
      { label: '待分析', value: FlowStatus.ToBeAnalyzed },
      { label: '已完成', value: FlowStatus.Analyzed },
      { label: '已取消', value: FlowStatus.RegisterCanceled },
    ],
  },
  collection: {
    ...DefaultFlowListData,
    allStatus: [
      { label: '全部', value: -1 },
      { label: '待采集', value: FlowStatus.ToBeCollected },
      { label: '待分析', value: FlowStatus.ToBeAnalyzed },
      { label: '已完成', value: FlowStatus.Analyzed },
      { label: '已取消', value: FlowStatus.CollectCanceled },
    ],
  },
  analyze: {
    ...DefaultFlowListData,
    allStatus: [
      { label: '全部', value: -1 },
      { label: '待分析', value: FlowStatus.ToBeAnalyzed },
      { label: '已完成', value: FlowStatus.Analyzed },
      { label: '已取消', value: FlowStatus.AnalyzeCanceled },
    ],
  },
  evaluate: {
    ...DefaultFlowListData,
    allStatus: [
      { label: '全部', value: -1 },
      { label: '待评价', value: FlowStatus.ToBeEvaluated },
      { label: '已评价', value: FlowStatus.Evaluated },
    ],
  },
  currentFlow: DefaultFlow,

  archiveCustomers: { ...DefaultCustomerListData },
  customersFollowUp: {
    ...DefaultFlowListData,
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  },
  currentArchiveCustomer: DefaultCustomer,

  operators: [],

  statisticShops: [],
  statisticShop: DefaultStatisticShop,
  statisticFlowWithDate: [],
};

const useFlowStore = create(
  immer<FlowState>((set, get) => ({
    ...initialState,
    clearCache: () => {
      set({ ...initialState });
    },
    requestGetInitializeData: async () => {
      useManagerStore.getState().requestGetTemplates();
      useManagerStore.getState().requestGetRoles();
      useManagerStore.getState().requestGetShops();

      // 获取当前用户的信息
      const hasAuthority = useAuthStore.getState().hasAuthority;

      if (hasAuthority(RoleAuthority.FLOW_REGISTER, 'R')) {
        await get().requestGetRegisterFlows();
      }
      if (hasAuthority(RoleAuthority.CUSTOMER_ARCHIVE, 'R')) {
        await get().requestGetCollectionFlows();
      }
      if (hasAuthority(RoleAuthority.FLOW_ANALYZE, 'R')) {
        await get().requestGetAnalyzeFlows();
      }
      if (hasAuthority(RoleAuthority.FLOW_EVALUATE, 'R')) {
        await get().requestGetEvaluateFlows();
      }
    },

    requestGetFlowById: async (flowId) => {
      const { data } = await request.get(`/flows/${flowId}`);
      return data;
    },
    requestAllCustomers: async (searchKeywords: string) => {
      const params: any = {
        search: searchKeywords,
      };
      request.get('/customers/all', { params }).then(({ data }) => {
        const { docs } = data;
        set({
          allCustomers: docs,
        });
      });
    },

    requestGetRegisterFlows: async () => {
      const {
        register: { searchKeywords, startDate, endDate, status },
      } = get();
      const params: any = {};

      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      params.shopId = useAuthStore.getState().currentShopWithRole?.shop._id;

      request.get('/flows', { params }).then((res) => {
        const { docs } = res.data;

        const filterDocs = docs.filter(
          (item: FlowItemResponse) =>
            item.analyze.status !== AnalyzeStatus.CANCEL &&
            item.collect.status !== CollectStatus.CANCEL,
        );

        set({
          register: {
            ...get().register,
            flows: fuzzySearch(filterDocs, searchKeywords, status),
          },
        });
      });
    },

    requestArchiveCustomers: async () => {
      const {
        archiveCustomers: { startDate, endDate, searchKeywords, shopId },
      } = get();
      const params: any = {};

      // if (startDate) {
      //   params.startDate = startDate;
      // }
      // if (endDate) {
      //   params.endDate = endDate;
      // }

      if (shopId) {
        params.shopId = shopId;
      }

      request.get('/customers/all', { params }).then(({ data }) => {
        const { docs } = data;
        set({
          archiveCustomers: {
            ...get().archiveCustomers,
            customers: fuzzySearch(docs, searchKeywords),
          },
        });
      });
    },

    async requestCustomerArchiveHistory(customerId) {
      const { data } = await request.get(
        `/flows/archive/history/${customerId}`,
      );
      return data;
    },

    async requestCustomerArchiveCourses(customerId) {
      const { data } = await request.get(
        `/flows/archive/courses/${customerId}`,
      );
      return data;
    },

    requestGetCollectionFlows: async () => {
      const {
        collection: { status, searchKeywords, startDate, endDate },
      } = get();
      const params: any = {};

      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      params.shopId = useAuthStore.getState().currentShopWithRole?.shop._id;

      request.get('/flows', { params }).then((res) => {
        const { docs } = res.data;
        const filterDocs = docs.filter(
          (item: FlowItemResponse) =>
            item.analyze.status !== AnalyzeStatus.CANCEL &&
            item.register.status !== RegisterStatus.CANCEL,
        );
        set({
          collection: {
            ...get().collection,
            flows: fuzzySearch(filterDocs, searchKeywords, status),
          },
        });
      });
    },
    async requestCustomerGrowthCurve(customerId) {
      const { data } = await request.get(
        `/customers/growth-curve/statistics/${customerId}`,
      );
      return data;
    },
    requestPutCustomerGrowthCurve: async (
      customerId: string,
      { height, weight }: { height: number; weight: number },
    ) => {
      const { data } = await request.put(
        `/customers/growth-curve/${customerId}`,
        {
          height,
          weight,
        },
      );
      return data;
    },
    requestPatchCustomerGrowthCurve: async (
      customerId: string,
      {
        height,
        weight,
        date,
      }: { height: number; weight: number; date: string },
    ) => {
      const { data } = await request.patch(
        `/customers/growth-curve/${customerId}`,
        {
          height,
          weight,
          date,
        },
      );
      return data;
    },

    requestGetAnalyzeFlows: async () => {
      const {
        analyze: { status, searchKeywords, startDate, endDate },
      } = get();
      const params: any = {};

      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      request.get('/flows', { params }).then((res) => {
        const { docs } = res.data;

        const filterDocs = docs.filter(
          (item: FlowItemResponse) =>
            item.collect.status !== CollectStatus.CANCEL &&
            item.register.status !== RegisterStatus.CANCEL &&
            item.collect.status !== CollectStatus.NOT_SET,
        );
        set({
          analyze: {
            ...get().analyze,
            flows: fuzzySearch(filterDocs, searchKeywords, status),
          },
        });
      });
    },

    requestGetEvaluateFlows: async () => {
      const {
        evaluate: { status, startDate, searchKeywords, endDate },
      } = get();
      const params: any = {};

      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      params.isDone = 1;

      request.get('/flows', { params }).then(({ data }) => {
        const { docs } = data;

        set({
          evaluate: {
            ...get().evaluate,
            flows: fuzzySearch(docs, searchKeywords, status, (flow) => {
              if (flow.evaluate.status === EvaluateStatus.NOT_SET) {
                return FlowStatus.ToBeEvaluated;
              } else {
                return FlowStatus.Evaluated;
              }
            }),
          },
        });
      });
      ``;
    },

    requestGetOperators: async () => {
      const params = {
        shopId: useAuthStore.getState().currentShopWithRole?.shop._id,
      };
      request.get('/users/operators', { params }).then(({ data }) => {
        set({ operators: data });
      });
    },

    requestPostCustomerArchive: async (customer) => {
      return request
        .post('/customers', {
          ...customer,
          shopId: get().archiveCustomers.shopId,
        })
        .then(({ data }) => {
          return data;
        });
    },

    requestPostRegisterInfo: async () => {
      // 发起登记
      const flow = get().currentFlow;

      const params = {
        phoneNumber: flow.customer.phoneNumber,
        name: flow.customer.name,
        gender: flow.customer.gender,
        birthday: flow.customer.birthday,
        nickname: flow.customer.nickname,
        allergy: flow.customer.allergy || flow.collect.healthInfo.allergy,
        operatorId: flow.collectionOperator?._id,
      };

      return request.post('/flows/register', params).then(({ data }) => {
        get().updateCurrentFlow(data);
        return data;
      });
    },

    requestDeleteCustomer: async (customerId) => {
      return request.delete(`/customers/${customerId}`);
    },

    requestPatchCustomerInfo: async () => {
      // 修改登记信息
      const flow = get().currentFlow;

      const params = {
        phoneNumber: flow.customer.phoneNumber,
        name: flow.customer.name,
        gender: flow.customer.gender,
        birthday: flow.customer.birthday,
        nickname: flow.customer.nickname,
        allergy: flow.customer.allergy || flow.collect.healthInfo.allergy,
        operatorId: flow.collectionOperator?._id,
      };

      return request
        .patch(`/flows/register/${flow._id}`, params)
        .then(({ data }) => {
          get().updateCurrentFlow(data);
          return data;
        })
        .catch((err) => {
          return err;
        });
    },

    requestPatchCustomerArchive: async (customer) => {
      return request
        .patch(`/customers/${customer._id}`, {
          ...customer,
        })
        .then(({ data }) => {
          return data;
        });
    },

    requestPatchRegisterStatus: async ({ status }) => {
      // 修改登记信息
      let flow = get().currentFlow;

      return request
        .patch(`/flows/register/status/${flow._id}`, {
          status,
        })
        .then(({ data }) => {
          get().updateCurrentFlow(data);
          return data;
        });
    },

    requestPatchCollectionStatus: async ({ status }) => {
      // 修改登记信息
      let flow = get().currentFlow;

      return request
        .patch(`/flows/collect/status/${flow._id}`, {
          status,
        })
        .then(({ data }) => {
          get().updateCurrentFlow(data);
          return data;
        });
    },

    requestPatchAnalyzeStatus: async ({ status }) => {
      // 修改登记信息
      let flow = get().currentFlow;

      return request
        .patch(`/flows/analyze/status/${flow._id}`, {
          status,
        })
        .then(({ data }) => {
          get().updateCurrentFlow(data);
          return data;
        });
    },

    requestPatchFlowToCollection: async () => {
      const currentFlow = get().currentFlow;

      if (!currentFlow._id) return;
      request
        .patch(`/flows/collection/${currentFlow._id}`, {
          collect: currentFlow.collect,
        })
        .then(({ data }) => {
          set({ currentFlow: data });
        });
    },

    requestPatchFlowToAnalyze: async () => {
      const currentFlow = get().currentFlow;
      request
        .patch(`/flows/analyze/${currentFlow._id}`, {
          analyze: currentFlow.analyze,
        })
        .then(({ data }) => {
          set({ currentFlow: data });
        });
    },

    requestPutFlowToEvaluate: async (evaluate) => {
      const currentFlow = get().currentFlow;
      request
        .put(`/flows/evaluate/${currentFlow._id}`, {
          score: evaluate?.score,
          remark: evaluate?.remark,
        })
        .then(({ data }) => {
          set({ currentFlow: data });
        });
    },

    requestStartAnalyze: async () => {
      const currentFlow = get().currentFlow;
      return request
        .patch(`/flows/analyze/${currentFlow._id}/start`)
        .then(({ data }) => {
          return data;
        });
    },

    updateCurrentFlow: (data) => {
      return set((state) => {
        state.currentFlow = produce(state.currentFlow, (draft) => {
          Object.assign(draft, data);
        });
      });
    },
    updateCurrentArchiveCustomer: (data) => {
      return set((state) => {
        state.currentArchiveCustomer = produce(
          state.currentArchiveCustomer,
          (draft) => {
            Object.assign(draft, data);
          },
        );
      });
    },

    updateCollection: (data) => {
      return set((state) => {
        state.currentFlow.collect = produce(
          state.currentFlow.collect,
          (draft) => {
            Object.assign(draft, data);
          },
        );
      });
    },

    updateAnalyze: (data) => {
      return set((state) => {
        state.currentFlow.analyze = produce(
          state.currentFlow.analyze,
          (draft) => {
            Object.assign(draft, data);
          },
        );
      });
    },

    addLingualImage: (data) => {
      return set((state) => {
        state.currentFlow.collect.healthInfo.lingualImage = [
          ...state.currentFlow.collect.healthInfo.lingualImage,
          data,
        ];
      });
    },

    updateLingualImage: (name: string, url: string) => {
      return set((state) => {
        const idx = state.currentFlow.collect.healthInfo.lingualImage.findIndex(
          (item) => {
            if (typeof item === 'object') {
              return item.name === name;
            }
          },
        );
        state.currentFlow.collect.healthInfo.lingualImage[idx] = url;
      });
    },

    removeLingualImage: (idx: number) => {
      return set((state) => {
        state.currentFlow.collect.healthInfo.lingualImage.splice(idx, 1);
      });
    },

    addOtherImage: (data) => {
      return set((state) => {
        state.currentFlow.collect.healthInfo.otherImages = [
          ...state.currentFlow.collect.healthInfo.otherImages,
          data,
        ];
      });
    },

    updateOtherImage: (name: string, url: string) => {
      return set((state) => {
        const idx = state.currentFlow.collect.healthInfo.otherImages.findIndex(
          (item) => {
            if (typeof item === 'object') {
              return item.name === name;
            }
          },
        );
        state.currentFlow.collect.healthInfo.otherImages[idx] = url;
      });
    },

    removeOtherImage: (idx: number) => {
      return set((state) => {
        state.currentFlow.collect.healthInfo.otherImages.splice(idx, 1);
      });
    },

    addLeftHandImage: (data) => {
      return set((state) => {
        state.currentFlow.collect.healthInfo.leftHandImages = [
          ...state.currentFlow.collect.healthInfo.leftHandImages,
          data,
        ];
      });
    },

    updateLeftHandImage: (name: string, url: string) => {
      return set((state) => {
        const idx =
          state.currentFlow.collect.healthInfo.leftHandImages.findIndex(
            (item) => {
              if (typeof item === 'object') {
                return item.name === name;
              }
            },
          );
        state.currentFlow.collect.healthInfo.leftHandImages[idx] = url;
      });
    },

    removeLeftHandImage: (idx: number) => {
      return set((state) => {
        state.currentFlow.collect.healthInfo.leftHandImages.splice(idx, 1);
      });
    },

    addRightHandImage: (data) => {
      return set((state) => {
        state.currentFlow.collect.healthInfo.rightHandImages = [
          ...state.currentFlow.collect.healthInfo.rightHandImages,
          data,
        ];
      });
    },

    updateRightHandImage: (name: string, url: string) => {
      return set((state) => {
        const idx =
          state.currentFlow.collect.healthInfo.rightHandImages.findIndex(
            (item) => {
              if (typeof item === 'object') {
                return item.name === name;
              }
            },
          );
        state.currentFlow.collect.healthInfo.rightHandImages[idx] = url;
      });
    },

    removeRightHandImage: (idx: number) => {
      return set((state) => {
        state.currentFlow.collect.healthInfo.rightHandImages.splice(idx, 1);
      });
    },

    addAudioFile: (data) => {
      return set((state) => {
        state.currentFlow.collect.healthInfo.audioFiles = [
          ...state.currentFlow.collect.healthInfo.audioFiles,
          data,
        ];
      });
    },

    updateAudioFile: (name: string, url: string) => {
      return set((state) => {
        const idx = state.currentFlow.collect.healthInfo.audioFiles.findIndex(
          (item) => {
            if (typeof item === 'object') {
              return item.name === name;
            }
          },
        );
        state.currentFlow.collect.healthInfo.audioFiles[idx].uri = url;
      });
    },

    removeAudioFile: (idx: number) => {
      return set((state) => {
        state.currentFlow.collect.healthInfo.audioFiles.splice(idx, 1);
      });
    },

    updateSolutionApplication: (application, idx) => {
      return set((state) => {
        state.currentFlow.analyze.solution.applications[idx] = application;
      });
    },

    addSolutionApplication: (application) => {
      return set((state) => {
        state.currentFlow.analyze.solution.applications.push(application);
      });
    },

    removeSolutionApplication: (idx) => {
      return set((state) => {
        state.currentFlow.analyze.solution.applications.splice(idx, 1);
      });
    },

    updateSolutionMassage: (massage, idx) => {
      return set((state) => {
        state.currentFlow.analyze.solution.massages[idx] = massage;
      });
    },

    addSolutionMassage: (massage) => {
      return set((state) => {
        state.currentFlow.analyze.solution.massages.push(massage);
      });
    },

    removeSolutionMassage: (idx) => {
      return set((state) => {
        state.currentFlow.analyze.solution.massages.splice(idx, 1);
      });
    },

    updateAnalyzeRemark: (remark) => {
      return set((state) => {
        state.currentFlow.analyze.remark = remark;
      });
    },

    updateFollowUp: (followUp) => {
      return set((state) => {
        state.currentFlow.analyze.followUp = {
          ...state.currentFlow.analyze.followUp,
          ...followUp,
          followUpTime:
            followUp.followUpTime || dayjs().format('YYYY-MM-DD HH:mm'),
        };
      });
    },

    updateNextTime: (next) => {
      return set((state) => {
        state.currentFlow.analyze.next = {
          ...state.currentFlow.analyze.next,
          ...next,
          nextTime: next.nextTime || dayjs().format('YYYY-MM-DD HH:mm'),
        };
      });
    },

    updateEvaluate: (evaluate) => {
      return set((state) => {
        state.currentFlow.evaluate = {
          ...state.currentFlow.evaluate,
          ...evaluate,
        };
      });
    },

    getFlowOperatorConfigByUser(type: FlowStatus) {
      const FlowOperatorConfig: FlowOperatorConfigItem[] = [
        {
          text: '健康资料',
          key: FlowOperatorKey.healthInfo,
          auth: RoleAuthority.FLOW_COLLECTION,
          disabled: false,
        },
        {
          text: '调理导向',
          key: FlowOperatorKey.guidance,
          auth: RoleAuthority.FLOW_COLLECTION,
          disabled: false,
        },
        {
          text: '分析结论',
          key: FlowOperatorKey.conclusions,
          auth: RoleAuthority.FLOW_ANALYZE,
          disabled: false,
        },
        {
          text: '调理方案',
          key: FlowOperatorKey.solution,
          auth: RoleAuthority.FLOW_ANALYZE,
          disabled: false,
        },
      ];
      if (type === FlowStatus.ToBeAnalyzed) {
        return {
          configs: FlowOperatorConfig.map((item) => {
            if (item.auth != RoleAuthority.FLOW_ANALYZE) {
              item.disabled = true;
            }
            return item;
          }),
          selectIdx: 2,
        };
      } else {
        return {
          configs: FlowOperatorConfig.filter(
            (item) => item.auth != RoleAuthority.FLOW_ANALYZE,
          ),
          selectIdx: 0,
        };
      }
    },

    updateRegisterFilter(data) {
      return set((state) => {
        state.register = { ...state.register, ...data };
      });
    },

    updateCollectionFilter(data) {
      return set((state) => {
        state.collection = { ...state.collection, ...data };
      });
    },

    updateAnalyzeFilter(data) {
      return set((state) => {
        state.analyze = { ...state.analyze, ...data };
      });
    },

    updateEvaluateFilter(data) {
      return set((state) => {
        state.evaluate = { ...state.evaluate, ...data };
      });
    },

    updateArchiveCustomersFilter(data) {
      return set((state) => {
        state.archiveCustomers = { ...state.archiveCustomers, ...data };
      });
    },

    updateCustomersFollowupFilter(data) {
      return set((state) => {
        state.customersFollowUp = { ...state.customersFollowUp, ...data };
      });
    },

    // 客户随访
    async requestGetFollowUps() {
      const {
        customersFollowUp: { shopId, startDate, endDate, searchKeywords },
      } = get();
      const params: any = {};

      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      if (shopId) {
        params.shopId = shopId;
      }

      params.isDone = 1;

      request.get('/flows', { params }).then(({ data }) => {
        const { docs } = data;

        set({
          customersFollowUp: {
            ...get().customersFollowUp,
            flows: fuzzySearch(
              generateFollowUpFlows(docs).flows,
              searchKeywords,
            ),
          },
        });
      });
    },

    async requestPatchFollowUp(followUp: Partial<FollowUp>) {
      const currentFlow = get().currentFlow;

      request
        .patch(`/flows/follow-up/${currentFlow._id}`, {
          ...followUp,
        })
        .then(({ data }) => {
          set({ currentFlow: data });
        });
    },

    async requestGetStatisticFlow({ startDate, endDate, shopId }) {
      const params: any = {};

      params.startDate = startDate;
      params.endDate = endDate;
      params.shopId = shopId;

      request.get('/flows/statistics/flow', { params }).then(({ data }) => {
        data.counts = generateFlowCounts(data.flows);

        set({
          statisticShop: data,
        });
        get().calculateStatisticFlowWithDate(data, startDate, endDate);
      });
    },

    calculateStatisticFlowWithDate(data, startDate, endDate) {
      const dateRange = generateDateRange(startDate, endDate);
      for (let i = 0; i < data.flows.length; i++) {
        const flow = data.flows[i];
        const date = dayjs(flow.analyze.updatedAt).format('YYYY-MM-DD');
        if (date) {
          const massageCount = flow.analyze.solution.massages.reduce(
            (sum: number, item: { count: number }) => {
              return sum + item.count;
            },
            0,
          );
          if (dateRange[date]) {
            dateRange[date].massage += massageCount;
            const applicationsCount = flow.analyze.solution.applications.reduce(
              (sum: number, item: { count: number }) => {
                return sum + item.count;
              },
              0,
            );
            dateRange[date].application += applicationsCount;
          }
        }
      }
      let statisticCountWithDate = [];
      for (let key in dateRange) {
        statisticCountWithDate.push({ date: key, counts: dateRange[key] });
      }

      set({
        statisticFlowWithDate: statisticCountWithDate,
      });
    },

    async requestGetStatisticFlowWithShop({ startDate, endDate }) {
      const params: any = {};

      params.startDate = startDate;
      params.endDate = endDate;

      request
        .get('/flows/statistics/flow-with-shop', { params })
        .then(({ data }: { data: StatisticShop[] }) => {
          const statistics = data;

          for (let i = 0; i < statistics.length; i++) {
            // 统计每个店铺的流程数量
            statistics[i].counts = generateFlowCounts(statistics[i].flows);
          }

          set({
            statisticShops: statistics.sort((a: any, b: any) => {
              return b.counts.analyze - a.counts.analyze;
            }),
          });
        });
    },
  })),
);

export default useFlowStore;

const generateDateRange = (startDate: string, endDate: string) => {
  const dateRange: any = {};
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const formattedDate = currentDate.toISOString().split('T')[0]; // 格式化日期为 'YYYY-MM-DD'

    dateRange[formattedDate] = {
      massage: 0,
      application: 0,
    };

    currentDate.setDate(currentDate.getDate() + 1); // 增加一天
  }

  return dateRange;
};
