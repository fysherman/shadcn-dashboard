import * as z from 'zod';

export const leaveSchema = z.object({
  title: z.string().min(1),
  desc: z.string().min(1),
  date: z.date()
});

export type LeaveSchema = z.infer<typeof leaveSchema>;

export const taskSchema = z.object({
  title: z.string().min(1),
  desc: z.string().min(1),
  assignee: z.string().min(1),
  comment: z.string().optional()
});

export type TaskSchema = z.infer<typeof taskSchema>;

export const reportSchema = z.object({
  title: z.string().min(1),
  from_date: z.date(),
  to_date: z.date(),
  creator_comment: z.string()
});

export type ReportSchema = z.infer<typeof reportSchema>;

export const contractSchema = z.object({
  title: z.string().min(1),
  from_date: z.date(),
  to_date: z.date(),
  desc: z.string(),
  collaborator: z.string().min(1)
});

export type ContractSchema = z.infer<typeof contractSchema>;

export const authSchema = z.object({
  username: z.string(),
  password: z.string()
});

export type AuthSchema = z.infer<typeof authSchema>;

export const profileSchema = z.object({
  address: z.string().min(1),
  image_profile: z.string().optional(),
  birth_date: z.string().min(1),
  phone: z.string().min(1),
  tax_id: z.string().optional(),
  bank_account: z.string().optional(),
  bank_center: z.string().optional(),
  bank_name: z.string().optional(),
  identification_back_image: z.string().optional(),
  identification_front_image: z.string().optional(),
  identification_card: z.string().optional(),
  identification_issued_date: z.string().optional(),
  identification_issued_place: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional()
});

export type ProfileSchema = z.infer<typeof profileSchema>;
