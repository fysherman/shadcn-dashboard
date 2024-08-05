import { NavItem } from '@/types';

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
    href: '/dashboard/talent',
    icon: 'dashboard',
    label: 'Talent'
  },
  // {
  //   title: 'Dashboard',
  //   href: '/dashboard',
  //   icon: 'dashboard',
  //   label: 'Dashboard'
  // },
  // {
  //   title: 'User',
  //   href: '/dashboard/user',
  //   icon: 'user',
  //   label: 'user'
  // },
  {
    title: 'Quản lí nghỉ phép',
    href: '/dashboard/leave',
    icon: 'calendar',
    label: 'leave'
  },
  {
    title: 'Task',
    href: '/dashboard/task',
    icon: 'kanban',
    label: 'task'
  }
  // {
  //   title: 'Profile',
  //   href: '/dashboard/profile',
  //   icon: 'profile',
  //   label: 'profile'
  // },
  // {
  //   title: 'Kanban',
  //   href: '/dashboard/kanban',
  //   icon: 'kanban',
  //   label: 'kanban'
  // },
  // {
  //   title: 'Login',
  //   href: '/',
  //   icon: 'login',
  //   label: 'login'
  // }
];
