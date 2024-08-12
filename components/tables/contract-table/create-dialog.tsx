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
import { contractSchema, ContractSchema } from '@/lib/form-schema';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
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
import { Employee } from '@/types';
import {
  Combobox,
  ComboboxContent,
  ComboboxTrigger
} from '@/components/combobox';
import { Textarea } from '@/components/ui/textarea';

export default function CreateDialog({
  reload
}: Readonly<{ reload: () => void }>) {
  const fetcher = useFetcher({
    url: ENDPOINT.CONTRACTS,
    method: 'POST',
    onSuccess() {
      toast.success('Tạo hợp đồng thành công');
      reload();
      setOpen(false);
    }
  });
  const employeeFetcher = useFetcher({
    url: ENDPOINT.EMPLOYEES,
    method: 'GET',
    silent: true
  });
  const role = useUserStore((state) => state.role);
  const user = useUserStore((state) => state.user);
  const form = useForm<ContractSchema>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      title: 'Đề nghị gia hạn hợp đồng',
      from_date: new Date(),
      to_date: new Date()
    }
  });
  const [open, setOpen] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const employees: Employee[] = employeeFetcher.data?.results ?? [];
  const collaborator = form.watch('collaborator');
  const collaboratorInfo = useMemo<Employee | undefined>(() => {
    if (!collaborator) return;

    return employees.find((employee) => employee.id === Number(collaborator));
  }, [collaborator]);

  function handleSubmit(data: ContractSchema) {
    fetcher.trigger({
      body: {
        title: data.title,
        from_date: format(data.from_date, 'yyyy-MM-dd'),
        to_date: format(data.to_date, 'yyyy-MM-dd'),
        desc: data.desc,
        hr: user?.id,
        collaborator: collaboratorInfo?.id,
        mentor: collaboratorInfo?.manager,
        manager: collaboratorInfo?.manager_division_id
      }
    });
  }

  useEffect(() => {
    if (!role || role !== ROLES.HR) return;

    employeeFetcher.trigger();
  }, [role]);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  if (!role || role !== ROLES.HR) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className=" mr-2 h-4 w-4" /> Tạo đề nghị gian hạn hợp đồng
        </Button>
      </DialogTrigger>
      <DialogContent className=" max-w-4xl">
        <Form {...form}>
          <form id="report-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Hợp đồng</DialogTitle>
              <DialogDescription>
                Hợp đồng Cộng tác viên, Thực tập sinh
              </DialogDescription>
            </DialogHeader>
            <div className=" space-y-4 py-4">
              <FormField
                control={form.control}
                name="collaborator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cộng tác viên / Thực tập sinh</FormLabel>
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
                          disabled={fetcher.loading || employeeFetcher.loading}
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
                            'collaborator',
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
              {collaboratorInfo && (
                <>
                  <div className=" grid grid-cols-4 gap-4">
                    <Label>Họ và tên</Label>
                    <p className=" col-span-3">{collaboratorInfo.fullname}</p>
                  </div>
                  <div className=" grid grid-cols-4 gap-4">
                    <Label>Account</Label>
                    <p className=" col-span-3">{collaboratorInfo.username}</p>
                  </div>
                  <div className=" grid grid-cols-4 gap-4">
                    <Label>Email</Label>
                    <p className=" col-span-3">{collaboratorInfo.email}</p>
                  </div>
                  <div className=" grid grid-cols-4 gap-4">
                    <Label>Division</Label>
                    <p className=" col-span-3">{collaboratorInfo.division}</p>
                  </div>
                  <div className=" grid grid-cols-4 gap-4">
                    <Label>Department</Label>
                    <p className=" col-span-3">{collaboratorInfo.department}</p>
                  </div>
                  <div className=" grid grid-cols-4 gap-4">
                    <Label>Mentor</Label>
                    <div className=" col-span-3 flex items-center space-x-2">
                      <Avatar className=" h-8 w-8">
                        <AvatarFallback>
                          {upperCaseFirstLetter(collaboratorInfo.manager_name)}
                        </AvatarFallback>
                      </Avatar>
                      <p>{collaboratorInfo.manager_name}</p>
                    </div>
                  </div>
                  <div className=" grid grid-cols-4 gap-4">
                    <Label>Manager</Label>
                    <div className=" col-span-3 flex items-center space-x-2">
                      <Avatar className=" h-8 w-8">
                        <AvatarFallback>
                          {upperCaseFirstLetter(
                            collaboratorInfo.manager_division_name
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <p>{collaboratorInfo.manager_division_name}</p>
                    </div>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label>Kỳ đánh giá</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <FormField
                      control={form.control}
                      name="from_date"
                      render={({ field }) => (
                        <FormItem className=" flex flex-col">
                          <FormLabel>Từ</FormLabel>
                          <Popover modal>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                  disabled={
                                    fetcher.loading || employeeFetcher.loading
                                  }
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                  <div>
                    <FormField
                      control={form.control}
                      name="to_date"
                      render={({ field }) => (
                        <FormItem className=" flex flex-col">
                          <FormLabel>Đến</FormLabel>
                          <Popover modal>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                  disabled={
                                    fetcher.loading || employeeFetcher.loading
                                  }
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                        disabled={fetcher.loading || employeeFetcher.loading}
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
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={fetcher.loading || employeeFetcher.loading}
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
            disabled={fetcher.loading || employeeFetcher.loading}
          >
            Tạo báo cáo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
