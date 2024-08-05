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

export type Employee = Nullable<{
  id: number;
  email: string;
  employee_type: string;
  fullname: string;
  image_profile: string;
  username: string;
  department: string;
  birth_year: number;
}>;
