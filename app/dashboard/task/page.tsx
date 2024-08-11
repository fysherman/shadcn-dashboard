import { Breadcrumbs } from '@/components/breadcrumbs';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import CreateDialog from '@/components/kanban/create-dialog';
import PageContainer from '@/components/main-layout/page-container';
import { Heading } from '@/components/ui/heading';
import React from 'react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Task', link: '/dashboard/task' }
];

export default function Page() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title="Task" description="Quản lí task" />
          <CreateDialog />
        </div>
        <KanbanBoard />
      </div>
    </PageContainer>
  );
}
