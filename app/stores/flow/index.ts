import { create } from 'zustand';
import request from '~/app/api';
import { DOCTOR_ROLE_ID } from '../../constants';
import dayjs from 'dayjs';
import { immer } from 'zustand/middleware/immer';
import { produce } from 'immer';
import { upload } from '../../api/upload';
import { CustomerStatus } from '../../types';
import useOssStore from '../oss';
import {
  MediaTypeOptions,
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import { toastAlert } from '../../utils/toast';
import { getBase64ImageFormat } from '../../utils';
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
  conclusions: [],
  solution: {
    applications: [],
    massages: [],
    operatorId: '',
    remark: '',
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

    setCurrentRegisterCustomer: (data) => {
      return set((state) => {
        state.currentRegisterCustomer = produce(
          state.currentRegisterCustomer,
          (draft) => {
            Object.assign(draft, data);
          },
        );
      });
    },

    setCurrentFlowCustomer: (data) => {
      return set((state) => {
        state.currentFlowCustomer = produce(
          state.currentFlowCustomer,
          (draft) => {
            Object.assign(draft, data);
          },
        );
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

    uploadFile: async (uri: string, fileName: string) => {
      const name = `${get().currentFlowCustomer.tag}-${
        get().currentFlowCustomer.flowId
      }-${dayjs().format('YYYYMMDDHHmmss')}-${fileName}`;

      const oss = await useOssStore.getState().getOssConfig();
      return upload(uri, name, oss);
    },

    openMediaLibrary: (toast) => {
      return new Promise((resolve, reject) => {
        requestMediaLibraryPermissionsAsync()
          .then((res) => {
            if (res.status !== 'granted') {
              toastAlert(toast, 'error', '请授予相册权限');
            } else {
              launchImageLibraryAsync({
                mediaTypes: MediaTypeOptions.Images,
                allowsMultipleSelection: false,
                allowsEditing: false,
                quality: 0.1,
              })
                .then(async (res) => {
                  if (res.assets && res.assets.length > 0) {
                    const selectImageFile = res.assets[0];

                    const fileUrl = await get().uploadFile(
                      selectImageFile.uri,
                      selectImageFile.fileName ??
                        `${Date.now()}.${getBase64ImageFormat(
                          selectImageFile.uri,
                        )}`,
                    );

                    resolve(fileUrl);
                  }
                })
                .catch((err) => {
                  reject(err);
                });
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  })),
);

export default useFlowStore;
