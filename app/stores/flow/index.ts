import { create } from 'zustand';
import request from '~/app/api';
import { DOCTOR_ROLE_ID } from '../../constants';
import dayjs from 'dayjs';
import { immer } from 'zustand/middleware/immer';
import { produce } from 'immer';
import { CustomerStatus } from '../../types';
import { FlowState } from './type';

const defaultRegisterAndCollection = {
  customers: [],
  page: 1,
  hasNextPage: false, // hasNextPage:false
  searchKeywords: '',
  status: -1,
  startDate: '',
  endDate: '',
};

const defaultFlow = {
  _id: '',
  customerId: '',
  healthInfo: {
    allergy: '',
    audioFiles: [],
    leftHandImages: [],
    rightHandImages: [],
    lingualImage: [],
    otherImages: [],
  },
  guidance: '',
  conclusions: [
    {
      content: '小儿感冒',
      updatedAt: new Date().toString(),
      operator: {
        id: '',
        name: '张三',
        phoneNumber: '12345678901',
      },
    },
    {
      content: '小儿感冒',
      updatedAt: new Date().toString(),
      operator: {
        id: '',
        name: '张三',
        phoneNumber: '12345678901',
      },
    },
    {
      content: '小儿感冒',
      updatedAt: new Date().toString(),
      operator: {
        id: '',
        name: '张三',
        phoneNumber: '12345678901',
      },
    },
  ],
  solution: {
    applications: [
      {
        name: '丁桂儿脐贴',
        count: 3,
        duration: 240000,
        acupoint: '太阳穴',
      },
    ],
    massages: [
      {
        name: '小儿推拿',
        count: 3,
        remark:
          '胃经↓2  运水入土2  脾经个3  内劳宫2  小肠经↓7 阴池1  大肠经↓7 内关1  肺经↓7 三关肺↓7  心经↓1 天河水↓5  肝经↓1 六腑↓5 肾经个5 脊柱↓11  板门K1 七节骨↓50  板门推向横纹 150 三阴交',
      },
    ],
    operatorId: '12345',
    remark: '多挤捏板门，促进胃蠕动，助消化',
  },
  followUp: {
    isFollowed: false,
    followUpTime: '',
  },
  evaluation: {
    rating: 5,
    content: '',
    updatedAt: '',
    operatorId: '',
  },
  createdAt: '',
  updatedAt: '',
};

