import { createStore } from 'zustand/vanilla'
import { graduationTermService } from '../service/graduation-terms'
import { categoryService } from '../service/categories'
import { topicService } from '../service/topics'
import { dashboardService } from '../service/dashboard'
import { registrationService } from '../service/registrations'
import { lecturerService } from '../service/lecturers'
import { apiError } from '../service/errors'
import { authStore } from './auth'
import type { GraduationTerm, TopicCategory, Topic, LecturerQuota, LecturerOption, RegistrationResponse } from '../types/api'

interface PortalState {
  terms: GraduationTerm[]; categories: TopicCategory[]; topics: Topic[]
  lecturers: LecturerQuota[]; registrations: RegistrationResponse[]
  lecturerOptions: LecturerOption[]
  selectedTermId: number | null; loading: boolean; error: string | null; termsLoaded: boolean
  load: (termId?: number) => Promise<void>
  reset: () => void
}
const initial = { terms: [], categories: [], topics: [], lecturers: [], lecturerOptions: [], registrations: [], selectedTermId: null, loading: false, error: null, termsLoaded: false }
async function loadResource<T>(name: string, request: Promise<T>): Promise<T> {
  try { return await request }
  catch (error) { throw new Error(`${name}: ${apiError(error).message}`) }
}
let revision = 0
export const portalStore = createStore<PortalState>((set, get) => ({
  ...initial,
  reset: () => { revision++; set(initial) },
  load: async termId => {
    const user = authStore.getState().user
    if (!user) return
    const requestId = ++revision
    const preferred = termId ?? get().selectedTermId
    set({ loading: true, error: null, topics: [], lecturers: [], lecturerOptions: [], registrations: [] })
    try {
      const [terms, categories] = await Promise.all([
        loadResource('Tải đợt đồ án', user.role === 'STUDENT' ? graduationTermService.active() : graduationTermService.list()),
        loadResource('Tải lĩnh vực đề tài', categoryService.list()),
      ])
      const selectedTermId = terms.find(term => term.id === preferred)?.id ?? terms.find(term => term.active)?.id ?? terms[0]?.id ?? null
      if (requestId !== revision || authStore.getState().user?.id !== user.id) return
      // Keep successful reference data even if a later request for student records fails.
      set({ terms, categories, selectedTermId, termsLoaded: true })
      const administrator = user.role === 'FACULTY_LEADER' || user.role === 'HEAD_OF_DEPARTMENT'
      const [topics, lecturers, registrations, lecturerOptions] = await Promise.all([
        selectedTermId ? loadResource('Tải danh sách đề tài', topicService.list(selectedTermId)) : Promise.resolve([]),
        selectedTermId && administrator ? loadResource('Tải thống kê giảng viên', dashboardService.lecturers(selectedTermId)) : Promise.resolve([]),
        user.role === 'STUDENT' ? loadResource('Tải hồ sơ sinh viên', registrationService.mine()) : user.role === 'LECTURER' && selectedTermId ? loadResource('Tải sinh viên hướng dẫn', registrationService.forLecturer(selectedTermId)) : Promise.resolve([]),
        selectedTermId && user.role === 'STUDENT' ? loadResource('Tải giảng viên hướng dẫn', lecturerService.list(selectedTermId)) : Promise.resolve([]),
      ])
      if (requestId !== revision || authStore.getState().user?.id !== user.id) return
      set({ terms, categories, selectedTermId, topics, lecturers, lecturerOptions, registrations, loading: false })
    } catch (error) {
      if (requestId === revision) set({ loading: false, error: apiError(error).message })
    }
  },
}))
