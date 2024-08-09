import { Icons } from '@/components/icons';

export type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  roles?: Role[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type Employee = Partial<
  Nullable<{
    id: number;
    email: string;
    employee_type: string;
    fullname: string;
    image_profile: string;
    username: string;
    department: string;
    birth_year: number;
    role: Role;
    manager: number;
    manager_name: string;
  }>
>;

export type Leave = Nullable<{
  id: number;
  approved_by: number;
  approved_by_name: string;
  title: string;
  desc: string;
  status: 'PENDING' | 'REJECTED' | 'APPROVED';
  submitted_by: number;
  submitted_by_name: string;
  from_date: string;
  to_date: string;
}>;

export type Role = 'MANAGER' | 'MENTOR' | 'COLLABORATOR' | 'HR';

export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'DONE';

export type Task = {
  id: number;
  reporter: number;
  reporter_name: string;
  status: TaskStatus;
  assignee: number;
  assignee_name: string;
  title: string;
  desc: string;
  created: string;
  updated: string;
  comment: string | null;
};
