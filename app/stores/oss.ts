import { create } from 'zustand';
import request from '~/app/api';
import { OssConfig } from '../types';
import dayjs from 'dayjs'

interface OssState {
  oss: OssConfig;
  requestGetOssConfig: () => Promise<OssConfig>;
  getOssConfig: () => Promise<OssConfig>;
}

const useOssStore = create<OssState>((set, get) => ({
  oss: {
    accessId: '',
    host: '',
    policy: '',
    signature: '',
    expire: 0,
  },
  // 获取上传签名
  requestGetOssConfig: async () => {
    // 这是上面 Nest 服务端生成签名信息的接口地址
    const { data } = await request.get<OssConfig>('/oss/signature');
    set({ oss: data });
    return data;
  },

  getOssConfig: () => {
    const oss = get().oss;
    if (oss.expire > dayjs().unix()) {
      return Promise.resolve(oss);
    } else {
      return get().requestGetOssConfig();
    }
  },
}));

export default useOssStore;
