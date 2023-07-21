import axios from 'axios';
import request from '~/app/api';
import * as mime from 'react-native-mime-types';
import { OssConfig } from '../types';

export async function upload(uri: string, fileName: string, oss: OssConfig) {
  const key = fileName;
  const formdata = new FormData(); // 注意参数的顺序，key 必须是第一位，表示OSS存储文件的路径

  formdata.append('key', key);
  formdata.append('OSSAccessKeyId', oss.accessId);
  formdata.append('policy', oss.policy);
  formdata.append('signature', oss.signature); // 文件上传成功默认返回 204 状态码，可根据需要修改为 200
  formdata.append('success_action_status', '200'); // file 必须放在最后一位
  // @ts-ignore
  formdata.append('file', {
    uri: uri,
    type: mime.lookup(uri),
    name: key,
  });

  axios
    .post(oss.host, formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      console.log('upload success', res);
      if (res?.status === 200) {
        return Promise.resolve(oss.host + '/' + key);
      } else {
        return Promise.reject(res);
      }
    })
    .catch((err) => {
      console.log('upload fail', err);

      return Promise.reject(err);
    });
}
