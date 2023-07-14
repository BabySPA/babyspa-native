import { create } from 'zustand';
import request from '~/app/api';
import { DOCTOR_ROLE_ID } from '../constants';

export enum CustomerStatus {
  Completed = 0, // 已完成
  Canceled, // 已取消
  ToBeCollected, // 待收集
  ToBeAnalyzed, // 待分析
  ToBeConfirmed, // 待确认
}

export interface Customer {
  operator: {
    id: string;
    name: string;
    phoneNumber: string;
  };
  id: string;
  name: string;
  gender: number;
  birthday: string;
  nickname: string;
  phoneNumber: string;
  status: CustomerStatus;
  updatedAt: string;
  tag: string;
}

interface Operator {
  gender: number;
  name: string;
  phoneNumber: string;
  roleKey: string;
  username: string;
}
interface FlowState {
  operators: Operator[];
  register: {
    customers: Customer[];
    page: number;
    hasNextPage: boolean;
    searchKeywords: string;
    startDate: string;
    endDate: string;
    status: CustomerStatus | -1;
  };

  getRegisterCustomers: () => Promise<void>;
  getOperators: () => Promise<void>;
}

const useFlowStore = create<FlowState>((set, get) => ({
  register: {
    customers: [],
    page: 1,
    hasNextPage: false, // hasNextPage:false
    searchKeywords: '',
    status: -1,
    startDate: '',
    endDate: '',
  },
  operators: [],

  getRegisterCustomers: async () => {
    const {
      register: { searchKeywords, status, startDate, endDate, page },
    } = get();
    const params: any = {
      page: page,
      pageSize: 20,
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
}));

export default useFlowStore;
