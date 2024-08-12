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
import { reportSchema, ReportSchema } from '@/lib/form-schema';
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
import { Task } from '@/types';
import TaskTable from '../task-table';
import { Textarea } from '@/components/ui/textarea';

export default function CreateDialog({
  reload
}: Readonly<{ reload: () => void }>) {
  const taskFetcher = useFetcher({
    url: ENDPOINT.TASKS,
    method: 'GET'
  });
  const fetcher = useFetcher({
    url: ENDPOINT.REPORTS,
    method: 'POST',
    onSuccess() {
      toast.success('Tạo báo cáo thành công');
      reload();
      setOpen(false);
    }
  });
  const role = useUserStore((state) => state.role);
  const user = useUserStore((state) => state.user);
  const form = useForm<ReportSchema>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: 'Báo cáo tháng',
      from_date: new Date(),
      to_date: new Date()
    }
  });
  const [open, setOpen] = useState(false);
  const [reportTasks, setReportTasks] = useState<Task[]>([]);
  const managerName = user?.manager_name;

  function handleSubmit(data: ReportSchema) {
    fetcher.trigger({
      body: {
        title: data.title,
        from_date: format(data.from_date, 'yyyy-MM-dd'),
        to_date: format(data.to_date, 'yyyy-MM-dd'),
        creator_comment: data.creator_comment,
        approved_by: user?.manager,
        tasks: reportTasks.map((task) => task.id)
      }
    });
  }

  function getReportTasks() {
    taskFetcher.trigger({
      params: {
        assignee: user?.id,
        start_date: format(form.getValues('from_date'), 'yyyy-MM-dd'),
        end_date: format(form.getValues('to_date'), 'yyyy-MM-dd')
      },
      onSuccess(data) {
        setReportTasks(data?.results ?? []);
      }
    });
  }

  useEffect(() => {
    if (!open) {
      form.reset();
      setReportTasks([]);
    }
  }, [open]);

  if (!role || role !== ROLES.COLLABORATOR) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className=" mr-2 h-4 w-4" /> Tạo report
        </Button>
      </DialogTrigger>
      <DialogContent className=" max-w-2xl">
        <Form {...form}>
          <form id="report-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Báo cáo</DialogTitle>
              <DialogDescription>Tạo báo cáo công việc</DialogDescription>
            </DialogHeader>
            <div className=" space-y-4 py-4">
              <div className=" space-y-2">
                <Label>Người duyệt</Label>
                <div className=" flex items-center space-x-2">
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
                      <Input
                        {...field}
                        disabled={fetcher.loading || taskFetcher.loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="from_date"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled={fetcher.loading || taskFetcher.loading}
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
                          onSelect={(event) => {
                            field.onChange(event);
                            getReportTasks();
                          }}
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
                name="to_date"
                render={({ field }) => (
                  <FormItem className=" flex flex-col">
                    <FormLabel>Ngày kết thúc</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                            disabled={fetcher.loading || taskFetcher.loading}
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
                          onSelect={(event) => {
                            field.onChange(event);
                            getReportTasks();
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <TaskTable data={reportTasks} />
              <FormField
                control={form.control}
                name="creator_comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đánh giá</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={fetcher.loading || taskFetcher.loading}
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="report-form"
            disabled={fetcher.loading || taskFetcher.loading}
          >
            Tạo báo cáo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
