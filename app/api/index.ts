// index.ts
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Environment from '../config/environment';
import useAuthStore from '../stores/auth';

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

  baseConfig: AxiosRequestConfig = {
    baseURL: Environment.api.manager,
    timeout: 60000,
  };

  constructor(config: AxiosRequestConfig) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config));

    console.log(Object.assign(this.baseConfig, config));

    this.instance.interceptors.request.use(
      (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          config.headers!.Authorization = `Bearer ${accessToken}`;
        }
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
    config?: AxiosRequestConfig,
  ): Promise<Result<T>> {
    return this.instance.get(url, config);
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<Result<T>> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<Result<T>> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<Result<T>> {
    return this.instance.delete(url, config);
  }
}

// 默认导出Request实例
export default new Request({});
