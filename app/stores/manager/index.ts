import { create } from 'zustand';
import request from '~/app/api';
import { immer } from 'zustand/middleware/immer';
import { ManangerState, RoleStatus, ShopType } from './type';
import { ConfigAuthTree, LayoutConfig } from '~/app/constants';
import { generateAuthorityConfig } from '~/app/utils';
export const DefaultTemplate = [
  {
    _id: '1',
    key: 'allergy',
    name: '过敏原',
    template: [
      {
        name: '风寒感冒',
        children: ['头痛', '鼻塞', '流涕'],
      },
      {
        name: '风热感冒',
        children: ['咽喉痛', '咳嗽', '发热'],
      },
      {
        name: '咳嗽',
        children: ['干咳', '咳痰'],
      },
      {
        name: '腹泻',
        children: ['腹痛', '腹泻'],
      },
    ],
  },
  {
    _id: '2',
    key: 'guidance',
    name: '调理导向',
    template: [
      {
        name: '咳嗽',
        children: [
          '晨起咳嗽',
          '上半夜咳',
          '下半夜咳',
          '咳嗽有痰',
          '干咳',
          '偶尔咳嗽',
        ],
      },
      {
        name: '感冒',
        children: ['头痛', '流鼻涕', '清鼻涕', '黄鼻涕'],
      },
    ],
  },
  {
    _id: '3',
    key: 'conslutsion',
    name: '分析结论',
    template: [
      {
        name: '咳嗽',
        children: [
          '晨起咳嗽',
          '上半夜咳',
          '下半夜咳',
          '咳嗽有痰',
          '干咳',
          '偶尔咳嗽',
        ],
      },
      {
        name: '感冒',
        children: ['头痛', '流鼻涕', '清鼻涕', '黄鼻涕'],
      },
    ],
  },
  {
    _id: '4',
    key: 'application-acupoint',
    name: '调理方案-贴敷穴位',
    template: [
      {
        name: '上部',
        children: ['腰阳关穴', '三阴交穴'],
      },
      {
        name: '中部',
        children: ['曲池穴'],
      },
      {
        name: '下部',
        children: ['足三里穴', '足底涌泉穴'],
      },
    ],
  },
  {
    _id: '5',
    key: 'massage-remark',
    name: '调理方案-推拿备注',
    template: [
      {
        name: '受风重',
        children: [
          `胃经↓2 运水入土1 脾经个5 一窝蜂1  小肠经↓3 外劳宫1 大肠经↓5 阳池1 `,
        ],
      },
      {
        name: '受风内热',
        children: [
          `肺经个7 外关1 心经51 三关肺个7 肝经”51 天河水↓3 肾经个3 六腑↓5`,
        ],
      },
    ],
  },
  {
    _id: '6',
    key: 'flow-remark',
    name: '注意事项',
    template: [
      {
        name: '吃',
        children: ['吃饭吃稀的'],
      },
      {
        name: '喝',
        children: ['喝水喝热的'],
      },
      {
        name: '穿',
        children: ['穿衣穿暖的'],
      },
      {
        name: '睡',
        children: ['睡觉睡足的'],
      },
      {
        name: '洗',
        children: ['洗澡洗热的'],
      },
    ],
  },
];

export const DefaultShop = {
  name: '',
  maintainer: '',
  phoneNumber: '',
  region: '',
  address: '',
  openingTime: '',
  closingTime: '',
  description: '',
  type: ShopType.SHOP,
};

export const DefaultUser = {
  name: '',
  username: '',
  gender: 1,
  phoneNumber: '',
  idCardNumber: '',
  password: '',
  shop: {
    shopId: '',
    name: '',
  },
  role: {
    name: '',
    roleKey: '',
  },
  description: '',
};

export const DefaultRole = {
  name: '',
  roleKey: '',
  description: '',
  status: RoleStatus.OPEN,
  authorities: [],
};

