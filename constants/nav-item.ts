import { NavItem } from '@/types';
import { ROLES } from '@/constants';
import {
  Calendar,
  FileStack,
  LayoutDashboardIcon,
  PenTool,
  SquareKanban,
  UserMinus
} from 'lucide-react';

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItems: NavItem[] = [
  {
    title: 'Quản lí',
    href: '/dashboard/employee',
    icon: LayoutDashboardIcon,
    label: 'Employee',
    roles: [ROLES.HR, ROLES.MANAGER, ROLES.MENTOR]
  },
  {
    title: 'Quản lí nghỉ phép',
    href: '/dashboard/leave',
    icon: Calendar,
    label: 'leave',
    roles: [ROLES.HR, ROLES.MANAGER, ROLES.MENTOR, ROLES.COLLABORATOR]
  },
  {
    title: 'Task',
    href: '/dashboard/task',
    icon: SquareKanban,
    label: 'task',
    roles: [ROLES.HR, ROLES.MANAGER, ROLES.MENTOR, ROLES.COLLABORATOR]
  },
  {
    title: 'Báo cáo tháng',
    href: '/dashboard/report',
    icon: FileStack,
    label: 'report',
    roles: [ROLES.HR, ROLES.MANAGER, ROLES.MENTOR, ROLES.COLLABORATOR]
  },
  {
    title: 'Đề nghị gia hạn hợp đồng',
    href: '/dashboard/contract',
    icon: PenTool,
    label: 'contract',
    roles: [ROLES.HR, ROLES.MANAGER, ROLES.MENTOR, ROLES.COLLABORATOR]
  },
  {
    title: 'Thông báo nghỉ việc',
    href: '/dashboard/quit/',
    icon: UserMinus,
    label: 'quit',
    roles: [ROLES.HR, ROLES.MANAGER, ROLES.MENTOR, ROLES.COLLABORATOR]
  }
];
