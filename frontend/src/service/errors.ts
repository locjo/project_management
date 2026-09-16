import axios from 'axios'

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) { super(message); this.name = 'ApiError' }
}

export function apiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const message = error.response?.data?.message
    return new ApiError(typeof message === 'string' ? message : status === 401
      ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' : status === 403
        ? 'Tài khoản không có quyền thực hiện thao tác này.' : status === 429
          ? 'Bạn thao tác quá nhanh. Vui lòng thử lại sau.' : error.code === 'ECONNABORTED'
            ? 'Máy chủ phản hồi quá lâu. Vui lòng thử lại.' : !error.response
              ? 'Không kết nối được backend. Vui lòng kiểm tra máy chủ và cấu hình API.'
              : 'Không thể thực hiện yêu cầu.', status)
  }
  return new ApiError(error instanceof Error ? error.message : 'Đã có lỗi xảy ra.')
}
