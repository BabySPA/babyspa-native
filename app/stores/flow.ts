import { create } from 'zustand';
import request from '~/app/api';

export enum CustomerStatus {
  All = -1, // 全部
  Completed = 0, // 已完成
  Canceled, // 已取消
  ToBeCollected, // 待收集
  ToBeAnalyzed, // 待分析
  ToBeConfirmed, // 待确认
}

interface Register {
  operator: {
    id: string;
    name: string;
    phoneNumber: string;
  };
  id: string;
  name: string;
  phoneNumber: string;
  status: CustomerStatus;
  updatedAt: string;
}

interface FlowState {
  registers: Register[];
  searchKeywords: string;
  startDate: string;
  endDate: string;
  status: CustomerStatus;
  page: number;
  hasNextPage: boolean;
  getRegisterCustomers: () => Promise<void>;
}

const useFlowStore = create<FlowState>((set, get) => ({
  registers: [],
  searchKeywords: '',
  status: CustomerStatus.All,
  startDate: '',
  endDate: '',
  page: 1,
  hasNextPage: false, // hasNextPage:false

  getRegisterCustomers: async () => {
    const { searchKeywords, status, startDate, endDate, page } = get();
    const params: any = {
      page: page,
      pageSize: 20,
    };
    if (searchKeywords) {
      params.search = searchKeywords;
    }
    if (status !== CustomerStatus.All) {
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
      set({ registers: docs, hasNextPage: hasNextPage });
    });
  },
}));

export default useFlowStore;
