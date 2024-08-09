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
  assignee: z.string()
});

export type TaskSchema = z.infer<typeof taskSchema>;

export const authSchema = z.object({
  username: z.string(),
  password: z.string()
});

export type AuthSchema = z.infer<typeof authSchema>;
