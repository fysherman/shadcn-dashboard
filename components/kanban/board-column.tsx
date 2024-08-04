import { Task } from '@/lib/store';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { TaskCard } from './task-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = 'Column';

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
}

export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`
    }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const variants = cva(
    'h-[75vh] max-h-[75vh] col-span-1 max-w-full bg-gray-100 flex flex-col flex-shrink-0 snap-center',
    {
      variants: {
        dragging: {
          default: 'border-2 border-transparent',
          over: 'ring-2 opacity-30',
          overlay: 'ring-2 ring-primary'
        }
      }
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined
      })}
    >
      <CardHeader className="flex flex-row items-center p-4 text-left font-semibold">
        <p className=" text-base">{column.title}</p>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-4 overflow-x-hidden p-2">
        <ScrollArea className="h-full">
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <div key={task.id} className="mb-4">
                <TaskCard task={task} />
              </div>
            ))}
          </SortableContext>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva('px-2  pb-4 md:px-0 flex lg:justify-start', {
    variants: {
      dragging: {
        default: '',
        active: 'snap-none'
      }
    }
  });

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div
        className={variations({
          dragging: dndContext.active ? 'active' : 'default'
        })}
      >
        <div className=" grid w-full grid-cols-3 gap-4">{children}</div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
