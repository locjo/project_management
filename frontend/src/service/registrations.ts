import { request } from './client'
import type { CreateRegistration, RegistrationResponse, RegistrationStatus } from '../types/api'
export const registrationService = {
  create: (data: CreateRegistration) => request<RegistrationResponse>({ method: 'POST', url: '/registrations', data }),
  mine: () => request<RegistrationResponse[]>({ url: '/registrations/topic' }),
  pending: () => request<RegistrationResponse[]>({ url: '/registrations/lecturer/pending' }),
  forLecturer: (graduationTermId: number) => request<RegistrationResponse[]>({ url: '/registrations/lecturer', params: { graduationTermId } }),
  updateStatus: (id: number, status: RegistrationStatus) => request<RegistrationResponse>({ method: 'PUT', url: `/registrations/${id}/status`, data: { status } }),
}
