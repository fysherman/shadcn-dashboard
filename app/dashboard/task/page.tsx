import { Breadcrumbs } from '@/components/breadcrumbs';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import NewTaskDialog from '@/components/kanban/new-task-dialog';
import PageContainer from '@/components/main-layout/page-container';
import { Heading } from '@/components/ui/heading';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Task', link: '/dashboard/task' }
];

export default function page() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title="Task" description="Quản lí task" />
          <NewTaskDialog />
        </div>
        <KanbanBoard />
      </div>
    </PageContainer>
  );
}