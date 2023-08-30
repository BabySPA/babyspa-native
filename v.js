const users = [
  {
    _id: '64e31bff31f89eda933c0359',
    name: 'babyspa',
    username: '13333330000',
    gender: 1,
    phoneNumber: '13333330000',
    password: 'YmFieXNwYS1tYW5hZ2VyMzMwMDAw',
    idCardNumber: '13333330000',
    shops: [
      {
        roleKey: '5Lit5b+D566h55CG5ZGY',
        shopId: '64c6120c3c4c6d15c1432801',
      },
    ],
    description: '中心管理员',
    createdAt: '2023-08-21T08:10:39.170Z',
    updatedAt: '2023-08-28T08:13:50.693Z',
  },
  {
    _id: '64e31bff31f89eda933c035a',
    name: '马可波罗',
    username: '13333330001',
    gender: 1,
    phoneNumber: '13333330001',
    password: 'YmFieXNwYS1tYW5hZ2VyMTIzNDU2',
    idCardNumber: '13333330001',
    shops: [
      {
        roleKey: '5Lit5b+D5YiG5p6Q5biI',
        shopId: '64c6120c3c4c6d15c1432801',
      },
      {
        roleKey: '55CG55aX5biI',
        shopId: '64c6120c3c4c6d15c1432803',
      },
    ],
    description: '中心分析师',
    createdAt: '2023-08-21T08:10:39.170Z',
    updatedAt: '2023-08-21T08:10:39.170Z',
  },
  {
    _id: '64e31bff31f89eda933c035b',
    name: '蔡文姬',
    username: '13333330002',
    gender: 1,
    phoneNumber: '13333330002',
    password: 'YmFieXNwYS1tYW5hZ2VyMTIzNDU2',
    idCardNumber: '13333330002',
    shops: [
      {
        roleKey: '6Zeo5bqX566h55CG5ZGY',
        shopId: '64c6120c3c4c6d15c1432802',
      },
    ],
    description: '门店管理员',
    createdAt: '2023-08-21T08:10:39.170Z',
    updatedAt: '2023-08-21T08:10:39.170Z',
  },
  {
    _id: '64e31bff31f89eda933c035c',
    name: '妲己',
    username: '13333330003',
    gender: 1,
    phoneNumber: '13333330003',
    password: 'YmFieXNwYS1tYW5hZ2VyMjM0NTY3',
    idCardNumber: '13333330003',
    shops: [
      {
        shopId: '64c6120c3c4c6d15c1432803',
        roleKey: '55CG55aX5biI',
      },
    ],
    description: '门店理疗师',
    createdAt: '2023-08-21T08:10:39.170Z',
    updatedAt: '2023-08-27T11:50:30.066Z',
  },
  {
    _id: '64e31bff31f89eda933c035d',
    name: '兰陵王',
    username: '13333330004',
    gender: 1,
    phoneNumber: '13333330004',
    password: 'YmFieXNwYS1tYW5hZ2VyMTIzNDU2',
    idCardNumber: '13333330004',
    shops: [
      {
        roleKey: '55CG55aX5biI',
        shopId: '64c6120c3c4c6d15c1432802',
      },
    ],
    description: '门店理疗师',
    createdAt: '2023-08-21T08:10:39.170Z',
    updatedAt: '2023-08-21T08:10:39.170Z',
  },
  {
    _id: '64e31bff31f89eda933c035e',
    name: '白起',
    username: '13333330005',
    gender: 1,
    phoneNumber: '13333330005',
    password: 'YmFieXNwYS1tYW5hZ2VyMTIzNDU2',
    idCardNumber: '13333330005',
    shops: [
      {
        roleKey: '5YmN5Y+w',
        shopId: '64c6120c3c4c6d15c1432802',
      },
    ],
    description: '门店前台',
    createdAt: '2023-08-21T08:10:39.170Z',
    updatedAt: '2023-08-21T08:10:39.170Z',
  },
  {
    _id: '64e31bff31f89eda933c035f',
    name: '张龙',
    username: '13333330014',
    gender: 1,
    phoneNumber: '13333330014',
    password: 'YmFieXNwYS1tYW5hZ2VyMTIzNDU2',
    idCardNumber: '13333330014',
    shops: [
      {
        roleKey: '55CG55aX5biI',
        shopId: '64c6120c3c4c6d15c1432802',
      },
    ],
    description: '门店理疗师',
    createdAt: '2023-08-21T08:10:39.170Z',
    updatedAt: '2023-08-21T08:10:39.170Z',
  },
  {
    _id: '64e31bff31f89eda933c0360',
    name: '马汉',
    username: '13333330013',
    gender: 1,
    phoneNumber: '13333330013',
    password: 'YmFieXNwYS1tYW5hZ2VyMTIzNDU2',
    idCardNumber: '13333330013',
    shops: [
      {
        roleKey: '55CG55aX5biI',
        shopId: '64c6120c3c4c6d15c1432802',
      },
    ],
    description: '门店理疗师',
    createdAt: '2023-08-21T08:10:39.170Z',
    updatedAt: '2023-08-21T08:10:39.170Z',
  },
  {
    _id: '64e31bff31f89eda933c0361',
    name: '王朝',
    username: '13333330012',
    gender: 1,
    phoneNumber: '13333330012',
    password: 'YmFieXNwYS1tYW5hZ2VyMTIzNDU2',
    idCardNumber: '13333330012',
    shops: [
      {
        roleKey: '55CG55aX5biI',
        shopId: '64c6120c3c4c6d15c1432802',
      },
    ],
    description: '门店理疗师',
    createdAt: '2023-08-21T08:10:39.170Z',
    updatedAt: '2023-08-21T08:10:39.170Z',
  },
  {
    _id: '64e31bff31f89eda933c0362',
    name: '赵虎',
    username: '13333330011',
    gender: 1,
    phoneNumber: '13333330011',
    password: 'YmFieXNwYS1tYW5hZ2VyMTIzNDU2',
    idCardNumber: '13333330011',
    shops: [
      {
        roleKey: '55CG55aX5biI',
        shopId: '64c6120c3c4c6d15c1432802',
      },
    ],
    description: '门店理疗师',
    createdAt: '2023-08-21T08:10:39.170Z',
    updatedAt: '2023-08-21T08:10:39.170Z',
  },
];

const commonSalt = 'babyspa-manager';

const chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const Base64 = {
  btoa: (input) => {
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

  atob: (input) => {
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

function decodePassword(str) {
  return Base64.atob(str).slice(commonSalt.length);
}

const d = users.map((item) => {
  return {
    name: item.name,
    username: item.username,
    password: decodePassword(item.password),
  };
});

console.log(JSON.stringify(d, null, 2));
