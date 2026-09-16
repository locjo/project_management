import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { authStore } from '../stores/auth'
import type { ApiResponse, RefreshTokenResponse } from '../types/api'
import { ApiError, apiError } from './errors'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  timeout: 15000,
})

// A separate client prevents refresh requests from entering the retry interceptor.
const refreshClient = axios.create(apiClient.defaults)
let refreshing: Promise<string> | null = null
function refreshAccessToken(): Promise<string> {
  if (!refreshing) {
    const previousToken = authStore.getState().accessToken
    refreshing = refreshClient.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh-token')
      .then(({ data }) => {
        if (!data.success || !data.data?.accessToken) throw new ApiError(data.message, 401)
        if (authStore.getState().accessToken !== previousToken) throw new ApiError('Phiên đăng nhập đã thay đổi.', 401)
        authStore.getState().setAccessToken(data.data.accessToken)
        return data.data.accessToken
      })
      .catch(error => {
        if (authStore.getState().accessToken === previousToken) authStore.getState().clear()
        throw apiError(error)
      })
      .finally(() => { refreshing = null })
  }
  return refreshing
}

function expired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now() + 15000
  } catch { return false }
}

apiClient.interceptors.request.use(async config => {
  if (config.url?.startsWith('/auth/')) return config
  let token = authStore.getState().accessToken
  if (token && expired(token)) token = await refreshAccessToken()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  return config
})

apiClient.interceptors.response.use(response => response, async error => {
  const config = error.config as (InternalAxiosRequestConfig & { retried?: boolean }) | undefined
  // This backend also returns 403 for an unauthenticated request. Never retry genuine permission errors.
  const token = authStore.getState().accessToken
  const status = error.response?.status
  if (config && !config.retried && !config.url?.startsWith('/auth/') && token
    && (status === 401 || (status === 403 && expired(token)))) {
    config.retried = true
    const sentToken = config.headers.get('Authorization')
    const nextToken = sentToken !== `Bearer ${token}` ? token : await refreshAccessToken()
    config.headers.set('Authorization', `Bearer ${nextToken}`)
    return apiClient.request(config)
  }
  if (status === 401 && config?.retried) authStore.getState().clear()
  return Promise.reject(apiError(error))
})

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.request<ApiResponse<T>>(config)
  if (!data.success) throw new ApiError(data.message)
  return data.data
}
