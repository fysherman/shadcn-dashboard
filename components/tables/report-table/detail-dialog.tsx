'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { upperCaseFirstLetter } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import TaskTable from '../task-table';
import { Badge } from '@/components/ui/badge';
import { useReportStore } from '@/store/report-store';

export default function DetailDialog() {
  const open = useReportStore((state) => state.openDetail);
  const report = useReportStore((state) => state.reportDetail);
  const closeDetail = useReportStore((state) => state.closeDetail);
  const submitterName = report?.created_by_name;
  const approverName = report?.approved_by_name;

  function setOpen(state: boolean) {
    if (state) return;

    closeDetail();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" max-w-2xl">
        <DialogHeader>
          <DialogTitle>Báo cáo</DialogTitle>
          <DialogDescription>Chi tiết báo cáo</DialogDescription>
        </DialogHeader>
        <div className=" space-y-4 py-4">
          <Badge variant={report?.status === 'DONE' ? 'default' : 'secondary'}>
            {report?.status}
          </Badge>
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label>Người tạo</Label>
            <div className=" col-span-3 flex items-center space-x-4">
              <Avatar className=" h-8 w-8">
                <AvatarFallback>
                  {upperCaseFirstLetter(submitterName)}
                </AvatarFallback>
              </Avatar>
              <p>{submitterName}</p>
            </div>
          </div>
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label>Người duyệt</Label>
            <div className=" col-span-3 flex items-center space-x-4">
              <Avatar className=" h-8 w-8">
                <AvatarFallback>
                  {upperCaseFirstLetter(approverName)}
                </AvatarFallback>
              </Avatar>
              <p>{approverName}</p>
            </div>
          </div>
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label>Kì báo cáo</Label>
            <p className=" col-span-3">
              {report?.from_date &&
                format(new Date(report?.from_date), 'yyyy-MM-dd')}
              -
              {report?.to_date &&
                format(new Date(report?.to_date), 'yyyy-MM-dd')}
            </p>
          </div>
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label>Tiêu đề</Label>
            <p className=" col-span-3">{report?.title}</p>
          </div>
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label className=" col-span-4">
              Cộng tác viên / Thực tập sinh đánh giá
            </Label>
            <p className=" col-span-4">{report?.creator_comment}</p>
          </div>
        </div>
        <div className="mt-4">
          <TaskTable data={report?.tasks ?? []} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
