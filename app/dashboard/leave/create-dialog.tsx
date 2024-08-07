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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { leaveSchema, LeaveSchema } from '@/lib/form-schema';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Icons } from '@/components/icons';
import { Calendar } from '@/components/ui/calendar';
import { useEffect } from 'react';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';

export function CreateDialog({
  open,
  clickedDate,
  setOpen
}: Readonly<{
  open: boolean;
  clickedDate?: Date;
  setOpen: (state: boolean) => void;
}>) {
  const form = useForm<LeaveSchema>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      title: '',
      desc: '',
      date: new Date()
    }
  });
  const { trigger, data } = useFetcher({
    url: ENDPOINT.TICKETS,
    method: 'POST',
    onSuccess(data) {
      toast.success('Tạo ticket thành công');
      handleOpenChange(false);
      console.log(data);
    }
  });

  function handleSubmit(data: LeaveSchema) {
    const { title, desc, date, approved_by } = data;

    console.log(data);
    // trigger({
    //   body: {title, desc, approved_by}
    // })
  }

  function handleOpenChange(state: boolean) {
    form.reset();

    setOpen(state);
  }

  useEffect(() => {
    if (!open) return;

    form.setValue('date', clickedDate ?? new Date());
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className=" max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Nghỉ phép</DialogTitle>
              <DialogDescription>Tạo đơn xin nghỉ phép</DialogDescription>
            </DialogHeader>
            <div className=" space-y-4 py-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel>Ngày nghỉ</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lí do</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Gửi</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
