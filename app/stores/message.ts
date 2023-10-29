import { create } from 'zustand';
import request from '~/app/api';
import useAuthStore from './auth';
import dayjs from 'dayjs';
import { Customer } from './flow/type';
import Environment from '../config/environment';
import JPush from 'jpush-react-native';
export enum MessageAction {
  UPDATE_FLOWS = 'UPDATE_FLOWS',
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
  socket: WebSocket | null;
  messages: Message[];
  unReadCount: number;
  clearCache: () => void;
  logoutSocket: () => void;
  loginSocket: () => void;
  getSocketInstance: () => WebSocket;
  closeSocket: () => void;
  requestMessages: () => Promise<void>;
  requestDeleteAllMessage: () => Promise<void>;
  readMessage: (id: string) => Promise<boolean>;
}

const initialState = {
  messages: [],
  unReadCount: 0,
  socket: null,
};

const useMessageStore = create<MessageState>((set, get) => ({
  ...initialState,
  clearCache: () => {
    set({ ...initialState });
  },

  getSocketInstance: () => {
    let appSocket = get().socket;

    if (!appSocket || appSocket?.readyState === appSocket.CLOSED) {
      appSocket = new WebSocket(Environment.api.ws);
      set({ socket: appSocket });
    }

    return appSocket;
  },

  closeSocket: () => {
    const appSocket = get().getSocketInstance();
    if (appSocket && appSocket?.readyState !== appSocket.CLOSED) {
      get().logoutSocket();
      try {
        appSocket.close();
      } catch (error) {
        console.log(error);
      }
    }
  },

  loginSocket: () => {
    const appSocket = get().getSocketInstance();
    if (appSocket && appSocket?.readyState === appSocket.OPEN) {
      const { currentShopWithRole, user } = useAuthStore.getState();
      // 发送消息登录socket
      const message = {
        event: 'message', // 事件名称
        data: JSON.stringify({
          type: 'login',
          data: {
            shopId: currentShopWithRole?.shop._id,
            userId: user?.id,
            roleKey: currentShopWithRole?.role.roleKey,
          },
        }), // 消息内容
      };
      try {
        appSocket.send(JSON.stringify(message));

        JPush.setAlias({
          sequence: 1,
          alias: user?.id as string,
        });
      } catch (error) {
        console.log(error);
      }
    }
  },

  logoutSocket: () => {
    // 发送消息登录socket
    const appSocket = get().getSocketInstance();
    if (appSocket && appSocket?.readyState === appSocket.OPEN) {
      const { currentShopWithRole, user } = useAuthStore.getState();
      const message = {
        event: 'message', // 事件名称
        data: JSON.stringify({
          type: 'logout',
          data: {
            shopId: currentShopWithRole?.shop._id,
            userId: user?.id,
            roleKey: currentShopWithRole?.role.roleKey,
          },
        }), // 消息内容
      };
      try {
        appSocket.send(JSON.stringify(message));
        JPush.deleteAlias({
          sequence: 1,
        });
        JPush.deleteTags({ sequence: 1 });
      } catch (error) {
        console.log(error);
      }
    }
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

  requestDeleteAllMessage: async () => {
    await request.delete('/messages');

    set({ messages: [], unReadCount: 0 });
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
