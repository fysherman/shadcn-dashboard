import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { Column } from '@/components/kanban/board-column';

export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

const defaultCols = [
  {
    id: 'TODO' as const,
    title: 'Todo'
  },
  {
    id: 'IN_PROGRESS' as const,
    title: 'In progress'
  },
  {
    id: 'DONE' as const,
    title: 'Done'
  }
] satisfies Column[];

export type ColumnId = Status;

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
};

export type State = {
  tasks: Task[];
  columns: Column[];
  draggedTask: string | null;
};

const initialTasks: Task[] = [
  {
    id: 'task1',
    status: 'TODO',
    title: 'Project initiation and planning'
  },
  {
    id: 'task2',
    status: 'TODO',
    title: 'Gather requirements from stakeholders'
  }
];

export type Actions = {
  addTask: (title: string, description?: string) => void;
  dragTask: (id: string | null) => void;
  removeTask: (title: string) => void;
  setTasks: (updatedTask: Task[]) => void;
};

export const useTaskStore = create<State & Actions>()((set) => ({
  tasks: initialTasks,
  columns: defaultCols,
  draggedTask: null,
  addTask: (title: string, description?: string) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        { id: uuid(), title, description, status: 'TODO' }
      ]
    })),
  dragTask: (id: string | null) => set({ draggedTask: id }),
  removeTask: (id: string) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id)
    })),
  setTasks: (newTasks: Task[]) => set({ tasks: newTasks })
}));
