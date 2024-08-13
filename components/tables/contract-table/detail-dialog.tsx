'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
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
import { upperCaseFirstLetter } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useContractStore } from '@/store/contract-store';
import { getStatusName, getStatusVariant } from './helpers';
import {
  CONTRACT_STATUS,
  CONTRACT_STATUS_LEVEL,
  CONTRACT_EVALUATION_CRITERIA
} from '@/constants';
import { useUserStore } from '@/store/user-store';
import { Button } from '@/components/ui/button';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';
import ContractTaskTable from '../contract-task-table';
import { useEffect, useMemo, useState } from 'react';
import { ContractTask } from '@/types';
import {
  contractFinalSchema,
  ContractFinalSchema,
  contractScoreSchema,
  ContractScoreSchema,
  contractTaskSchema,
  ContractTaskSchema
} from '@/lib/form-schema';
import { useForm } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function DetailDialog({
  reload
}: Readonly<{ reload: () => void }>) {
  const user = useUserStore((state) => state.user);
  const open = useContractStore((state) => state.openDetail);
  const contract = useContractStore((state) => state.contractDetail);
  const closeDetail = useContractStore((state) => state.closeDetail);
  const fetcher = useFetcher({
    method: 'PUT',
    onSuccess() {
      reload();
      setOpen(false);
    }
  });
  const taskForm = useForm<ContractTaskSchema>({
    resolver: zodResolver(contractTaskSchema),
    defaultValues: {
      title: '',
      result: ''
    }
  });
  const scoreForm = useForm<ContractScoreSchema>({
    resolver: zodResolver(contractScoreSchema),
    defaultValues: {
      efficiency: CONTRACT_EVALUATION_CRITERIA.PASS,
      learning_ability: CONTRACT_EVALUATION_CRITERIA.GOOD,
      responsibility: CONTRACT_EVALUATION_CRITERIA.GOOD,
      collaboration: CONTRACT_EVALUATION_CRITERIA.GOOD,
      attitude: CONTRACT_EVALUATION_CRITERIA.GOOD,
      adaptability: CONTRACT_EVALUATION_CRITERIA.PASS,
      mentor_proposal: CONTRACT_EVALUATION_CRITERIA.EXTEND_CONTRACT,
      salary_proposal: ''
    }
  });
  const finalForm = useForm<ContractFinalSchema>({
    resolver: zodResolver(contractFinalSchema),
    defaultValues: {
      new_contract_confirm: CONTRACT_EVALUATION_CRITERIA.AGREE,
      collaborator_salary: CONTRACT_EVALUATION_CRITERIA.AGREE_WITH_MENTOR
    }
  });
  const [localTasks, setLocalTasks] = useState<ContractTask[]>([]);
  const [hasDraftTask, setHasDraftTask] = useState<boolean>(false);
  const tasks = useMemo(() => {
    if (contract?.status !== CONTRACT_STATUS.HR_CREATED)
      return contract?.tasks ?? [];

    return localTasks;
  }, [contract?.tasks, localTasks]);
  const contractLevel = contract?.status
    ? CONTRACT_STATUS_LEVEL[contract.status]
    : 0;
  const disableSubmit = useMemo(() => {
    const emptyLocalTask = !!(
      contract?.status &&
      contract.status === CONTRACT_STATUS.HR_CREATED &&
      !localTasks.length
    );

    return fetcher.loading || emptyLocalTask || hasDraftTask;
  }, [fetcher.loading, localTasks.length, hasDraftTask]);
  const salaryOption = finalForm.watch('collaborator_salary');

  function setOpen(state: boolean) {
    if (state) return;

    taskForm.reset();
    scoreForm.reset();
    setLocalTasks([]);
    closeDetail();
  }

  function checkUpdatePermission() {
    const userId = user?.id;
    let hasPermission = false;

    switch (contract?.status) {
      case CONTRACT_STATUS.HR_CREATED:
        if (userId === contract?.collaborator) hasPermission = true;
        break;
      case CONTRACT_STATUS.COLLABORATOR_SUBMITTED:
        if (userId === contract?.mentor) hasPermission = true;
        break;
      case CONTRACT_STATUS.MENTOR_REVIEWED:
        if (userId === contract?.manager) hasPermission = true;
        break;
      default:
        break;
    }

    return hasPermission;
  }

  function submitLocalTask(data: ContractTaskSchema) {
    setLocalTasks([
      ...localTasks,
      {
        index: localTasks.length + 1,
        ...data
      }
    ]);
    taskForm.reset();
    setHasDraftTask(false);
  }

  function submitContract() {
    const body: Record<string, any> = {
      title: contract?.title
    };
    const values = finalForm.getValues();

    switch (contract?.status) {
      case CONTRACT_STATUS.HR_CREATED:
        body.status = CONTRACT_STATUS.COLLABORATOR_SUBMITTED;
        body.tasks = localTasks;
        break;
      case CONTRACT_STATUS.COLLABORATOR_SUBMITTED:
        body.status = CONTRACT_STATUS.MENTOR_REVIEWED;
        body.mentor_review = scoreForm.getValues();
        break;
      case CONTRACT_STATUS.MENTOR_REVIEWED:
        body.status = CONTRACT_STATUS.MANAGER_REVIEWED;
        body.manager_review = {
          new_contract_confirm: values.new_contract_confirm,
          collaborator_salary: values.other_salary
            ? values.other_salary
            : values.collaborator_salary
        };
        break;
      default:
        break;
    }

    fetcher.trigger({
      url: `${ENDPOINT.CONTRACTS}${contract?.id}`,
      body
    });
  }

  useEffect(() => {
    if (!open) return;

    if (contract?.mentor_review) {
      scoreForm.reset({
        ...contract.mentor_review
      });
    }
    if (contract?.manager_review) {
      finalForm.reset({
        ...contract.manager_review
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" max-w-4xl">
        <DialogHeader>
          <DialogTitle>Báo cáo</DialogTitle>
          <DialogDescription>Chi tiết báo cáo</DialogDescription>
        </DialogHeader>
        <div className=" space-y-4 py-4">
          <Badge className={getStatusVariant(contract?.status ?? undefined)}>
            {getStatusName(contract?.status ?? undefined)}
          </Badge>
          <div className=" grid grid-cols-4 gap-4">
            <Label>TTS / CTV</Label>
            <div className=" col-span-3 flex items-center space-x-2">
              <Avatar className=" h-8 w-8">
                <AvatarFallback>
                  {upperCaseFirstLetter(contract?.collaborator_name ?? '')}
                </AvatarFallback>
              </Avatar>
              <p>{contract?.collaborator_name}</p>
            </div>
          </div>
          <div className=" grid grid-cols-4 gap-4">
            <Label>Mentor</Label>
            <div className=" col-span-3 flex items-center space-x-2">
              <Avatar className=" h-8 w-8">
                <AvatarFallback>
                  {upperCaseFirstLetter(contract?.mentor_name ?? '')}
                </AvatarFallback>
              </Avatar>
              <p>{contract?.mentor_name}</p>
            </div>
          </div>
          <div className=" grid grid-cols-4 gap-4">
            <Label>Manager</Label>
            <div className=" col-span-3 flex items-center space-x-2">
              <Avatar className=" h-8 w-8">
                <AvatarFallback>
                  {upperCaseFirstLetter(contract?.manager_name ?? '')}
                </AvatarFallback>
              </Avatar>
              <p>{contract?.manager_name}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Các công việc đã thực hiện</Label>
            <ContractTaskTable data={tasks} />
          </div>
          {contract?.status && contractLevel === 1 && (
            <>
              {hasDraftTask && (
                <Form {...taskForm}>
                  <form
                    id="task-form"
                    onSubmit={taskForm.handleSubmit(submitLocalTask)}
                  >
                    <div className="grid grid-cols-7 gap-4">
                      <div className="col-span-1">{localTasks.length + 1}</div>
                      <div className="col-span-3">
                        <FormField
                          control={taskForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Tiêu đề" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-3">
                        <FormField
                          control={taskForm.control}
                          name="result"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Kết quả" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </form>
                </Form>
              )}
              <div className="flex justify-end space-x-4">
                {hasDraftTask ? (
                  <>
                    <Button type="submit" form="task-form">
                      Lưu
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        taskForm.reset();
                        setHasDraftTask(false);
                      }}
                    >
                      Hủy
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setHasDraftTask(true)}
                  >
                    Thêm task
                  </Button>
                )}
              </div>
            </>
          )}
          {contract?.status && contractLevel >= 2 && (
            <Form {...scoreForm}>
              <form onSubmit={scoreForm.handleSubmit(submitContract)}>
                <div className="space-y-4">
                  <Label className=" text-base">Đánh giá của Mentor</Label>
                  <FormField
                    control={scoreForm.control}
                    name="efficiency"
                    render={({ field }) => (
                      <FormItem className=" flex items-center space-x-4 space-y-0">
                        <FormLabel>Hiệu quả công việc: </FormLabel>
                        <FormControl>
                          <RadioGroup
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className=" flex items-center"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={CONTRACT_EVALUATION_CRITERIA.PASS}
                                id="efficiency-1"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="efficiency-1">Đạt</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={CONTRACT_EVALUATION_CRITERIA.FAIL}
                                id="efficiency-2"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="efficiency-2">Không đạt</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={scoreForm.control}
                    name="learning_ability"
                    render={({ field }) => (
                      <FormItem className=" flex items-center space-x-4 space-y-0">
                        <FormLabel>
                          Mức độ tiếp thu, khả năng học hỏi trong công việc:
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className=" flex items-center"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={CONTRACT_EVALUATION_CRITERIA.GOOD}
                                id="learning_ability-1"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="learning_ability-1">Tốt</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={
                                  CONTRACT_EVALUATION_CRITERIA.ABOVE_AVERAGE
                                }
                                id="learning_ability-2"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="learning_ability-2">Khá</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={CONTRACT_EVALUATION_CRITERIA.AVERAGE}
                                id="learning_ability-3"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="learning_ability-3">
                                Trung bình
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={scoreForm.control}
                    name="responsibility"
                    render={({ field }) => (
                      <FormItem className=" flex items-center space-x-4 space-y-0">
                        <FormLabel>
                          Sự chủ động và tinh thần trách nhiệm với công việc để
                          đạt mục tiêu đề ra:
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className=" flex items-center"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={CONTRACT_EVALUATION_CRITERIA.GOOD}
                                id="responsibility-1"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="responsibility-1">Tốt</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={
                                  CONTRACT_EVALUATION_CRITERIA.ABOVE_AVERAGE
                                }
                                id="responsibility-2"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="responsibility-2">Khá</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={CONTRACT_EVALUATION_CRITERIA.AVERAGE}
                                id="responsibility-3"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="responsibility-3">
                                Trung bình
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={scoreForm.control}
                    name="collaboration"
                    render={({ field }) => (
                      <FormItem className=" flex items-center space-x-4 space-y-0">
                        <FormLabel>
                          Khả năng hỗ trợ, phối hợp công việc với đồng nghiệp và
                          cán bộ phụ trách:
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className=" flex items-center"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={CONTRACT_EVALUATION_CRITERIA.GOOD}
                                id="collaboration-1"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="collaboration-1">Tốt</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={
                                  CONTRACT_EVALUATION_CRITERIA.ABOVE_AVERAGE
                                }
                                id="collaboration-2"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="collaboration-2">Khá</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={CONTRACT_EVALUATION_CRITERIA.AVERAGE}
                                id="collaboration-3"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="collaboration-3">
                                Trung bình
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={scoreForm.control}
                    name="attitude"
                    render={({ field }) => (
                      <FormItem className=" flex items-center space-x-4 space-y-0">
                        <FormLabel>
                          Ý thức Chấp hành Nội quy Công ty và thái độ làm việc:
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className=" flex items-center"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={CONTRACT_EVALUATION_CRITERIA.GOOD}
                                id="attitude-1"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="attitude-1">Tốt</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={
                                  CONTRACT_EVALUATION_CRITERIA.ABOVE_AVERAGE
                                }
                                id="attitude-2"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="attitude-2">Khá</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={CONTRACT_EVALUATION_CRITERIA.AVERAGE}
                                id="attitude-3"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="attitude-3">Trung bình</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={scoreForm.control}
                    name="adaptability"
                    render={({ field }) => (
                      <FormItem className=" flex items-center space-x-4 space-y-0">
                        <FormLabel>
                          Đánh giá mức độ đáp ứng với công việc được giao:
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className=" flex items-center"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={CONTRACT_EVALUATION_CRITERIA.PASS}
                                id="adaptability-1"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="adaptability-1">Đạt</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={CONTRACT_EVALUATION_CRITERIA.FAIL}
                                id="adaptability-2"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="adaptability-2">Không đạt</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={scoreForm.control}
                    name="mentor_proposal"
                    render={({ field }) => (
                      <FormItem className=" flex items-center space-x-4 space-y-0">
                        <FormLabel>Đề xuất của Mentor:</FormLabel>
                        <FormControl>
                          <RadioGroup
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className=" flex items-center"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={
                                  CONTRACT_EVALUATION_CRITERIA.EXTEND_CONTRACT
                                }
                                id="mentor_proposal-1"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="mentor_proposal-1">
                                Gia hạn hợp đồng
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={
                                  CONTRACT_EVALUATION_CRITERIA.TERMINATE_CONTRACT
                                }
                                id="mentor_proposal-2"
                                disabled={
                                  fetcher.loading || contractLevel !== 2
                                }
                              />
                              <Label htmlFor="mentor_proposal-2">
                                Chấm dứt hợp đồng
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={scoreForm.control}
                    name="salary_proposal"
                    render={({ field }) => (
                      <FormItem className=" flex items-center space-x-4 space-y-0">
                        <FormLabel className=" flex-shrink-0">
                          Mức lương đề xuất (nếu có điều chỉnh):
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={fetcher.loading || contractLevel !== 2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          )}
          {contract?.status && contractLevel >= 3 && (
            <Form {...finalForm}>
              <form onSubmit={finalForm.handleSubmit(submitContract)}>
                <div className="space-y-4">
                  <Label className=" text-base">Đánh giá của Manager</Label>
                  <FormField
                    control={finalForm.control}
                    name="new_contract_confirm"
                    render={({ field }) => (
                      <FormItem className=" flex items-center space-x-4 space-y-0">
                        <FormLabel>
                          Đồng ý gia hạn hợp đồng với CTV / TTS:{' '}
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className=" flex items-center"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={CONTRACT_EVALUATION_CRITERIA.AGREE}
                                id="new_contract_confirm-1"
                                disabled={
                                  fetcher.loading || contractLevel !== 3
                                }
                              />
                              <Label htmlFor="new_contract_confirm-1">
                                Đồng ý
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={CONTRACT_EVALUATION_CRITERIA.DISAGREE}
                                id="new_contract_confirm-2"
                                disabled={
                                  fetcher.loading || contractLevel !== 3
                                }
                              />
                              <Label htmlFor="new_contract_confirm-2">
                                Không
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={finalForm.control}
                    name="collaborator_salary"
                    render={({ field }) => (
                      <FormItem className=" flex items-center space-x-4 space-y-0">
                        <FormLabel>Mức lương CTV / TTS:</FormLabel>
                        <FormControl>
                          <RadioGroup
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className=" flex items-center"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={CONTRACT_EVALUATION_CRITERIA.RETAIN}
                                id="collaborator_salary-1"
                                disabled={
                                  fetcher.loading || contractLevel !== 3
                                }
                              />
                              <Label htmlFor="collaborator_salary-1">
                                Giữ nguyên
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={
                                  CONTRACT_EVALUATION_CRITERIA.AGREE_WITH_MENTOR
                                }
                                id="collaborator_salary-2"
                                disabled={
                                  fetcher.loading || contractLevel !== 3
                                }
                              />
                              <Label htmlFor="collaborator_salary-2">
                                Đồng ý với đề xuất Mentor
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={CONTRACT_EVALUATION_CRITERIA.OTHER}
                                id="collaborator_salary-2"
                                disabled={
                                  fetcher.loading || contractLevel !== 3
                                }
                              />
                              <Label htmlFor="collaborator_salary-2">
                                Số khác
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {salaryOption === CONTRACT_EVALUATION_CRITERIA.OTHER && (
                    <FormField
                      control={finalForm.control}
                      name="other_salary"
                      render={({ field }) => (
                        <FormItem className=" flex items-center space-x-4 space-y-0">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Số khác"
                              disabled={fetcher.loading || contractLevel !== 3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </form>
            </Form>
          )}
        </div>
        {checkUpdatePermission() && (
          <DialogFooter>
            <Button disabled={disableSubmit} onClick={submitContract}>
              Xác nhận
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