const useFlowStore = create(
  immer<FlowState>((set, get) => ({
    register: defaultRegisterAndCollection,
    collection: defaultRegisterAndCollection,
    analyze: defaultRegisterAndCollection,
    currentFlow: defaultFlow,
    operators: [],

    currentRegisterCustomer: {
      name: '',
      nickname: '',
      gender: 1,
      birthday: dayjs().format('YYYY-MM-DD'),
      phoneNumber: '',
      allergy: '',
      operator: null,
    },

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
    },

    guidanceTemplate: [
      {
        key: '咳嗽',
        children: [
          '晨起咳嗽',
          '上半夜咳',
          '下半夜咳',
          '咳嗽有痰',
          '干咳',
          '偶尔咳嗽',
        ],
      },
      {
        key: '感冒',
        children: ['头痛', '流鼻涕', '清鼻涕', '黄鼻涕'],
      },
    ],

    requestRegisterCustomers: async () => {
      const {
        register: { searchKeywords, status, startDate, endDate, page },
      } = get();
      const params: any = {
        page: page,
        pageSize: 100,
      };
      if (searchKeywords) {
        params.search = searchKeywords;
      }
      if (status !== -1) {
        params.status = status;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = startDate;
      }

      request.get('/customers', { params }).then(({ data }) => {
        const { docs, hasNextPage } = data;
        set({
          register: {
            ...get().register,
            customers: docs,
            hasNextPage: hasNextPage,
          },
        });
      });
    },

    requestCollectionCustomers: async () => {
      const {
        register: { searchKeywords, status, startDate, endDate, page },
      } = get();
      const params: any = {
        page: page,
        pageSize: 100,
      };
      if (searchKeywords) {
        params.search = searchKeywords;
      }
      if (status !== -1) {
        params.status = status;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = startDate;
      }

      request.get('/customers', { params }).then(({ data }) => {
        const { docs, hasNextPage } = data;
        set({
          collection: {
            ...get().collection,
            customers: docs,
            hasNextPage: hasNextPage,
          },
        });
      });
    },

    requestAnalyzeCustomers: async () => {
      const {
        register: { searchKeywords, status, startDate, endDate, page },
      } = get();
      const params: any = {
        page: page,
        pageSize: 100,
      };
      if (searchKeywords) {
        params.search = searchKeywords;
      }
      if (status !== -1) {
        params.status = status;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = startDate;
      }

      request.get('/customers', { params }).then(({ data }) => {
        const { docs, hasNextPage } = data;
        set({
          analyze: {
            ...get().analyze,
            customers: docs,
            hasNextPage: hasNextPage,
          },
        });
      });
    },

    requestGetOperators: async () => {
      request
        .get('/users', {
          params: {
            roleKey: DOCTOR_ROLE_ID,
          },
        })
        .then(({ data }) => {
          set({ operators: data });
        });
    },

    requestPostCustomerInfo: async () => {
      // 发起登记
      const customer = get().currentRegisterCustomer;

      return request.post('/customers', {
        phoneNumber: customer.phoneNumber,
        name: customer.name,
        gender: customer.gender,
        birthday: customer.birthday,
        allergy: customer.allergy,
        nickname: customer.nickname,
        operatorId: customer.operator?.id,
      });
    },

    requestGetFlow: async (flowId: string) => {
      request.get(`/flows/${flowId}`).then(({ data }) => {
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

    updateCurrentFlow: (data) => {
      return set((state) => {
        state.currentFlow = produce(state.currentFlow, (draft) => {
          Object.assign(draft, data);
        });
      });
    },

    updateHealthInfo: (data) => {
      return set((state) => {
        state.currentFlow.healthInfo = produce(
          state.currentFlow.healthInfo,
          (draft) => {
            Object.assign(draft, data);
          },
        );
      });
    },

    addlingualImage: (data) => {
      return set((state) => {
        state.currentFlow.healthInfo.lingualImage = [
          ...state.currentFlow.healthInfo.lingualImage,
          data,
        ];
      });
    },

    updatelingualImage: (name: string, url: string) => {
      return set((state) => {
        const idx = state.currentFlow.healthInfo.lingualImage.findIndex(
          (item) => {
            if (typeof item === 'object') {
              return item.name === name;
            }
          },
        );
        state.currentFlow.healthInfo.lingualImage[idx] = url;
      });
    },

    addLeftHandImage: (data) => {
      return set((state) => {
        state.currentFlow.healthInfo.leftHandImages = [
          ...state.currentFlow.healthInfo.leftHandImages,
          data,
        ];
      });
    },

    updateLeftHandImage: (name: string, url: string) => {
      return set((state) => {
        const idx = state.currentFlow.healthInfo.leftHandImages.findIndex(
          (item) => {
            if (typeof item === 'object') {
              return item.name === name;
            }
          },
        );
        state.currentFlow.healthInfo.leftHandImages[idx] = url;
      });
    },

    addRightHandImage: (data) => {
      return set((state) => {
        state.currentFlow.healthInfo.rightHandImages = [
          ...state.currentFlow.healthInfo.rightHandImages,
          data,
        ];
      });
    },

    updateRightHandImage: (name: string, url: string) => {
      return set((state) => {
        const idx = state.currentFlow.healthInfo.rightHandImages.findIndex(
          (item) => {
            if (typeof item === 'object') {
              return item.name === name;
            }
          },
        );
        state.currentFlow.healthInfo.rightHandImages[idx] = url;
      });
    },

    addAudioFile: (data) => {
      return set((state) => {
        state.currentFlow.healthInfo.audioFiles = [
          ...state.currentFlow.healthInfo.audioFiles,
          data,
        ];
      });
    },

    updateAudioFile: (name: string, url: string) => {
      return set((state) => {
        const idx = state.currentFlow.healthInfo.audioFiles.findIndex(
          (item) => {
            if (typeof item === 'object') {
              return item.name === name;
            }
          },
        );
        state.currentFlow.healthInfo.audioFiles[idx] = url;
      });
    },
  })),
);

export default useFlowStore;
