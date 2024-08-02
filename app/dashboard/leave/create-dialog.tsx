import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function CreateDialog({
  open,
  setOpen
}: Readonly<{ open: boolean; setOpen: (state: boolean) => void }>) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nghỉ phép</DialogTitle>
          <DialogDescription>Tạo đơn xin nghỉ phép</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tiêu đề
            </Label>
            <Input id="title" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Lí do
            </Label>
            <Textarea id="description" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Gửi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
