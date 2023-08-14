import { ConfigAuthTree, IConfigAuth, LayoutConfig } from '../constants';
import { AuthorityConfig, RoleAuthority } from '../stores/auth/type';
import { Role, RoleStatus } from '../stores/manager/type';

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

export function generateMixinRoles(roles: Role[]) {
  const mixRole: Pick<Role, 'name' | 'authorities'> = {
    name: '',
    authorities: [],
  };

  for (let i = 0; i < roles.length; i++) {
    const role = roles[i];
    mixRole.name += role.name + '、';
    if (role.status == RoleStatus.OPEN) {
      mixRole.authorities = mergeAndRemoveDuplicates(
        mixRole.authorities || [],
        roles[i].authorities,
      );
    }
    mixRole.authorities = mixRole.authorities?.concat(roles[i].authorities);
  }

  if (mixRole.name)
    mixRole.name = mixRole.name.slice(0, mixRole.name.length - 1);

  return mixRole;
}

function mergeAndRemoveDuplicates(
  arr1: AuthorityConfig[],
  arr2: AuthorityConfig[],
): AuthorityConfig[] {
  const mergedArray = [...arr1]; // 先将第一个数组拷贝到合并数组中

  for (const obj of arr2) {
    // 检查是否已存在相同的对象
    const existingObj = mergedArray.find(
      (item) => item.authority === obj.authority,
    );
    if (!existingObj) {
      mergedArray.push(obj); // 如果不存在则将对象添加到合并数组中
    }
  }

  return mergedArray;
}
