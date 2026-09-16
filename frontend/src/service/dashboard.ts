import { request } from './client'
import type { LecturerQuota } from '../types/api'
export const dashboardService = {
  lecturers: (graduationTermId: number) => request<LecturerQuota[]>({ url: '/dashboard/lecturers', params: { graduationTermId } }),
}
