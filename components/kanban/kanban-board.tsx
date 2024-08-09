'use client';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { hasDraggableData } from '@/lib/utils';
import {
  DndContext,
  DragMoveEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragOverEvent,
  type DragStartEvent
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { BoardColumn, BoardContainer } from './board-column';
import { TaskCard } from './task-card';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';
import { Task, TaskStatus } from '@/types';
import { taskColumns } from '@/constants';
import { DetailDialog } from './detail-dialog';

export function KanbanBoard() {
  const { data, trigger } = useFetcher({
    url: ENDPOINT.TASKS,
    method: 'GET',
    triggerOnMount: true
  });
  const tasks: Task[] = data?.results ?? [];
  // const columns = useTaskStore((state) => state.columns);
  const columnsId = taskColumns.map((col) => col.id);

  // const tasks = useTaskStore((state) => state.tasks);
  // const setTasks = useTaskStore((state) => state.setTasks);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  function onDragStart(event: DragStartEvent) {
    console.log('start');
    if (!hasDraggableData(event.active)) return;

    const data = event.active.data.current;

    if (data?.type === 'Task') {
      setActiveTask(data.task);
    }
  }

  function onDragMove(event: DragMoveEvent) {
    if (!hasDraggableData(event.active)) return;

    console.log('move');
    setIsDragging(true);
  }

  function onDragEnd() {
    if (!isDragging) {
      setOpenDetail(true);
      setIsDragging(false);
      return;
    }

    setActiveTask(null);
    setIsDragging(false);
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === 'Task';
    const isOverATask = activeData?.type === 'Task';

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);
      const activeTask = tasks[activeIndex];
      const overTask = tasks[overIndex];
      if (activeTask && overTask && activeTask.status !== overTask.status) {
        activeTask.status = overTask.status;
        // setTasks(arrayMove(tasks, activeIndex, overIndex - 1));
      }

      // setTasks(arrayMove(tasks, activeIndex, overIndex));
    }

    const isOverAColumn = overData?.type === 'Column';

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const activeTask = tasks[activeIndex];
      if (activeTask) {
        activeTask.status = overId as TaskStatus;
        // setTasks(arrayMove(tasks, activeIndex, activeIndex));
      }
    }
  }

  useEffect(() => {
    // Clear active task on close detail dialog
    if (!openDetail) setActiveTask(null);
  }, [openDetail]);

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDragMove={onDragMove}
      >
        <BoardContainer>
          <SortableContext items={columnsId}>
            {taskColumns?.map((col) => (
              <Fragment key={col.id}>
                <BoardColumn
                  column={col}
                  tasks={tasks.filter((task) => task.status === col.id)}
                />
              </Fragment>
            ))}
          </SortableContext>
        </BoardContainer>

        {typeof window !== 'undefined' &&
          'document' in window &&
          createPortal(
            <DragOverlay>
              {activeTask && <TaskCard task={activeTask} isOverlay />}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
      <DetailDialog
        open={openDetail}
        task={activeTask}
        setOpen={setOpenDetail}
        reloadKanban={trigger}
      />
    </>
  );
}
