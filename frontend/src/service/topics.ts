import { request } from './client'
import type { CreateTopic, Topic } from '../types/api'
export const topicService = {
  list: (graduationTermId: number, categoryId?: number) => request<Topic[]>({ url: '/topics', params: { graduationTermId, categoryId } }),
  mine: (graduationTermId: number) => request<Topic[]>({ url: '/topics/mine', params: { graduationTermId } }),
  pending: (graduationTermId: number) => request<Topic[]>({ url: '/topics/pending', params: { graduationTermId } }),
  department: (graduationTermId: number) => request<Topic[]>({ url: '/topics/department', params: { graduationTermId } }),
  review: (id: number, status: 'APPROVED' | 'REJECTED') => request<Topic>({ method: 'PUT', url: `/topics/${id}/review`, data: { status } }),
  create: (data: CreateTopic) => request<Topic>({ method: 'POST', url: '/topics', data }),
  update: (id: number, data: CreateTopic) => request<Topic>({ method: 'PUT', url: `/topics/${id}`, data }),
  remove: (id: number) => request<null>({ method: 'DELETE', url: `/topics/${id}` }),
}
