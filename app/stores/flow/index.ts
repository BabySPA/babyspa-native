import { create } from 'zustand';
import request from '~/app/api';
import { FlowOperatorConfig, SolutionDefault } from '../../constants';
import dayjs from 'dayjs';
import { immer } from 'zustand/middleware/immer';
import { produce } from 'immer';
import { CustomerStatus } from '../../types';
import { FlowState, FollowUpStatus } from './type';
import useAuthStore from '../auth';
import { RoleAuthority } from '../auth/type';
import { reject } from 'lodash';
import { fuzzySearch } from '~/app/utils';
import { ShopType } from '../manager/type';

const defaultRegisterAndCollection = {
  customers: [],
  searchKeywords: '',
  status: -1,
  statusCount: {},
  startDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
};

export const DefaultRegisterCustomer = {
  name: '',
  nickname: '',
  gender: 1,
  birthday: dayjs().format('YYYY-MM-DD'),
  phoneNumber: '',
  allergy: '',
  operator: null,
  status: CustomerStatus.ToBeCollected,
};

const defaultFlow = {
  _id: '',
  customerId: '',
  collect: {
    healthInfo: {
      allergy: '',
      audioFiles: [],
      leftHandImages: [],
      rightHandImages: [],
      lingualImage: [],
      otherImages: [],
    },
    guidance: '',
    operatorId: '',
    updatedAt: new Date(),
  },
  analyze: {
    conclusion: '',
    solution: {
      applications: [],
      massages: [],
    },
    followUp: {
      followUpStatus: FollowUpStatus.NOT_SET,
      followUpTime: '',
    },
    next: {
      hasNext: false,
      nextTime: '',
    },
    remark: '',
    operatorId: '',
    updatedAt: new Date(),
  },
  evaluate: null,
  createdAt: '',
  updatedAt: '',
};

const initialState = {
  allCustomers: [],
  register: {
    ...defaultRegisterAndCollection,
    allStatus: [
      { label: '全部', value: -1 },
      { label: '待采集', value: CustomerStatus.ToBeCollected },
      { label: '待分析', value: CustomerStatus.ToBeAnalyzed },
      { label: '已完成', value: CustomerStatus.Completed },
    ],
  },
  collection: {
    ...defaultRegisterAndCollection,
    allStatus: [
      { label: '全部', value: -1 },
      { label: '待采集', value: CustomerStatus.ToBeCollected },
      { label: '待分析', value: CustomerStatus.ToBeAnalyzed },
      { label: '已完成', value: CustomerStatus.Completed },
    ],
  },
  analyze: {
    ...defaultRegisterAndCollection,
    allStatus: [
      { label: '全部', value: -1 },
      { label: '待分析', value: CustomerStatus.ToBeAnalyzed },
      { label: '已完成', value: CustomerStatus.Completed },
    ],
  },
  evaluate: {
    ...defaultRegisterAndCollection,
    allStatus: [
      { label: '全部', value: -1 },
      { label: '待评价', value: CustomerStatus.ToBeEvaluated },
      { label: '已评价', value: CustomerStatus.Evaluated },
    ],
  },
  currentFlow: defaultFlow,

  customersArchive: { ...defaultRegisterAndCollection, allStatus: [] },
  customersFollowUp: { ...defaultRegisterAndCollection },

  operators: [],

  currentRegisterCustomer: DefaultRegisterCustomer,

  currentFlowCustomer: {
    operator: null,
    id: '',
    name: '',
    gender: 1,
    birthday: '',
    nickname: '',
    phoneNumber: '',
    status: CustomerStatus.Completed,
    allergy: '',
    updatedAt: '',
    tag: '',
    flowId: '',
    shop: null,
    analyst: null,
    flowEvaluate: null,
  },
};

