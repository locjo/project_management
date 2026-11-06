import { request } from './client'
import { authStore } from '../stores/auth'
import type { AuthResponse, MessageResponse, UserRole } from '../types/api'

export const authService = {
  async quickLogin(role: UserRole) {
    const session = await request<AuthResponse>({ method: 'POST', url: '/auth/quick-login', data: { role } })
    authStore.getState().setSession(session)
    return session
  },
  sendOtp: (email: string) => request<MessageResponse>({ method: 'POST', url: '/auth/send-otp', data: { email } }),
  async login(email: string, otp: string) {
    const session = await request<AuthResponse>({ method: 'POST', url: '/auth/login-otp', data: { email, otp } })
    authStore.getState().setSession(session)
    return session
  },
  async logout() {
    await request<MessageResponse>({ method: 'POST', url: '/auth/logout' })
    authStore.getState().clear()
  },
}
