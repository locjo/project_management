import { apiClient, request } from './client'
import type { CreateStudent, StudentImportResult, StudentRecord } from '../types/api'

export const studentService = {
  list: () => request<StudentRecord[]>({ url: '/students' }),
  create: (data: CreateStudent) => request<StudentRecord>({ method: 'POST', url: '/students', data }),
  importExcel: (file: File, options: { emailDomain?: string; academicYear?: string }) => {
    const form = new FormData()
    form.append('file', file)
    if (options.emailDomain?.trim()) form.append('emailDomain', options.emailDomain.trim())
    if (options.academicYear?.trim()) form.append('academicYear', options.academicYear.trim())
    return request<StudentImportResult>({ method: 'POST', url: '/students/import', data: form })
  },
  downloadTemplate: async () => {
    const { data } = await apiClient.get<Blob>('/students/template', { responseType: 'blob' })
    return data
  },
}
