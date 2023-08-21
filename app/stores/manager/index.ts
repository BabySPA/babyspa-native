import { create } from 'zustand';
import request from '~/app/api';
import { immer } from 'zustand/middleware/immer';
import { ManangerState, RoleStatus, ShopType } from './type';
import { ConfigAuthTree } from '~/app/constants';
import { generateAuthorityConfig } from '~/app/utils';
export const DefaultTemplate = [];

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
    type: ShopType.SHOP,
  },
  role: {
    name: '',
    roleKey: '',
    type: ShopType.SHOP,
  },
  description: '',
};

export const DefaultRole = {
  name: '',
  roleKey: '',
  description: '',
  status: RoleStatus.OPEN,
  type: ShopType.SHOP,
  authorities: [],
};

const initialState = {
  // shops
  shops: [],
  currentShop: DefaultShop,

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

  // 角色
  roles: [],
  currentRole: DefaultRole,
  configAuthTree: ConfigAuthTree,

  // template
  templates: DefaultTemplate,
  currentSelectTemplateIdx: 0,
  currentSelectTemplateGroupIdx: 0,

  // logs
  logs: [],
};

const useManagerStore = create(
  immer<ManangerState>((set, get) => ({
    ...initialState,
    clearCache: () => {
      set({ ...initialState });
    },

    // 门店
    requestGetShops: async () => {
      const { data } = await request.get('/shops?type=' + ShopType.SHOP);
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
    setCurrentSelectTemplateIdx: (idx) => {
      set((state) => {
        state.currentSelectTemplateIdx = idx;
        state.currentSelectTemplateGroupIdx = 0;
      });
    },

    setCurrentSelectTemplateGroupIdx: (idx) => {
      set((state) => {
        state.currentSelectTemplateGroupIdx = idx;
      });
    },

    getCurrentSelectTemplateGroups: () => {
      const idx = get().currentSelectTemplateIdx;
      return get().templates[idx]?.groups;
    },

    getCurrentSelectTemplateGroupItems: () => {
      const idx = get().currentSelectTemplateIdx;
      const itemIdx = get().currentSelectTemplateGroupIdx;

      return get().templates[idx]?.groups?.[itemIdx]?.children || [];
    },

    getTemplateGroups: (groupKey) => {
      return get().templates.find((template) => template.key === groupKey);
    },

    requestGetTemplates: async () => {
      const { data } = await request.get('/templates');
      set((state) => {
        state.templates = data;
      });
    },

    // logs
    requestGetLogs: async () => {
      const { data } = await request.get('/logs');

      const { docs } = data;
      set((state) => {
        state.logs = docs;
      });
    },
  })),
);

export default useManagerStore;
