import { create } from "zustand";
import request from "~/app/api";

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

interface FlowState {
  registers: Customer[];
  searchKeywords: string;
  startDate: string;
  endDate: string;
  status: CustomerStatus | -1;
  page: number;
  hasNextPage: boolean;
  getRegisterCustomers: () => Promise<void>;
}

const useFlowStore = create<FlowState>((set, get) => ({
  registers: [],
  searchKeywords: "",
  status: -1,
  startDate: "",
  endDate: "",
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
    if (status !== -1) {
      params.status = status;
    }
    if (startDate) {
      params.startDate = startDate;
    }
    if (endDate) {
      params.endDate = startDate;
    }

    request.get("/customers", { params }).then(({ data }) => {
      const { docs, hasNextPage } = data;
      set({ registers: docs, hasNextPage: hasNextPage });
    });
  },
}));

export default useFlowStore;
