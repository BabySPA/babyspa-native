import { create } from 'zustand';
import request from '~/app/api';
import { OssConfig } from '../types';

interface OssState {
  oss: OssConfig;
  requestGetOssConfig: () => Promise<OssConfig>;
}

const useOssStore = create<OssState>((set, get) => ({
  oss: {
    accessId: '',
    host: '',
    policy: '',
    signature: '',
  },
  // 获取上传签名
  requestGetOssConfig: async () => {
    // 这是上面 Nest 服务端生成签名信息的接口地址
    const { data } = await request.get<OssConfig>('/oss/signature');
    set({ oss: data });
    return data;
  },
}));

export default useOssStore;
