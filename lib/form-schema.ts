import * as z from 'zod';

export const leaveSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.date()
});

export type LeaveSchema = z.infer<typeof leaveSchema>;

export const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  startDate: z.date(),
  endDate: z.date(),
  assigner: z.string()
});

export type TaskSchema = z.infer<typeof taskSchema>;
