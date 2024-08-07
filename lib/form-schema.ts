import * as z from 'zod';

export const leaveSchema = z.object({
  title: z.string(),
  desc: z.string(),
  date: z.date(),
  approved_by: z.string()
});

export type LeaveSchema = z.infer<typeof leaveSchema>;

export const taskSchema = z.object({
  title: z.string(),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  assigner: z.string()
});

export type TaskSchema = z.infer<typeof taskSchema>;

export const authSchema = z.object({
  username: z.string(),
  password: z.string()
});

export type AuthSchema = z.infer<typeof authSchema>;
