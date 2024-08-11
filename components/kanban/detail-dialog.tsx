import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Leave, Task } from '@/types';
import { format } from 'date-fns';
import { useUserStore } from '@/store/user-store';
import { Badge } from '@/components/ui/badge';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';
import { upperCaseFirstLetter } from '@/lib/utils';
import { TASK_STATUS } from '@/constants';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';

export function DetailDialog({
  open,
  task,
  setOpen,
  reloadKanban
}: Readonly<{
  open: boolean;
  task: Task | null;
  setOpen: (state: boolean) => void;
  reloadKanban: () => void;
}>) {
  const fetcher = useFetcher({
    url: `${ENDPOINT.TASKS}${task?.id}`,
    method: 'PUT',
    onSuccess() {
      toast.success('Cập nhật thành công');
      reloadKanban();
      handleOpenChange(false);
    }
  });
  let statusVariant = 'bg-gray-500';

  switch (task?.status) {
    case TASK_STATUS.DONE:
      statusVariant = 'bg-green-500';
      break;
    case TASK_STATUS.IN_PROGRESS:
      statusVariant = 'bg-blue-500';
      break;
  }

  function handleOpenChange(state: boolean) {
    setOpen(state);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="  max-w-4xl">
        <DialogHeader>
          <DialogTitle>Task</DialogTitle>
          <DialogDescription>Chi tiết task</DialogDescription>
        </DialogHeader>
        <div className=" space-y-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              <Badge className={statusVariant}>
                {task?.status?.split('_').join(' ')}
              </Badge>
              <div className=" space-y-2">
                <Label>Thời gian tạo</Label>
                <p>
                  {task?.created &&
                    format(new Date(task.created), 'yyyy-MM-dd hh:mm')}
                </p>
              </div>
              <div className=" space-y-2">
                <Label>Thời gian cập nhật</Label>
                <p>
                  {task?.created &&
                    format(new Date(task.updated), 'yyyy-MM-dd hh:mm')}
                </p>
              </div>
            </div>
            <div className=" space-y-4">
              <div className=" space-y-2">
                <Label>Assignee</Label>
                <div className="flex items-center space-x-4">
                  <Avatar className=" h-8 w-8">
                    <AvatarFallback>
                      {upperCaseFirstLetter(task?.assignee_name)}
                    </AvatarFallback>
                  </Avatar>
                  <p>{task?.assignee_name}</p>
                </div>
              </div>
              <div className=" space-y-2">
                <Label>Reporter</Label>
                <div className=" flex items-center space-x-4">
                  <Avatar className=" h-8 w-8">
                    <AvatarFallback>
                      {upperCaseFirstLetter(task?.reporter_name)}
                    </AvatarFallback>
                  </Avatar>
                  <p>{task?.reporter_name}</p>
                </div>
              </div>
            </div>
          </div>
          <div className=" space-y-2">
            <Label>Tiêu đề</Label>
            <Input value={task?.title} />
          </div>
          <div className=" space-y-2">
            <Label>Mô tả</Label>
            <Textarea value={task?.desc} rows={5} />
          </div>
          <div className=" space-y-2">
            <Label>Comment</Label>
            <Textarea value={task?.desc} rows={5} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" form="task-form">
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
