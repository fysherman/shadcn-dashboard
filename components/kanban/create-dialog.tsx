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
import { Textarea } from '../ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskSchema, taskSchema } from '@/lib/form-schema';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';
import { useUserStore } from '@/store/user-store';
import { ROLES } from '@/constants';
import { Employee } from '@/types';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/store/task-store';
import { Combobox, ComboboxContent, ComboboxTrigger } from '../combobox';

export default function CreateDialog() {
  const role = useUserStore((state) => state.role);
  const setKey = useTaskStore((state) => state.setKey);
  const fetcher = useFetcher({
    url: ENDPOINT.TASKS,
    method: 'POST',
    onSuccess() {
      toast.success('Tạo task thành công');
      setKey();
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
      title: '',
      desc: ''
    }
  });
  const [open, setOpen] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const employees: Employee[] = employeeFetcher.data?.results ?? [];

  async function handleSubmit(data: TaskSchema) {
    try {
      fetcher.trigger({
        body: {
          ...data,
          assignee: Number(data.assignee)
        }
      });
    } catch (error) {}
  }

  useEffect(() => {
    if (!role || role === ROLES.COLLABORATOR) return;

    employeeFetcher.trigger();
  }, [role]);

  useEffect(() => {
    if (!open) form.reset();
  }, [open]);

  if (!role || ![ROLES.HR, ROLES.MANAGER, ROLES.MENTOR].includes(role))
    return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className=" mr-2 h-4 w-4" /> Tạo task
        </Button>
      </DialogTrigger>
      <DialogContent className=" max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo task</DialogTitle>
          <DialogDescription>Task công việc</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="task-form"
            className=" space-y-4 py-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem className=" col-span-1 flex flex-col">
                    <FormLabel>Assignee</FormLabel>
                    <Combobox
                      modal
                      open={openCombobox}
                      onOpenChange={setOpenCombobox}
                    >
                      <FormControl>
                        <ComboboxTrigger
                          className={cn(
                            'w-[320px] justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                          disabled={fetcher.loading}
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
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} disabled={fetcher.loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="task-form" disabled={fetcher.loading}>
            Tạo task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
