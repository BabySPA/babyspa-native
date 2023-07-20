import axios from 'axios';
import request from '~/app/api';
import * as mime from 'react-native-mime-types';

export async function uploadFile(uri: string, fileName: string) {
  const ossData = await getOssData();
  const key = fileName;
  const formdata = new FormData(); // 注意参数的顺序，key 必须是第一位，表示OSS存储文件的路径

  formdata.append('key', key);
  formdata.append('OSSAccessKeyId', ossData.accessId);
  formdata.append('policy', ossData.policy);
  formdata.append('signature', ossData.signature); // 文件上传成功默认返回 204 状态码，可根据需要修改为 200
  formdata.append('success_action_status', '200'); // file 必须放在最后一位
  // @ts-ignore
  formdata.append('file', {
    uri: uri,
    type: mime.lookup(uri),
    name: key,
  });

  const res = await axios
    .post(ossData.host, formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .catch((err) => {
      console.log(err);
    });

  if (res?.status === 200) {
    alert('文件上传成功');
  }

  return '';
}

// 获取上传签名
const getOssData = async () => {
  // 这是上面 Nest 服务端生成签名信息的接口地址
  const res = await request.get('/oss/signature');
  return res.data;
};
