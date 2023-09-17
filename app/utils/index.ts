import {
  ConfigAuthTree,
  IConfigAuth,
  LayoutConfig,
  getFlowStatus,
} from '../constants';
import { AuthorityConfig, RoleAuthority } from '../stores/auth/type';
import {
  AnalyzeStatus,
  CollectStatus,
  Customer,
  EvaluateStatus,
  FlowItemResponse,
  GrowthCurveHeightComparison,
  GrowthCurveWeightComparison,
  RegisterStatus,
} from '../stores/flow/type';
import area from '~/app/constants/area.json';
import { FlowStatus } from '../types';
import dayjs from 'dayjs';

export function getAge(birthday: string) {
  if (dayjs(birthday).isAfter(dayjs()))
    return {
      year: 0,
      month: 0,
      day: 0,
    };
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

const commonSalt = 'babyspa-manager';

const chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const Base64 = {
  btoa: (input: string = '') => {
    let str = input;
    let output = '';

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = '='), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.",
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: (input: string = '') => {
    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded.",
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  },
};

export function decodePassword(str: string) {
  return Base64.atob(str).slice(commonSalt.length);
}

export function maskString(inputString: string) {
  const maskedPart = '*'.repeat(inputString.length);

  return maskedPart;
}

/**
 * 传入权限，获取权限文本 门店：信息登记、信息采集、信息分析 ；   客户：客户档案、客户随访；
 * @param auth
 * @returns
 */
export function generateRuleAuthText(auth: AuthorityConfig[]): string {
  let authTextObj: Record<string, string[]> = {};

  auth.forEach((config) => {
    const authorityObject = LayoutConfig.flatMap((tab) => tab.features).find(
      (feature) => feature.auth === config.authority,
    );

    if (authorityObject) {
      const tabText = LayoutConfig.find((tab) =>
        tab.features.includes(authorityObject),
      )?.text;

      if (tabText) {
        if (!authTextObj[tabText]) authTextObj[tabText] = [];
        authTextObj[tabText].push(authorityObject.text);
      }
    }
  });

  // 去除末尾的逗号并返回
  return generateUserAuthText(authTextObj);
}

/**
 * 传入 {"门店":["信息分析","评价反馈"],"客户":["客户档案"],"管理":["门店管理","员工管理","角色管理","模版管理","操作日志"],"统计":["门店统计","调理统计","分析统计","随访统计"]}
输出 门店：信息分析、评价反馈；客户：客户档案；管理：门店管理、员工管理、角色管理、模板管理、操作日志；统计：门店统计、调理统计、分析统计、随访统计 
*/
export function generateUserAuthText(auth: Record<string, string[]>) {
  let authTextObj: Record<string, string[]> = {};

  Object.keys(auth).forEach((key) => {
    if (auth[key].length > 0) {
      authTextObj[key] = auth[key];
    }
  });

  let authText = '';

  Object.keys(authTextObj).forEach((key) => {
    authText += `${key}：${authTextObj[key].join('、')}；`;
  });

  return authText;
}

export function generateAuthorityTreeConfig(
  auth: AuthorityConfig[],
): IConfigAuth[] {
  let config: IConfigAuth[] = [];
  ConfigAuthTree.forEach((node, nodeIdx) => {
    config.push(node);
    node.features.forEach((feature, featureIdx) => {
      let hasAuth = auth.findIndex((item) => item.authority == feature.auth);
      config[nodeIdx].features[featureIdx].hasAuth = hasAuth != -1;
    });
    config[nodeIdx].hasAuth = config[nodeIdx].features.every(
      (item) => item.hasAuth,
    );
  });

  return config;
}

export function generateAuthorityConfig(
  auth: IConfigAuth[],
): AuthorityConfig[] {
  let config: AuthorityConfig[] = [];
  auth.forEach((node) => {
    node.features.forEach((feature) => {
      if (feature.hasAuth) {
        config.push({
          authority: feature.auth,
          rw: 'RW',
        });
      }
    });
  });

  return config;
}

export function fuzzySearch<T>(
  data: T[],
  searchTerm: string,
  status?: FlowStatus,
  getFlowStatusFunction?: (flow: FlowItemResponse) => FlowStatus,
): T[] {
  let searchCheck = (item: any) => true;
  if (searchTerm && searchTerm.trim() !== '') {
    searchCheck = (item: any) => {
      searchTerm = searchTerm.trim().toLowerCase(); // 将搜索条件转换为小写以进行不区分大小写的匹配
      const regex = new RegExp(searchTerm, 'i'); // 创建不区分大小写的正则表达式
      if ((item as FlowItemResponse).customer) {
        const name = (item as FlowItemResponse).customer.name.toLowerCase();
        const phoneNumber = (item as FlowItemResponse).customer.phoneNumber;
        return regex.test(name) || regex.test(phoneNumber);
      } else {
        const name = item.name.toLowerCase();
        const phoneNumber = item.phoneNumber;
        // 使用正则表达式测试是否匹配搜索条件
        return regex.test(name) || regex.test(phoneNumber);
      }
    };
  }

  let statusCheck = (res: any) => true;

  if (status !== undefined && status !== FlowStatus.NO_SET) {
    const fn = getFlowStatusFunction || getFlowStatus;

    statusCheck = (item: FlowItemResponse) => fn(item) === status;
  }

  return data.filter((item) => {
    return searchCheck(item) && statusCheck(item);
  });
}

export function arabicToChineseNumber(arabicNumber: number) {
  const chineseNumbers = [
    '零',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
  ];
  const units = ['', '十', '百', '千'];

  const numberString = arabicNumber.toString();
  const length = numberString.length;

  let chineseNumber = '';
  let zeroFlag = false; // 用于处理连续的零

  for (let i = 0; i < length; i++) {
    const digit = parseInt(numberString[i]);

    // 处理零
    if (digit === 0) {
      zeroFlag = true;
    } else {
      // 当前数字不是零，需要加上单位
      if (zeroFlag) {
        chineseNumber += chineseNumbers[0]; // 添加一个零
        zeroFlag = false;
      }

      chineseNumber += chineseNumbers[digit] + units[length - i - 1];
    }
  }

  // 处理结尾的零
  if (chineseNumber.endsWith(chineseNumbers[0])) {
    chineseNumber = chineseNumber.slice(0, -1);
  }

  return chineseNumber;
}

export function getHeightComparsionText(
  heightComparison: GrowthCurveHeightComparison,
) {
  return {
    [GrowthCurveHeightComparison.Small]: '矮小',
    [GrowthCurveHeightComparison.Shorter]: '偏矮',
    [GrowthCurveHeightComparison.Normal]: '正常',
    [GrowthCurveHeightComparison.Taller]: '偏高',
  }[heightComparison];
}

export function getWeightComparsionText(
  weightComparison: GrowthCurveWeightComparison,
) {
  return {
    [GrowthCurveWeightComparison.Lighter]: '偏瘦',
    [GrowthCurveWeightComparison.Normal]: '正常',
    [GrowthCurveWeightComparison.Heavier]: '超重',
    [GrowthCurveWeightComparison.Obesity]: '肥胖',
  }[weightComparison];
}

export function createAreaData() {
  let data = [];
  let len = area.length;
  for (let i = 0; i < len; i++) {
    let city = [];
    for (let j = 0, cityLen = area[i]['city'].length; j < cityLen; j++) {
      let _city: any = {};
      //
      _city[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
      city.push(_city);
    }

    let _data: any = {};
    _data[area[i]['name']] = city;
    data.push(_data);
  }
  return data;
}

export const generateFlowCounts = (
  flows: FlowItemResponse[],
): {
  register: number;
  collect: number;
  analyze: number;
  analyzeError: number;
  massage: number;
  application: number;
} => {
  let register = 0;
  let collect = 0;
  let analyze = 0;
  let analyzeError = 0;
  let massage = 0;
  let application = 0;
  for (let index = 0; index < flows.length; index++) {
    const flow = flows[index];
    if (flow.register.status === RegisterStatus.DONE) {
      register++;
    }
    if (flow.collect.status === CollectStatus.DONE) {
      collect++;
    }
    if (flow.analyze.status === AnalyzeStatus.DONE) {
      analyze++;
    }
    const massageCount = flow.analyze.solution.massages.reduce(
      (sum: number, item: { count: number }) => {
        return sum + item.count;
      },
      0,
    );
    massage += massageCount;
    const applicationsCount = flow.analyze.solution.applications.reduce(
      (sum: number, item: { count: number }) => {
        return sum + item.count;
      },
      0,
    );
    application += applicationsCount;

    if (
      flow.evaluate.status == EvaluateStatus.DONE &&
      (flow.evaluate.score ?? 0) <= 2
    ) {
      analyzeError++;
    }
  }
  return {
    register,
    collect,
    analyzeError,
    analyze,
    massage,
    application,
  };
};

export function haveSameAuthorities(
  arr1: AuthorityConfig[],
  arr2: AuthorityConfig[],
) {
  if (arr1.length !== arr2.length) {
    return false; // 如果数组长度不同，直接返回 false
  }

  // 创建一个包含所有 authority 值的 Set
  const authoritySet1 = new Set(arr1.map((item) => item.authority));
  const authoritySet2 = new Set(arr2.map((item) => item.authority));

  // 检查两个集合是否相等
  return areSetsEqual(authoritySet1, authoritySet2);
}

function areSetsEqual(set1: Set<any>, set2: Set<any>) {
  if (set1.size !== set2.size) {
    return false;
  }

  for (const item of set1) {
    if (!set2.has(item)) {
      return false;
    }
  }

  return true;
}