const useManagerStore = create(
  immer<ManangerState>((set, get) => ({
    // shops
    shops: [],
    currentShop: DefaultShop,
    requestGetShops: async () => {
      const { data } = await request.get('/shops');
      set((state) => {
        state.shops = data;
      });
    },
    requestPostShop: () => {
      return request.post('/shops', get().currentShop);
    },
    requestPatchShop: async () => {
      const shop = get().currentShop;
      return request.patch(`/shops/${shop._id}`, get().currentShop);
    },
    setCurrentShop: (shop) => {
      set((state) => {
        state.currentShop = shop;
      });
    },

    // 员工
    users: [],
    userFilter: {
      name: '',
      shop: {
        id: '',
        name: '',
      },
    },
    currentUser: DefaultUser,
    requestGetUsers: async () => {
      const shopId = get().userFilter.shop.id;

      const { data } = await request.get(`/users?shopId=${shopId}`);
      set((state) => {
        state.users = data;
      });
    },
    requestPostUser: () => {
      const currentUser = get().currentUser;

      const postUser = {
        name: currentUser.name,
        username: currentUser.username,
        gender: currentUser.gender,
        phoneNumber: currentUser.phoneNumber,
        idCardNumber: currentUser.idCardNumber,
        description: currentUser.description,
        roleKey: currentUser.role?.roleKey,
        shopId: currentUser.shop?.shopId,
      };

      return request.post('/users', postUser);
    },
    requestPatchUser: async () => {
      const currentUser = get().currentUser;
      const postUser = {
        name: currentUser.name,
        username: currentUser.username,
        gender: currentUser.gender,
        phoneNumber: currentUser.phoneNumber,
        idCardNumber: currentUser.idCardNumber,
        description: currentUser.description,
        roleKey: currentUser.role?.roleKey,
        originalShopId: currentUser.shop?.originalShopId,
        shopId: currentUser.shop?.shopId,
      };

      return request.patch(`/users/${currentUser._id}`, postUser);
    },
    requestPatchUserPassword: async (password) => {
      const user = get().currentUser;
      return request.patch(`/users/password/${user._id}`, { password });
    },
    requestDeleteUser: async () => {
      const user = get().currentUser;
      return request.delete(`/users/${user._id}`, {
        shopId: user.shop?.shopId,
      });
    },

    setCurrentUser: (user) => {
      set((state) => {
        state.currentUser = user;
      });
      return Promise.resolve();
    },
    setUserFilter: async (filter) => {
      set((state) => {
        state.userFilter = filter;
      });
    },

    // 角色
    roles: [],
    currentRole: DefaultRole,
    configAuthTree: ConfigAuthTree,

    requestGetRoles: async () => {
      const { data } = await request.get('/roles');
      set((state) => {
        state.roles = data;
      });
    },
    requestPostRole: () => {
      const role = get().currentRole;
      const authorities = generateAuthorityConfig(get().configAuthTree);

      const patchRole = {
        name: role.name,
        status: role.status,
        description: role.description,
        authorities: authorities,
      };
      return request.post('/roles', patchRole);
    },
    requestPatchRole: async () => {
      const role = get().currentRole;
      const authorities = generateAuthorityConfig(get().configAuthTree);

      const patchRole = {
        name: role.name,
        status: role.status,
        description: role.description,
        authorities: authorities,
      };
      return request.patch(`/roles/${role._id}`, patchRole);
    },

    requestDeleteRole: async () => {
      const role = get().currentRole;
      return request.delete(`/roles/${role._id}`);
    },

    setCurrentRole: (role) => {
      set((state) => {
        state.currentRole = role;
      });
    },

    setConfigAuthTree: (authorities) => {
      set((state) => {
        state.configAuthTree = authorities;
      });
    },

    // template
    templates: DefaultTemplate,
    currentSelectTemplateIdx: 0,
    setCurrentSelectTemplateIdx: (idx) => {
      set((state) => {
        state.currentSelectTemplateIdx = idx;
      });
    },
  })),
);

export default useManagerStore;
