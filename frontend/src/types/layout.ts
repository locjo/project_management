export type PortalRole = 'faculty' | 'student' | 'department' | 'lecturer'

export interface HeaderProps {
  variant: PortalRole
  name: string
  description: string
  initials?: string
  email?: string
}

export interface LogoProps {
  imageUrl?: string
  title?: string
  subtitle?: string
  variant?: 'university' | 'portal'
}

export interface NavigationItem {
  path: string
  label: string
  icon: string
  danger?: boolean
  children?: NavigationItem[]
}

export interface SidebarProps {
  variant: PortalRole
  logo?: LogoProps
  heading: string
  items: NavigationItem[]
  footerItems: NavigationItem[]
  activePath?: string
  period: { title: string; dates: string; status: string }
}
