'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quitSchema, QuitSchema } from '@/lib/form-schema';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';
import { useUserStore } from '@/store/user-store';
import { ROLES } from '@/constants';
import { CalendarIcon, Plus } from 'lucide-react';
import { cn, upperCaseFirstLetter } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

export default function CreateDialog({
  reload
}: Readonly<{ reload: () => void }>) {
  const fetcher = useFetcher({
    url: ENDPOINT.RESIGNS,
    method: 'POST',
    onSuccess() {
      toast.success('Tạo yêu cầu thành công');
      reload();
      setOpen(false);
    }
  });
  const role = useUserStore((state) => state.role);
  const user = useUserStore((state) => state.user);
  const form = useForm<QuitSchema>({
    resolver: zodResolver(quitSchema),
    defaultValues: {
      title: 'Xin nghỉ việc...',
      end_date: new Date()
    }
  });
  const [open, setOpen] = useState(false);
  const mentorName = user?.manager_name;
  const managerName = user?.manager_division_name;

  function handleSubmit(data: QuitSchema) {
    fetcher.trigger({
      body: {
        title: data.title,
        end_date: format(data.end_date, 'yyyy-MM-dd'),
        creator: user?.id,
        mentor: user?.manager,
        manager: user?.manager_division_id
      }
    });
  }

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  if (!role || role !== ROLES.COLLABORATOR) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className=" mr-2 h-4 w-4" /> Tạo thông báo nghỉ việc
        </Button>
      </DialogTrigger>
      <DialogContent className=" max-w-2xl">
        <Form {...form}>
          <form id="quit-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Thông báo nghỉ việc</DialogTitle>
              <DialogDescription>
                TTS / CTV tạo thông báo công việc
              </DialogDescription>
            </DialogHeader>
            <div className=" space-y-4 py-4">
              <div className=" grid grid-cols-4 items-center gap-4 space-y-2">
                <Label>CTV / TTS</Label>
                <div className=" col-span-3 flex items-center space-x-2">
                  <Avatar className=" h-8 w-8">
                    <AvatarFallback>
                      {upperCaseFirstLetter(user?.username)}
                    </AvatarFallback>
                  </Avatar>
                  <p>{user?.username}</p>
                </div>
              </div>
              <div className=" grid grid-cols-4 items-center gap-4 space-y-2">
                <Label>Mentor</Label>
                <div className=" col-span-3 flex items-center space-x-2">
                  <Avatar className=" h-8 w-8">
                    <AvatarFallback>
                      {upperCaseFirstLetter(mentorName)}
                    </AvatarFallback>
                  </Avatar>
                  <p>{mentorName}</p>
                </div>
              </div>
              <div className=" grid grid-cols-4 items-center gap-4 space-y-2">
                <Label>Manager</Label>
                <div className=" col-span-3 flex items-center space-x-2">
                  <Avatar className=" h-8 w-8">
                    <AvatarFallback>
                      {upperCaseFirstLetter(managerName)}
                    </AvatarFallback>
                  </Avatar>
                  <p>{managerName}</p>
                </div>
              </div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={fetcher.loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel>Ngày làm việc cuối cùng</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled={fetcher.loading}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="quit-form" disabled={fetcher.loading}>
            Tạo yêu cầu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
