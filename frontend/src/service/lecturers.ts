import { request } from './client'
import type { LecturerOption } from '../types/api'

export const lecturerService = {
  list: (graduationTermId: number) => request<LecturerOption[]>({ url: '/lecturers', params: { graduationTermId } }),
}
