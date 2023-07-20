import { FlowOperatorConfig } from '../constants';

export function getAge(birthday: string) {
  if (birthday) {
    const birthdays = birthday.split('-');
    // 新建日期对象
    let date = new Date();
    // 今天日期，数组，同 birthday
    let today = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    // 分别计算年月日差值
    let age = today.map((val, index) => {
      return val - +birthdays[index];
    });
    // 当天数为负数时，月减 1，天数加本月总天数
    if (age[2] < 0) {
      // 获取当月总天数的方法
      let curMonth = new Date(today[0], today[1], 0);
      age[1]--;
      age[2] += curMonth.getDate();
    }
    // 当月数为负数时，年减 1，月数加上 12
    if (age[1] < 0) {
      age[0]--;
      age[1] += 12;
    }
    return {
      year: age[0],
      month: age[1],
      day: age[2],
    };
  }
}

export function getFlowOperatorConfigByUser() {
  return FlowOperatorConfig;
}

export function getBase64ImageFormat(base64String: string): string | null {
  const formats: { [key: string]: string } = {
    jpeg: 'data:image/jpeg;base64,',
    png: 'data:image/png;base64,',
    gif: 'data:image/gif;base64,',
    webp: 'data:image/webp;base64,',
    bmp: 'data:image/bmp;base64,',
    svg: 'data:image/svg+xml;base64,',
    tiff: 'data:image/tiff;base64,',
    ico: 'data:image/x-icon;base64,',
    jp2: 'data:image/jp2;base64,',
    jxr: 'data:image/jxr;base64,',
    heic: 'data:image/heic;base64,',
    heif: 'data:image/heif;base64,',
  };

  for (const format in formats) {
    if (base64String.startsWith(formats[format])) {
      return format;
    }
  }

  return 'png';
}
