import { request } from './client'
import type { CreateGraduationTerm, GraduationTerm } from '../types/api'
export const graduationTermService = {
  list: () => request<GraduationTerm[]>({ url: '/graduation-terms' }),
  active: () => request<GraduationTerm[]>({ url: '/graduation-terms/active' }),
  create: (data: CreateGraduationTerm) => request<GraduationTerm>({ method: 'POST', url: '/graduation-terms', data }),
  update: (id: number, data: CreateGraduationTerm) => request<GraduationTerm>({ method: 'PUT', url: `/graduation-terms/${id}`, data }),
  remove: (id: number) => request<null>({ method: 'DELETE', url: `/graduation-terms/${id}` }),
}
