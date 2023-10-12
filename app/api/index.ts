// index.ts
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Environment from '../config/environment';
import useAuthStore from '../stores/auth';
import { haveSameAuthorities } from '../utils';
import useGlobalLoading from '../stores/loading';

type Result<T> = {
  code: number;
  message: string;
  data: T;
};

type Error = {
  code: number;
  message: string;
  path: string;
  result: null | string;
  success: boolean;
  timestamp: string;
};

// 导出Request类，可以用来自定义传递配置来创建实例
class Request {
  // axios 实例
  instance: AxiosInstance;
  // 基础配置，url和超时时间

  // 存储最后一次请求的时间戳和接口路径
  private lastRequest: { [key: string]: number } = {};

  baseConfig: AxiosRequestConfig = {
    baseURL: Environment.api.manager,
    timeout: 60000,
  };

  constructor(config: AxiosRequestConfig) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config));

    this.instance.interceptors.request.use(
      (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          config.headers!.Authorization = `Bearer ${accessToken}`;
        }

        const currentShopWithRole = useAuthStore.getState().currentShopWithRole;
        config.headers!['x-current-shopid'] = currentShopWithRole?.shop._id;
        config.headers!['x-current-rolekey'] =
          currentShopWithRole?.role.roleKey;
        return config;
      },
      (err: any) => {
        // 请求错误，这里可以用全局提示框进行提示
        return Promise.reject(err);
      },
    );

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        // 直接返回res，当然你也可以只返回res.data
        // 系统如果有自定义code也可以在这里处理
        const { code } = res.data;
        if (code != 0) {
          return Promise.reject(res.data);
        }

        // 获取当前权限与请求获得的权限
        const currentShopWithRole = useAuthStore.getState().currentShopWithRole;
        const responseAuthorities = res.headers['c-authorities'];

        // 如果当前权限与请求获得的权限不一致，更新权限

        const savedAuthorities = currentShopWithRole?.role.authorities;

        if (savedAuthorities && responseAuthorities) {
          const responseAuthoritiesArray = JSON.parse(responseAuthorities);
          if (
            !haveSameAuthorities(savedAuthorities, responseAuthoritiesArray)
          ) {
            // 权限有变化需要重新登录
            const { logout } = useAuthStore.getState();
            const { openLoading, closeLoading } = useGlobalLoading();
            openLoading(true, '当前登录角色权限有变化，请重新登陆...');
            setTimeout(() => {
              logout();
              closeLoading();
            }, 50);
          }
        }

        return res.data;
      },
      ({ response }: { response: AxiosResponse<Error> }) => {
        // 这里用来处理http常见错误，进行全局提示
        const { code } = response.data;
        if (code === 401) {
          //
          const { logout } = useAuthStore.getState();
          logout();
        }

        return Promise.reject(response.data);
      },
    );
  }

  // 定义请求方法
  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  public get<T = any>(
    url: string,
    data?: Record<string, any>,
  ): Promise<Result<T>> {
    // 获取请求的接口路径
    const requestKey = url + JSON.stringify(data);

    // 检查上一次请求的时间戳，如果小于3秒，拒绝此请求
    const currentTimestamp = Date.now();
    if (requestKey in this.lastRequest) {
      if (currentTimestamp - this.lastRequest[requestKey] < 3000) {
        return Promise.reject('请不要频繁请求相同的接口');
      }
    }

    this.lastRequest[requestKey] = currentTimestamp;

    return this.instance.get(url, data);
  }

  public post<T = any>(
    url: string,
    data?: Record<string, any>,
  ): Promise<Result<T>> {
    return this.instance.post(url, data);
  }

  public put<T = any>(
    url: string,
    data?: Record<string, any>,
  ): Promise<Result<T>> {
    return this.instance.put(url, data);
  }

  public patch<T = any>(
    url: string,
    data?: Record<string, any>,
  ): Promise<Result<T>> {
    return this.instance.patch(url, data);
  }

  public delete<T = any>(
    url: string,
    data?: Record<string, any>,
  ): Promise<Result<T>> {
    return this.instance.delete(url, {
      data: data,
    });
  }
}

// 默认导出Request实例
export default new Request({});
