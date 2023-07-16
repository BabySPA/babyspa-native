import { create } from 'zustand';
import request from '~/app/api';
import { CustomerStatus, DOCTOR_ROLE_ID, Gender } from '../constants';
import dayjs from 'dayjs';
import { immer } from 'zustand/middleware/immer';
import { produce } from 'immer';
import { mountStoreDevtool } from 'simple-zustand-devtools';
export interface Customer {
  operator: OperatorInfo;
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
}

interface Operator {
  gender: Gender;
  name: string;
  phoneNumber: string;
  roleKey: string;
  username: string;
}

interface OperatorInfo {
  id: string;
  name: string;
  phoneNumber: string;
}

interface RegisterCustomerInfo {
  name: string;
  nickname: string;
  gender: number;
  birthday: string;
  phoneNumber: string;
  allergy: string;
  operator: OperatorInfo | null;
}

interface RegisterAndCollection {
  customers: Customer[];
  page: number;
  hasNextPage: boolean;
  searchKeywords: string;
  startDate: string;
  endDate: string;
  status: CustomerStatus | -1;
}
interface FlowState {
  operators: Operator[];
  register: RegisterAndCollection;
  collection: RegisterAndCollection;
  analyze: RegisterAndCollection;

  currentCustomer: Partial<RegisterCustomerInfo>;

  requestRegisterCustomers: () => Promise<void>;
  requestCollectionCustomers: () => Promise<void>;
  requestAnalyzeCustomers: () => Promise<void>;
  getOperators: () => Promise<void>;
  requestPostCustomerInfo: () => Promise<any>;
  setCurrentRegisterCustomer: (data: Partial<RegisterCustomerInfo>) => void;
}

const defaultRegisterAndCollection = {
  customers: [],
  page: 1,
  hasNextPage: false, // hasNextPage:false
  searchKeywords: '',
  status: -1,
  startDate: '',
  endDate: '',
};
const useFlowStore = create(
  immer<FlowState>((set, get) => ({
    register: defaultRegisterAndCollection,
    collection: defaultRegisterAndCollection,
    analyze: defaultRegisterAndCollection,
    operators: [],

    currentCustomer: {
      name: '',
      nickname: '',
      gender: 1,
      birthday: dayjs().format('YYYY-MM-DD'),
      phoneNumber: '',
      allergy: '',
      operator: null,
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

    getOperators: async () => {
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
        state.currentCustomer = produce(state.currentCustomer, (draft) => {
          Object.assign(draft, data);
        });
      });
    },

    requestPostCustomerInfo: async () => {
      // 发起登记
      const customer = get().currentCustomer;

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
  })),
);

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('FlowStore', useFlowStore);
}

export default useFlowStore;
