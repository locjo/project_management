import type { HeaderProps, PortalRole, SidebarProps } from '../types/layout'

export const portalLayouts: Record<PortalRole, { header: HeaderProps; sidebar: SidebarProps }> = {
  "faculty": {
    "header": {
      "variant": "faculty",
      "name": "PGS. TS. Nguyễn Văn Nam",
      "description": "Trưởng Khoa CNTT - Đại học Mỏ - Địa chất",
      "initials": ""
    },
    "sidebar": {
      "variant": "faculty",
      "heading": "Nghiệp vụ khoa",
      "items": [
        {
          "path": "thong-ke-khoa",
          "icon": "dashboard",
          "label": "Thống kê khoa"
        },
        {
          "path": "linh-vuc-de-tai",
          "icon": "category",
          "label": "Lĩnh vực đề tài"
        },
        {
          "path": "giang-vien-huong-dan",
          "icon": "school",
          "label": "Giảng viên hướng dẫn"
        }
      ],
      "footerItems": [
        {
          "path": "item-3",
          "icon": "settings",
          "label": "Thiết lập đợt đồ án",
          "danger": false
        },
        {
          "path": "item-4",
          "icon": "logout",
          "label": "Đăng xuất",
          "danger": true
        }
      ],
      "activePath": "thong-ke-khoa",
      "period": {
        "title": "Đợt 2 - HK2 (2024-2025) K65",
        "dates": "01/02/2025 - 15/06/2025",
        "status": "Đang mở"
      }
    }
  },
  "student": {
    "header": {
      "variant": "student",
      "name": "Trần Quang Minh",
      "description": "MSV: 2021060412 • Lớp Tin K65A",
      "initials": "TM"
    },
    "sidebar": {
      "variant": "student",
      "heading": "Nghiệp vụ sinh viên",
      "items": [
        {
          "path": "item-0",
          "icon": "assignment_add",
          "label": "Đăng ký Đề tài ĐATN"
        },
        {
          "path": "item-1",
          "icon": "folder_shared",
          "label": "Hồ sơ & Đề tài của tôi"
        }
      ],
      "footerItems": [
        {
          "path": "dang-xuat",
          "icon": "logout",
          "label": "Đăng xuất",
          "danger": true
        }
      ],
      "activePath": "item-0",
      "period": {
        "title": "Đợt 2 - HK2 (2024-2025) K65",
        "dates": "01/02/2025 - 15/06/2025",
        "status": "Đang mở"
      }
    }
  },
  "department": {
    "header": {
      "variant": "department",
      "name": "TS. Đặng Vũ Tùng",
      "description": "Bộ môn Công nghệ Phần mềm",
      "initials": ""
    },
    "sidebar": {
      "variant": "department",
      "heading": "Nghiệp vụ bộ môn",
      "logo": { "variant": "portal", "title": "HUMG • CNTT", "subtitle": "Cổng Trưởng Bộ môn" },
      "items": [
        {
          "path": "quan-ly-sinh-vien-hd",
          "icon": "group",
          "label": "Quản lý sinh viên HD"
        },
        {
          "path": "de-tai-cua-toi",
          "icon": "lightbulb",
          "label": "Đề tài của tôi"
        }
      ],
      "footerItems": [
        {
          "path": "thiet-lap-tai-khoan",
          "icon": "settings",
          "label": "Thiết lập tài khoản",
          "danger": false
        },
        {
          "path": "dang-xuat",
          "icon": "logout",
          "label": "Đăng xuất",
          "danger": true
        }
      ],
      "activePath": "quan-ly-sinh-vien-hd",
      "period": {
        "title": "Đợt 2 - HK2 (2024-2025) K65",
        "dates": "01/02/2025 - 15/06/2025",
        "status": "Đang mở"
      }
    }
  },
  "lecturer": {
    "header": {
      "variant": "lecturer",
      "name": "TS. Đặng Vũ Tùng",
      "description": "Bộ môn CNPM",
      "initials": "VT",
      "email": "dvtung@humg.edu.vn"
    },
    "sidebar": {
      "variant": "lecturer",
      "heading": "Nghiệp vụ giảng viên",
      "logo": { "variant": "portal", "title": "HUMG • CNTT", "subtitle": "Cổng Giảng Viên HD" },
      "items": [
        {
          "path": "quan-ly-sinh-vien-hd",
          "icon": "group",
          "label": "Quản lý sinh viên HD"
        },
        {
          "path": "de-tai-cua-toi",
          "icon": "lightbulb",
          "label": "Đề tài của tôi"
        }
      ],
      "footerItems": [
        {
          "path": "thiet-lap-tai-khoan",
          "icon": "settings",
          "label": "Thiết lập tài khoản",
          "danger": false
        },
        {
          "path": "dang-xuat",
          "icon": "logout",
          "label": "Đăng xuất",
          "danger": true
        }
      ],
      "activePath": "quan-ly-sinh-vien-hd",
      "period": {
        "title": "Đợt 2 - HK2 (2024-2025) K65",
        "dates": "01/02/2025 - 15/06/2025",
        "status": "Đang mở"
      }
    }
  }
}
