import { request } from './client'
import type { LecturerOption } from '../types/api'

export interface LecturerAccount { lecturerId: number; userId: number; username: string; email: string; academicDegree: string | null }
export interface LecturerInput { username: string; email: string; academicDegree?: string }

export const lecturerService = {
  accounts: () => request<LecturerAccount[]>({ url: '/lecturers/accounts' }),
  update: (id: number, data: LecturerInput) => request<void>({ method: 'PUT', url: `/lecturers/${id}`, data }),
  remove: (id: number) => request<void>({ method: 'DELETE', url: `/lecturers/${id}` }),
  create: (data: { username: string; email: string; academicDegree?: string }) => request<{
    lecturerId: number; userId: number; username: string; email: string; academicDegree: string | null
  }>({ method: 'POST', url: '/lecturers', data }),
  list: (graduationTermId: number) => request<LecturerOption[]>({ url: '/lecturers', params: { graduationTermId } }),
}
