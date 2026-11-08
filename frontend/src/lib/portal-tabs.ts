import type { UserRole } from '../types/api'

export interface PortalTab { path: string; label: string; sections: string[] }

export const portalTabs: Record<UserRole, PortalTab[]> = {
  HEAD_OF_DEPARTMENT: [
    { path: 'sinh-vien', label: 'Quản lý sinh viên', sections: ['students'] },
    { path: 'giang-vien-huong-dan', label: 'Quản lý giảng viên', sections: ['create-lecturer', 'lecturer-accounts', 'lecturers'] },
    { path: 'manage-topics', label: 'Quản lý đề tài', sections: ['topics', 'create-topic'] },
    { path: 'linh-vuc-de-tai', label: 'Lĩnh vực đề tài', sections: ['categories'] },
    { path: 'topic-approved', label: 'Đề tài đã duyệt', sections: ['topic-approved'] },
    { path: 'topic-approval', label: 'Đề tài chờ duyệt', sections: ['topic-approval'] },
    { path: 'topic-rejected', label: 'Đề tài đã từ chối', sections: ['topic-rejected'] },
  ],
  LECTURER: [
    { path: 'students-pending', label: 'Sinh viên chờ duyệt', sections: ['students-pending'] },
    { path: 'students-approved', label: 'Sinh viên đã nhận', sections: ['students-approved'] },
    { path: 'my-topics', label: 'Đề tài của tôi', sections: ['my-topics', 'create-topic'] },
    { path: 'de-tai-cua-toi', label: 'Đề tài trong đợt', sections: ['topics', 'categories'] },
  ],
  STUDENT: [
    { path: 'item-0', label: 'Đăng ký đề tài', sections: ['registration', 'categories'] },
    { path: 'item-1', label: 'Hồ sơ của tôi', sections: ['registrations'] },
  ],
  FACULTY_LEADER: [
    { path: 'thong-ke-khoa', label: 'Thống kê khoa', sections: ['faculty-statistics', 'lecturers'] },
    { path: 'manage-topics', label: 'Quản lý đề tài', sections: ['topics', 'create-topic'] },
    { path: 'topic-approved', label: 'Đề tài đã duyệt', sections: ['topic-approved'] },
    { path: 'topic-approval', label: 'Đề tài chờ duyệt', sections: ['topic-approval'] },
    { path: 'topic-rejected', label: 'Đề tài đã từ chối', sections: ['topic-rejected'] },
    { path: 'linh-vuc-de-tai', label: 'Lĩnh vực đề tài', sections: ['categories'] },
    { path: 'giang-vien-huong-dan', label: 'Giảng viên', sections: ['lecturers'] },
    { path: 'item-3', label: 'Đợt đồ án', sections: ['terms'] },
  ],
}

export function getPortalTab(role: UserRole, path: string | null): PortalTab {
  return portalTabs[role].find(tab => tab.path === path) ?? portalTabs[role][0]
}
