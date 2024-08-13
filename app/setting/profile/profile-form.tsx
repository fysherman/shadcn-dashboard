'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { profileSchema, ProfileSchema } from '@/lib/form-schema';
import { Label } from '@/components/ui/label';
import { useUserStore } from '@/store/user-store';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';
import { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { upperCaseFirstLetter } from '@/lib/utils';

export function ProfileForm() {
  const user = useUserStore((state) => state.user);
  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema)
  });
  const fetcher = useFetcher({
    url: ENDPOINT.ME,
    method: 'PUT',
    onSuccess() {
      toast.success('Cập nhật thành công');
    }
  });

  function handleSubmit(body: ProfileSchema) {
    fetcher.trigger({
      body: Object.entries(body).reduce((result, [key, value]) => {
        if (!value) return result;

        return {
          ...result,
          [key]: value
        };
      }, {})
    });
  }

  useEffect(() => {
    if (!user?.username) return;

    form.reset({
      address: user?.address ?? '',
      birth_date: user?.birth_date ?? '',
      bank_account: user?.bank_account ?? '',
      bank_name: user?.bank_name ?? '',
      bank_center: user?.bank_center ?? '',
      identification_card: user?.identification_card ?? '',
      identification_issued_date: user?.identification_issued_date ?? '',
      identification_issued_place: user?.identification_issued_place ?? '',
      emergency_contact_name: user?.emergency_contact_name ?? '',
      emergency_contact_phone: user?.emergency_contact_phone ?? '',
      tax_id: user?.tax_id ?? '',
      phone: user?.phone ?? ''
    });
  }, [user]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className=" my-8 flex items-center space-x-4">
          <Avatar className=" h-32 w-32">
            <AvatarImage
              src={user?.image_profile ?? undefined}
              alt={user?.username ?? undefined}
            />
            <AvatarFallback>
              <p className=" text-5xl font-bold">
                {upperCaseFirstLetter(user?.username)}
              </p>
            </AvatarFallback>
          </Avatar>
          <div className=" space-y-1">
            <h3 className=" text-2xl font-semibold">{user?.username}</h3>
            <p className=" text-gray-500">{user?.fullname}</p>
            <p className=" text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tax_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã số thuế</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày sinh</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="bank_account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tài khoản ngân hàng</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bank_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngân hàng</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bank_center"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chi nhánh</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="emergency_contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại khẩn cấp</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emergency_contact_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên người liên lạc</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="identification_card"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Căn cước</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="identification_issued_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày cấp</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="identification_issued_place"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nơi cấp</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Cập nhật profile</Button>
      </form>
    </Form>
  );
}
