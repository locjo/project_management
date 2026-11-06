export interface ApiResponse<T> { success: boolean; message: string; data: T }
export type UserRole = 'STUDENT' | 'LECTURER' | 'HEAD_OF_DEPARTMENT' | 'FACULTY_LEADER'
export interface UserInfo { id: number; username: string; role: UserRole }
export interface UserProfile extends UserInfo {
  email: string; active: boolean; createdAt: string | null
  student: { studentCode: string; fullName: string; lastName: string | null; firstName: string | null; dateOfBirth: string | null; classCode: string | null; academicYear: string; phone: string | null } | null
  lecturer: { academicDegree: string | null } | null
}
export interface AuthResponse { accessToken: string; tokenType: string; user: UserInfo }
export interface UpdateProfile {
  email: string
  student?: { lastName: string; firstName: string; dateOfBirth: string | null; classCode: string | null; academicYear: string; phone: string | null }
  lecturer?: { academicDegree: string | null }
}
export interface RefreshTokenResponse { accessToken: string; tokenType: string }
export interface MessageResponse { message: string }
export interface GraduationTerm {
  id: number; code: string; name: string; academicYear: string; semester: string
  startDate: string; endDate: string; registerDate: string; active: boolean
}
export interface CreateGraduationTerm extends Omit<GraduationTerm, 'id' | 'active'> { isActive: boolean }
export interface TopicCategory { id: number; code: string; name: string; description: string | null; isActive: boolean }
export type CreateTopicCategory = Omit<TopicCategory, 'id'>
export interface Topic {
  id: number; lecturerId: number; lecturerName: string; graduationTermId: number
  categoryId: number; categoryName: string; title: string; description: string | null; active: boolean; createdAt: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}
export interface CreateTopic { graduationTermId: number; categoryId: number; title: string; description?: string }
export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export interface RegistrationResponse {
  id: number; studentId: number; studentName: string; lecturerId: number; lecturerName: string
  graduationTermId: number; categoryId: number | null; categoryName: string; title: string; status: RegistrationStatus
}
export interface CreateRegistration { graduationTermId: number; lecturerId: number; categoryId: number; topicId?: number; title?: string }
export interface LecturerQuota {
  lecturerId: number; lecturerName: string; academicDegree: string
  studentLimit: number; approvedStudents: number; availableSlots: number; pendingRequests: number
}

export interface LecturerOption {
  lecturerId: number; lecturerName: string; academicDegree: string | null
  studentLimit: number; availableSlots: number
}
export interface StudentRecord {
  id: number; userId: number; username: string; email: string; studentCode: string
  fullName: string; dateOfBirth: string | null; classCode: string | null
  academicYear: string
}
export interface CreateStudent {
  username: string; email: string; studentCode: string; lastName: string; firstName: string
  dateOfBirth?: string; classCode?: string; academicYear: string
}
export interface StudentImportRowResult {
  rowNumber: number; studentCode: string; imported: boolean; message: string
}
export interface StudentImportResult {
  totalRows: number; importedCount: number; failedCount: number; rows: StudentImportRowResult[]
}
