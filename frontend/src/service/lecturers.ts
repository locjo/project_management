import { request } from './client'
import type { LecturerOption } from '../types/api'

export const lecturerService = {
  create: (data: { username: string; email: string; academicDegree?: string }) => request<{
    lecturerId: number; userId: number; username: string; email: string; academicDegree: string | null
  }>({ method: 'POST', url: '/lecturers', data }),
  list: (graduationTermId: number) => request<LecturerOption[]>({ url: '/lecturers', params: { graduationTermId } }),
}
