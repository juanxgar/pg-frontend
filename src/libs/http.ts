import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { environment } from "../utils";
import { getSession } from "next-auth/react";

export class Http {
  readonly instance;

  constructor(url: string = environment.baseUrl) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 40000,
      headers: {
        Accept: "application/json",
      },
    });
    this.addBearToken();
    this.handleResponse();
  }

  getInstance(): AxiosInstance {
    return this.instance;
  }

  private addBearToken(): void {
    this.instance.interceptors.request.use(
      async (
        config: InternalAxiosRequestConfig
      ): Promise<InternalAxiosRequestConfig> => {
        const session = await getSession();
        const token = session?.accessToken.token;
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }

  private handleResponse(): void {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return Promise.resolve(response.data);
      },
      function (error) {
        if (error.response.status === 400) {
          return Promise.reject(error.response.data);
        }
        return Promise.reject(error.response);
      }
    );
  }
}
