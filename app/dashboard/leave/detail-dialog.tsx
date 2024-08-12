import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Leave } from '@/types';
import { format } from 'date-fns';
import { useUserStore } from '@/store/user-store';
import { Badge, BadgeProps } from '@/components/ui/badge';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';
import { upperCaseFirstLetter } from '@/lib/utils';

export function DetailDialog({
  open,
  event,
  setOpen,
  reloadCalendar
}: Readonly<{
  open: boolean;
  event?: Leave;
  setOpen: (state: boolean) => void;
  reloadCalendar: () => void;
}>) {
  const user = useUserStore((state) => state.user);
  const fetcher = useFetcher({
    url: `${ENDPOINT.TICKETS}${event?.id}/`,
    method: 'PUT',
    onSuccess() {
      toast.success('Gửi thành công');
      reloadCalendar();
      handleOpenChange(false);
    }
  });
  const submitterName = event?.submitted_by_name ?? '';
  const approverName = event?.approved_by_name ?? '';
  const isApprover = user?.id === event?.approved_by;

  function getStatusVariant(): BadgeProps['variant'] {
    switch (event?.status) {
      case 'APPROVED':
        return 'default';
      case 'REJECTED':
        return 'destructive';
      default:
        return 'secondary';
    }
  }

  function handleOpenChange(state: boolean) {
    setOpen(state);
  }

  function submitRequest(status: Leave['status']) {
    fetcher.trigger({
      body: { status }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className=" max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nghỉ phép</DialogTitle>
          <DialogDescription>Chi tiết đơn xin nghỉ phép</DialogDescription>
        </DialogHeader>
        <div className=" space-y-4 py-4">
          <Badge variant={getStatusVariant()}>{event?.status}</Badge>
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label>Người gửi</Label>
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
            <Label>Thời gian</Label>
            <p className=" col-span-3">
              {event?.from_date &&
                format(new Date(event?.from_date), 'yyyy-MM-dd')}
            </p>
          </div>
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label>Tiêu đề</Label>
            <p className=" col-span-3">{event?.title}</p>
          </div>
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label>Lí do</Label>
            <p className=" col-span-3">{event?.desc}</p>
          </div>
        </div>
        {isApprover && event?.status === 'PENDING' && (
          <DialogFooter>
            <Button
              variant="secondary"
              type="button"
              onClick={() => submitRequest('REJECTED')}
            >
              Từ chối
            </Button>
            <Button type="button" onClick={() => submitRequest('APPROVED')}>
              Duyệt
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
