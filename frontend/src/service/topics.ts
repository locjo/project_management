import { request } from './client'
import type { CreateTopic, Topic } from '../types/api'
export const topicService = {
  list: (graduationTermId: number, categoryId?: number) => request<Topic[]>({ url: '/topics', params: { graduationTermId, categoryId } }),
  create: (data: CreateTopic) => request<Topic>({ method: 'POST', url: '/topics', data }),
  update: (id: number, data: CreateTopic) => request<Topic>({ method: 'PUT', url: `/topics/${id}`, data }),
  remove: (id: number) => request<null>({ method: 'DELETE', url: `/topics/${id}` }),
}
