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

export function DetailDialog({
  open,
  setOpen
}: Readonly<{
  open: boolean;
  setOpen: (state: boolean) => void;
}>) {
  function handleOpenChange(state: boolean) {
    setOpen(state);
  }

  function submitRequest() {
    toast.success('Gửi thành công');
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className=" max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nghỉ phép</DialogTitle>
          <DialogDescription>Chi tiết đơn xin nghỉ phép</DialogDescription>
        </DialogHeader>
        <div className=" space-y-4 py-4">
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label>Người gửi</Label>
            <div className=" col-span-3 flex items-center space-x-4">
              <Avatar className=" h-8 w-8">
                <AvatarFallback>{'A'}</AvatarFallback>
              </Avatar>
              <p>khanhbd4</p>
            </div>
          </div>
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label>Thời gian</Label>
            <p className=" col-span-3">1/9/2024</p>
          </div>
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label>Tiêu đề</Label>
            <p className=" col-span-3">Xin nghỉ phép</p>
          </div>
          <div className=" grid grid-cols-4 items-center gap-4">
            <Label>Lí do</Label>
            <p className=" col-span-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem ab dolores consectetur animi at, obcaecati ipsum nobis
              officiis molestiae necessitatibus aspernatur amet! Quos, minus
              pariatur. Possimus aliquid esse alias unde!
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="secondary"
            type="button"
            onClick={() => submitRequest()}
          >
            Từ chối
          </Button>
          <Button type="button" onClick={() => submitRequest()}>
            Duyệt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
