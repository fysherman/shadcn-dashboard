'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { upperCaseFirstLetter } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';
import { toast } from 'sonner';
import { useQuitStore } from '@/store/quit-store';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';

export default function DetailDialog({
  reload
}: Readonly<{ reload: () => void }>) {
  const open = useQuitStore((state) => state.openDetail);
  const quit = useQuitStore((state) => state.quitDetail);
  const fetcher = useFetcher({
    method: 'POST',
    onSuccess() {
      toast.success('Submit lên hệ thống Uservice thành công');
      reload();
      setOpen(false);
    }
  });
  const closeDetail = useQuitStore((state) => state.closeDetail);

  function setOpen(state: boolean) {
    if (state) return;

    closeDetail();
  }

  function submitUservice() {
    // fetcher.trigger({
    //   url: `${ENDPOINT.REPORTS}${quit?.id}/submit/`,
    //   body: quit
    // });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thông báo nghỉ việc</DialogTitle>
          <DialogDescription>Chi tiết thông báo nghỉ việc</DialogDescription>
        </DialogHeader>
        <div className=" space-y-4 py-4">
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label>Người tạo</Label>
            <div className=" col-span-3 flex items-center space-x-4">
              <Avatar className=" h-8 w-8">
                <AvatarFallback>
                  {upperCaseFirstLetter(quit?.collaborator_name)}
                </AvatarFallback>
              </Avatar>
              <p>{quit?.collaborator_name}</p>
            </div>
          </div>
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label>Mentor</Label>
            <div className=" col-span-3 flex items-center space-x-4">
              <Avatar className=" h-8 w-8">
                <AvatarFallback>
                  {upperCaseFirstLetter(quit?.mentor_name)}
                </AvatarFallback>
              </Avatar>
              <p>{quit?.mentor_name}</p>
            </div>
          </div>
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label>Manager</Label>
            <div className=" col-span-3 flex items-center space-x-4">
              <Avatar className=" h-8 w-8">
                <AvatarFallback>
                  {upperCaseFirstLetter(quit?.manager_name)}
                </AvatarFallback>
              </Avatar>
              <p>{quit?.manager_name}</p>
            </div>
          </div>
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label>Tiêu đề</Label>
            <p className=" col-span-3">{quit?.title}</p>
          </div>
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label>Ngày làm việc cuối</Label>
            <p className=" col-span-3">
              {quit?.end_date && format(new Date(quit.end_date), 'yyyy-MM-dd')}
            </p>
          </div>
        </div>
        <DialogFooter className=" mt-4">
          <Tooltip>
            <TooltipTrigger>
              <Button onClick={submitUservice} disabled>
                Submit báo cáo lên Uservice
              </Button>
            </TooltipTrigger>
            <TooltipContent>Coming soon</TooltipContent>
          </Tooltip>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
