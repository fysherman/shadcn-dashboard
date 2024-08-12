import { LucideIcon } from 'lucide-react';

export type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon;
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
    address: string;
    id: number;
    email: string;
    employee_type: string;
    fullname: string;
    image_profile: string;
    username: string;
    department: string;
    division: string;
    birth_year: number;
    role: Role;
    manager: number;
    manager_name: string;
    manager_division_id: string;
    manager_division_name: string;
    phone: string;
    tax_id: string;
    bank_account: string;
    bank_center: string;
    bank_name: string;
    identification_back_image: string;
    identification_front_image: string;
    identification_card: string;
    identification_issued_date: string;
    identification_issued_place: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
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
  index: number;
};

export type ReportStatus = 'PENDING' | 'DONE';

export type Report = Nullable<{
  id: number;
  title: string;
  status: ReportStatus;
  from_date: string;
  to_date: string;
  percentage: string;
  tasks: Task[];
  created: string;
  updated: string;
  created_by: number;
  created_by_name: string;
  creator_comment: string;
  approved_by: number;
  approved_by_name: string;
  approved_comment: string;
}>;

export type ContractStatus =
  | 'HR_CREATED'
  | 'COLLABORATOR_SUBMITTED'
  | 'MENTOR_REVIEWED'
  | 'MANAGER_REVIEWED';

export interface ContractTask {
  index: number;
  title: string;
  result: string;
}

export type Contract = Nullable<{
  id: number;
  title: string;
  desc: string;
  status: ContractStatus;
  from_date: string;
  to_date: string;
  created: string;
  updated: string;
  hr: number;
  hr_name: number;
  manager: number;
  manager_name: string;
  manager_review: Record<string, ContractEvaluationCriteria>;
  mentor: number;
  mentor_name: string;
  mentor_review: Record<string, ContractEvaluationCriteria>;
  collaborator_name: string;
  collaborator: number;
  tasks: ContractTask[];
}>;

export type ContractEvaluationCriteria =
  | 'GOOD'
  | 'ABOVE_AVERAGE'
  | 'AVERAGE'
  | 'PASS'
  | 'FAIL'
  | 'EXTEND_CONTRACT'
  | 'TERMINATE_CONTRACT'
  | 'YES'
  | 'NO'
  | 'AGREE'
  | 'DISAGREE'
  | 'RETAIN'
  | 'AGREE_WITH_MENTOR';
