import { create } from 'zustand';
import request from '~/app/api';
import useAuthStore from './auth';
import dayjs from 'dayjs';
import { Customer } from './flow/type';
export enum MessageAction {
  COLLECTION_TODO = 'COLLECTION_TODO',
  COLLECTION_UPDATE = 'COLLECTION_UPDATE',
  ANALYZE_UPDATE = 'ANALYZE_UPDATE',
  FOLLOWUP_TODO = 'FOLLOWUP_TODO',
}
export interface Message {
  _id: string;
  operatorId: string;
  shopId: string;
  flowId: string;
  customerId: string;
  customer: Customer;
  hasRead: boolean;
  action: MessageAction;
  updatedAt: string;
}
interface MessageState {
  messages: Message[];
  unReadCount: number;
  clearCache: () => void;
  requestMessages: () => Promise<void>;
  readMessage: (id: string) => Promise<boolean>;
}

const initialState = {
  messages: [],
  unReadCount: 0,
};

const useMessageStore = create<MessageState>((set, get) => ({
  ...initialState,
  clearCache: () => {
    set({ ...initialState });
  },

  requestMessages: async () => {
    const { currentShopWithRole } = useAuthStore.getState();

    const params = {
      roleKey: currentShopWithRole?.role.roleKey,
      shopId: currentShopWithRole?.shop._id,
      startDate: dayjs().format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
    };

    const { data } = await request.get('/messages', { params });
    const messages = data.docs;
    const unReadCount = messages.filter(
      (message: Message) => !message.hasRead,
    ).length;
    set({ messages: messages, unReadCount: unReadCount });
  },

  readMessage: async (id) => {
    const { data } = await request.get('/messages/read/' + id);
    if (data) {
      set({
        messages: get().messages.map((message) => {
          if (message._id === id) {
            message.hasRead = true;
          }
          return message;
        }),
        unReadCount: get().unReadCount - 1,
      });
    }
    return data;
  },
}));

export default useMessageStore;
