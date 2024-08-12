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
import { useTaskStore } from '@/store/task-store';
import { toast } from 'sonner';

type UpdatePayload = {
  id: number;
  status?: TaskStatus;
  index?: number;
};

export function KanbanBoard() {
  const kanbanKey = useTaskStore((state) => state.kanbanKey);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [originalTasks, setOriginalTasks] = useState<Task[]>([]);
  const fetcher = useFetcher({
    url: ENDPOINT.TASKS,
    method: 'GET',
    triggerOnMount: true,
    onSuccess(data) {
      const tasks = data?.results ?? [];

      setTasks(tasks);
      setOriginalTasks(JSON.parse(JSON.stringify(tasks)));
    }
  });
  const updateFetcher = useFetcher({
    method: 'PUT',
    silent: true
  });

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const columnsId = taskColumns.map((col) => col.id);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  async function runUpdateJobs() {
    const jobs: UpdatePayload[] = tasks
      .map<UpdatePayload>(({ id, status }, ind) => {
        const originalTask = originalTasks.find((task) => task.id === id);
        const payload: UpdatePayload = { id };

        if (!originalTask) return payload;

        if (originalTask.status !== status) payload.status = status;
        if (originalTask.index !== ind) payload.index = ind;

        return payload;
      })
      .filter((payload) => Object.keys(payload).length > 1);

    if (!jobs.length) return;

    try {
      setLoading(true);
      const response = await Promise.all(
        jobs.map((job) =>
          updateFetcher.trigger({
            url: `${ENDPOINT.TASKS}${job.id}`,
            body: {
              status: job.status,
              index: job.index
            }
          })
        )
      );

      const error = response.find((item) => item.error);

      if (error) throw new Error(String(error));

      toast.success('Cập nhật thành công');
    } catch (error) {
      console.log('🚀 ~ runUpdateJobs ~ error:', error);
      toast.error('Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  }

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;

    const data = event.active.data.current;

    if (data?.type === 'Task') {
      setActiveTask(data.task);
    }
  }

  function onDragMove(event: DragMoveEvent) {
    if (!hasDraggableData(event.active)) return;

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
    runUpdateJobs();
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
        setTasks(arrayMove(tasks, activeIndex, overIndex - 1));
      }

      setTasks(arrayMove(tasks, activeIndex, overIndex));
    }

    const isOverAColumn = overData?.type === 'Column';

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const activeTask = tasks[activeIndex];
      if (activeTask) {
        activeTask.status = overId as TaskStatus;
        setTasks(arrayMove(tasks, activeIndex, activeIndex));
      }
    }
  }

  useEffect(() => {
    // Clear active task on close detail dialog
    if (!openDetail) setActiveTask(null);
  }, [openDetail]);

  useEffect(() => {
    if (!fetcher.loading) fetcher.trigger();
  }, [kanbanKey]);

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
        reloadKanban={fetcher.trigger}
      />
    </>
  );
}
