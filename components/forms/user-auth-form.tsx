'use client';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { authSchema, AuthSchema } from '@/lib/form-schema';
import { toast } from 'sonner';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';
import { ROLES } from '@/constants';

export default function UserAuthForm() {
  const router = useRouter();
  const { trigger, loading } = useFetcher({
    url: ENDPOINT.LOGIN,
    method: 'POST',
    withToken: false
  });
  const { trigger: getMe, loading: loadingGetMe } = useFetcher({
    url: ENDPOINT.ME,
    method: 'GET'
  });
  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  function handleLoginSuccess(token: string) {
    localStorage.setItem('token', token);

    getMe({
      onSuccess(data) {
        if (
          data?.role &&
          [ROLES.HR, ROLES.MANAGER, ROLES.MENTOR].includes(data.role)
        ) {
          router.push('/dashboard/talent');
          return;
        }
        router.push('/dashboard/leave');
      },
      onError() {
        router.push('/dashboard/leave');
      },
      onSettled() {
        toast.success('Đăng nhập thành công');
      }
    });
  }

  function handleLoginError() {
    toast.error('Đăng nhập thất bại');
  }

  async function handleSubmit(data: AuthSchema) {
    await trigger({
      body: data,
      silent: true,
      onSuccess(res) {
        if (res?.token) {
          handleLoginSuccess(res.token);
          return;
        }
        handleLoginError();
      },
      onError: handleLoginError
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-2"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your account"
                  disabled={loading || loadingGetMe}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  disabled={loading || loadingGetMe}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="ml-auto w-full"
          type="submit"
          disabled={loading || loadingGetMe}
        >
          Continue
        </Button>
      </form>
    </Form>
  );
}