const useFlowStore = create(
  immer<FlowState>((set, get) => ({
    ...initialState,
    clearCache: () => {
      set({ ...initialState });
    },
    requestInitializeData: async () => {
      // 获取当前用户的信息
      const hasAuthority = useAuthStore.getState().hasAuthority;

      if (hasAuthority(RoleAuthority.FLOW_REGISTER, 'R')) {
        await get().requestRegisterCustomers();
      }
      if (hasAuthority(RoleAuthority.FLOW_COLLECTION, 'R')) {
        await get().requestCollectionCustomers();
      }
      if (hasAuthority(RoleAuthority.FLOW_ANALYZE, 'R')) {
        await get().requestAnalyzeCustomers();
      }
      if (hasAuthority(RoleAuthority.FLOW_EVALUATE, 'R')) {
        await get().requestEvaluateCustomers();
      }
    },
    requestAllCustomers: async (searchKeywords: string) => {
      const params: any = {
        search: searchKeywords,
      };
      request.get('/customers', { params }).then(({ data }) => {
        const { docs } = data;
        set({
          allCustomers: docs,
        });
      });
    },
    requestRegisterCustomers: async () => {
      const {
        register: { status, searchKeywords, startDate, endDate },
      } = get();
      const params: any = {};

      if (status !== -1) {
        params.status = status;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      params.shopId = useAuthStore.getState().currentShopWithRole?.shop._id;

      request.get('/customers', { params }).then(({ data }) => {
        const { docs, statusCount } = data;

        set({
          register: {
            ...get().register,
            customers: searchKeywords
              ? fuzzySearch(docs, searchKeywords)
              : docs,
            statusCount,
          },
        });
      });
    },

    requestCustomersArchive: async () => {
      const {
        customersArchive: { status, startDate, endDate, searchKeywords },
      } = get();
      const params: any = {};

      if (status !== -1) {
        params.status = status;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      const user = useAuthStore.getState().currentShopWithRole;
      if (user?.shop.type === ShopType.SHOP) {
        params.shopId = user?.shop._id;
      }

      request.get('/customers', { params }).then(({ data }) => {
        const { docs, statusCount } = data;
        set({
          customersArchive: {
            ...get().customersArchive,
            customers: searchKeywords
              ? fuzzySearch(docs, searchKeywords)
              : docs,
            statusCount,
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

    requestCollectionCustomers: async () => {
      const {
        collection: { status, startDate, searchKeywords, endDate },
      } = get();
      const params: any = {};
      if (status !== -1) {
        params.status = status;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      params.shopId = useAuthStore.getState().currentShopWithRole?.shop._id;

      request.get('/customers', { params }).then(({ data }) => {
        const { docs, statusCount } = data;
        set({
          collection: {
            ...get().collection,
            customers: searchKeywords
              ? fuzzySearch(docs, searchKeywords)
              : docs,
            statusCount,
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
      const { data } = await request.put(
        `/customers/growth-curve/${customerId}`,
        {
          height,
          weight,
        },
      );
      return data;
    },

    requestAnalyzeCustomers: async () => {
      const {
        analyze: { status, startDate, endDate, searchKeywords },
      } = get();
      const params: any = {};

      if (status !== -1) {
        params.status = status;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      request.get('/customers/analyzes', { params }).then(({ data }) => {
        const { docs, statusCount } = data;
        set({
          analyze: {
            ...get().analyze,
            customers: searchKeywords
              ? fuzzySearch(docs, searchKeywords)
              : docs,
            statusCount,
          },
        });
      });
    },

    requestEvaluateCustomers: async () => {
      const {
        evaluate: { status, startDate, searchKeywords, endDate },
      } = get();
      const params: any = {};
      if (status !== -1) {
        params.status = status;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      request.get('/customers/evaluates', { params }).then(({ data }) => {
        const { docs, statusCount } = data;

        set({
          evaluate: {
            ...get().evaluate,
            customers: searchKeywords
              ? fuzzySearch(docs, searchKeywords)
              : docs,
            statusCount,
          },
        });
      });
    },

    requestGetOperators: async () => {
      const params = {
        shopId: useAuthStore.getState().currentShopWithRole?.shop._id,
      };
      request.get('/users/operators', { params }).then(({ data }) => {
        set({ operators: data });
      });
    },

    requestPostCustomerInfo: async () => {
      // 发起登记
      const customer = get().currentRegisterCustomer;

      return request
        .post('/customers', {
          phoneNumber: customer.phoneNumber,
          name: customer.name,
          gender: customer.gender,
          birthday: customer.birthday,
          allergy: customer.allergy,
          nickname: customer.nickname,
          operatorId: customer.operator?.id,
        })
        .then(({ data }) => {
          set((state) => {
            state.currentRegisterCustomer = data;
          });
          return data;
        });
    },

    requestPatchCustomerInfo: async () => {
      // 修改登记信息
      const customer = get().currentRegisterCustomer;

      return request
        .patch(`/customers/${customer.id}`, {
          phoneNumber: customer.phoneNumber,
          name: customer.name,
          gender: customer.gender,
          birthday: customer.birthday,
          allergy: customer.allergy,
          nickname: customer.nickname,
          operatorId: customer.operator?.id,
        })
        .then(({ data }) => {
          get().updateCurrentRegisterCustomer({ status: data.status });
          return data;
        })
        .catch((err) => {
          return err;
        });
    },

    requestPatchCustomerStatus: async ({ status, type }) => {
      // 修改登记信息
      let customer;
      if (type === 'flow') {
        customer = get().currentFlowCustomer;
      } else {
        customer = get().currentRegisterCustomer;
      }

      return request
        .patch(`/customers/status/${customer.id}`, {
          status,
        })
        .then(({ data }) => {
          get().updateCurrentRegisterCustomer({ status: data.status });
          return data;
        });
    },

    requestGetFlow: async (flowId: string) => {
      return request.get(`/flows/${flowId}`).then(({ data }) => {
        const { applications, massages } = data.analyze.solution;

        if (applications.length === 0) {
          applications.push(SolutionDefault.application);
        }

        if (massages.length === 0) {
          massages.push(SolutionDefault.massage);
        }
        set({ currentFlow: data });
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

    updateCurrentRegisterCustomer: (data) => {
      return set((state) => {
        state.currentRegisterCustomer = produce(
          state.currentRegisterCustomer,
          (draft) => {
            Object.assign(draft, data);
          },
        );
      });
    },

    updateCurrentFlowCustomer: (data) => {
      return set((state) => {
        state.currentFlowCustomer = produce(
          state.currentFlowCustomer,
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

    getFlowOperatorConfigByUser(type: CustomerStatus) {
      if (type === CustomerStatus.ToBeAnalyzed) {
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

    // 客户随访
    async requestGetFollowUps() {
      const {
        customersFollowUp: { status, startDate, endDate, searchKeywords },
      } = get();
      const params: any = {};

      if (status !== -1) {
        params.status = status;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      const user = useAuthStore.getState().currentShopWithRole;
      if (user?.shop.type === ShopType.SHOP) {
        params.shopId = user?.shop._id;
      }

      request.get('/customers/follow-ups', { params }).then(({ data }) => {
        const { docs } = data;
        set({
          customersFollowUp: {
            ...get().customersFollowUp,
            customers: searchKeywords
              ? fuzzySearch(docs, searchKeywords)
              : docs,
          },
        });
      });
    },
  })),
);

export default useFlowStore;
