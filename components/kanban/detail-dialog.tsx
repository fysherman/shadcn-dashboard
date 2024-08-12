import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Employee, Task } from '@/types';
import { format } from 'date-fns';
import { useUserStore } from '@/store/user-store';
import { Badge } from '@/components/ui/badge';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';
import { cn, upperCaseFirstLetter } from '@/lib/utils';
import { ROLES, TASK_STATUS } from '@/constants';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, TaskSchema } from '@/lib/form-schema';
import { Combobox, ComboboxContent, ComboboxTrigger } from '../combobox';
import { useEffect, useState } from 'react';

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
  const role = useUserStore((state) => state.role);
  const fetcher = useFetcher({
    url: `${ENDPOINT.TASKS}${task?.id}`,
    method: 'PUT',
    onSuccess() {
      toast.success('Cập nhật thành công');
      reloadKanban();
      setOpen(false);
    }
  });
  const employeeFetcher = useFetcher({
    url: ENDPOINT.EMPLOYEES,
    method: 'GET',
    silent: true
  });
  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title,
      desc: task?.desc,
      assignee: task?.assignee.toString(),
      comment: task?.comment ?? ''
    }
  });
  const [openCombobox, setOpenCombobox] = useState(false);
  const employees: Employee[] = employeeFetcher.data?.results ?? [];
  const enableUpdate =
    role && [ROLES.HR, ROLES.MANAGER, ROLES.MENTOR].includes(role);

  function getStatusVariant() {
    switch (task?.status) {
      case TASK_STATUS.DONE:
        return 'bg-green-500';
      case TASK_STATUS.IN_PROGRESS:
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  }

  function handleSubmit(data: TaskSchema) {
    fetcher.trigger({
      body: {
        ...data,
        assignee: Number(data.assignee)
      }
    });
  }

  useEffect(() => {
    if (!role || role === ROLES.COLLABORATOR) return;

    employeeFetcher.trigger();
  }, [role]);

  useEffect(() => {
    if (open) {
      form.reset({
        title: task?.title,
        desc: task?.desc,
        assignee: task?.assignee.toString(),
        comment: task?.comment ?? ''
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="  max-w-4xl">
        <DialogHeader>
          <DialogTitle>Task</DialogTitle>
          <DialogDescription>Chi tiết task</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="task-form"
            className=" space-y-4 py-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className=" space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-4">
                  <Badge className={getStatusVariant()}>
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
                  {enableUpdate ? (
                    <FormField
                      control={form.control}
                      name="assignee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assignee</FormLabel>
                          <Combobox
                            modal
                            open={openCombobox}
                            onOpenChange={setOpenCombobox}
                          >
                            <FormControl>
                              <ComboboxTrigger
                                className={cn(
                                  'w-full justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                                disabled={
                                  fetcher.loading || employeeFetcher.loading
                                }
                              >
                                {field.value
                                  ? employees.find(
                                      (employee) =>
                                        employee?.id?.toString() === field.value
                                    )?.username
                                  : 'Select assignee'}
                              </ComboboxTrigger>
                            </FormControl>
                            <ComboboxContent
                              items={employees.map((item) => ({
                                key: item.id ?? '',
                                value: item.username ?? '',
                                label: `${item.username} - ${item.email}`,
                                rawValue: item.id,
                                selected: field.value === item.id?.toString()
                              }))}
                              className="w-[320px] p-0"
                              onSelect={(employee) => {
                                if (!employee.rawValue) return;

                                form.setValue(
                                  'assignee',
                                  employee.rawValue.toString()
                                );
                                setOpenCombobox(false);
                              }}
                            ></ComboboxContent>
                          </Combobox>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <div className=" space-y-2">
                      <Label>Assignee</Label>
                      <div className=" flex items-center space-x-4">
                        <Avatar className=" h-8 w-8">
                          <AvatarFallback>
                            {upperCaseFirstLetter(task?.assignee_name)}
                          </AvatarFallback>
                        </Avatar>
                        <p>{task?.assignee_name}</p>
                      </div>
                    </div>
                  )}
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
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={fetcher.loading || !enableUpdate}
                      />
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
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={5}
                        disabled={fetcher.loading || !enableUpdate}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={5}
                        disabled={fetcher.loading || !enableUpdate}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        {enableUpdate && (
          <DialogFooter>
            <Button type="submit" form="task-form" disabled={fetcher.loading}>
              Cập nhật
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
