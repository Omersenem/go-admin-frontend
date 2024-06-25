// ** Axios
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'


// ** Auth Config
import authConfig from './auth'

// ** Next
import { GetServerSidePropsContext, PreviewData } from 'next/types'

// ** Third Party
import { ParsedUrlQuery } from 'querystring'

// import Cookies from 'js-cookie'

let token: string | null = null

if (typeof window !== 'undefined') {
  token = localStorage?.getItem(authConfig.storageTokenKeyName)
}

// DESC - Set Config
const config: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: 'Bearer ' + token
  }
}

export const setToken = (newToken: string) => {
  token = newToken

  // Update the Authorization header in the Axios instance
  instance.defaults.headers['Authorization'] = 'Bearer ' + newToken
}

// DESC - Change token with server-side context request token cookie value
export const serverSideConfig = (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
): AxiosRequestConfig => {
  const token = context.req.cookies[authConfig.storageTokenKeyName]

  return {
    ...config,
    headers: {
      Authorization: 'Bearer ' + token
    }
  }
}

// DESC - Clear token and redirect
const clearUser = () => {
  localStorage.removeItem(authConfig.storageTokenKeyName)
  window.location.href = '/login'
  
  // toast.error(message)
}

const instance = axios.create(config)

instance.interceptors.request.use(
  (config: any) => {
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    /**
     * DESC - Uncomment below to send logger data
     * const loggerData = getLoggerData(response)
     * sendLoggerData(loggerData)
     */

    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // @ts-ignore
      clearUser()

      // clearUser(error.response.data.message)
    }
    if (error.response?.status === 403 && typeof window !== 'undefined') {
      // @ts-ignore
      window.location.href = '/404'

      // clearUser(error.response.data.message)
    }

    // if (error.response?.status === 500) {
    //   Router.push('/500')
    // }

    /**
     * DESC - Uncomment below to send logger data
     * const loggerData = getLoggerData(error.response!)
     * sendLoggerData(loggerData)
     */

    return Promise.reject(error)
  }
)

export default instance