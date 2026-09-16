import { request } from './client'
import type { CreateTopicCategory, TopicCategory } from '../types/api'
export const categoryService = {
  list: (activeOnly = true) => request<TopicCategory[]>({ url: '/categories', params: { activeOnly } }),
  create: (data: CreateTopicCategory) => request<TopicCategory>({ method: 'POST', url: '/categories', data }),
  update: (id: number, data: CreateTopicCategory) => request<TopicCategory>({ method: 'PUT', url: `/categories/${id}`, data }),
  remove: (id: number) => request<null>({ method: 'DELETE', url: `/categories/${id}` }),
}
