import { request } from './client'
import type { UserProfile, UpdateProfile } from '../types/api'

export const profileService = {
  me: () => request<UserProfile>({ method: 'GET', url: '/users/me' }),
  update: (data: UpdateProfile) => request<UserProfile>({ method: 'PUT', url: '/users/me', data }),
}
