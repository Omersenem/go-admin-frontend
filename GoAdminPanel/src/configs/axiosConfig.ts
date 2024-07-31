// ** Axios
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// ** Auth Config
import authConfig from "./auth";

// ** Next
// import Router from 'next/router'

// ** Toast
import toast from "react-hot-toast";

import { GetServerSidePropsContext, PreviewData } from "next/types";
import { ParsedUrlQuery } from "querystring";

// ** Util Functions
// import { getLoggerData, sendLoggerData } from 'src/@core/utils/logger'

let token: string | null = null;
if (typeof window !== "undefined") {
  token = localStorage.getItem(authConfig.storageTokenKeyName);
}

// DESC - Set Config
const config: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: "Bearer " + token,
  },
};

export const setToken = (newToken: string) => {
  token = newToken;

  instance.defaults.headers["Authorization"] = "Bearer " + newToken;
};

// DESC - Change token with server-side context request token cookie value
export const serverSideConfig = (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
): AxiosRequestConfig => {
  const token = context.req.cookies[authConfig.storageTokenKeyName];

  return {
    ...config,
    headers: {
      Authorization: "Bearer " + token,
    },
  };
};

// DESC - Clear token and redirect
const clearUser = (message: string) => {
  localStorage.removeItem(authConfig.storageTokenKeyName);
  localStorage.removeItem("userData");

  window.location.href = "/login";
  toast.error(message);
};

const instance = axios.create(config);

instance.interceptors.request.use(
  (config: any) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    /**
     * DESC - Uncomment below to send logger data
     * const loggerData = getLoggerData(response)
     * sendLoggerData(loggerData)
     */

    return response;
  },
  (error: AxiosError) => {
    /**
     * DESC - 418 status code means user doesn't have ability to access
     * if so redirect user to set ability page
     */
    if (error.response?.status === 418 && typeof window !== "undefined") {
      window.location.href = "/set-ability";

      // Router.push('/set-ability')
    }

    /**
     * DESC - 455 status code means token ip and user ip doesn't match
     * if so remove token and redirect user
     */
    if (error.response?.status === 455 && typeof window !== "undefined") {
      clearUser(
        "You've entered from another device or your network has changed."
      );
    }

    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      window?.location?.pathname !== "/login/"
    ) {
      // @ts-ignore
      clearUser(error?.response?.data?.message ?? "Yetkisiz İşlem!");
    }

    // if (error.response?.status === 500) {
    //   Router.push('/500')
    // }

    /**
     * DESC - Uncomment below to send logger data
     * const loggerData = getLoggerData(error.response!)
     * sendLoggerData(loggerData)
     */

    return Promise.reject(error);
  }
);

export default instance;
