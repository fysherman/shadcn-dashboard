import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Active, DataRef, Over } from '@dnd-kit/core';
import { ColumnDragData } from '@/components/kanban/board-column';
import { TaskDragData } from '@/components/kanban/task-card';

type DraggableData = ColumnDragData | TaskDragData;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Task') {
    return true;
  }

  return false;
}

export function delay(time: number = 0): Promise<undefined> {
  return new Promise((res) => {
    setTimeout(res, time);
  });
}

export function upperCaseFirstLetter(string?: string | null) {
  return (string ?? '')[0]?.toUpperCase() ?? '';
}

export function fallbackValue(value?: any, fallback: string = 'Null'): string {
  return value ? String(value) : fallback;
}
