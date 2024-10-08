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
  const fetcher = useFetcher({
    url: ENDPOINT.LOGIN,
    method: 'POST',
    withToken: false
  });
  const fetcherMe = useFetcher({
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
  const loading = fetcher.loading || fetcherMe.loading;

  function handleLoginSuccess(token: string) {
    localStorage.setItem('token', token);

    fetcherMe.trigger({
      onSuccess(data) {
        if (
          data?.role &&
          [ROLES.HR, ROLES.MANAGER, ROLES.MENTOR].includes(data.role)
        ) {
          router.push('/dashboard/employee');
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
    await fetcher.trigger({
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
                  disabled={loading}
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
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="ml-auto w-full" type="submit" disabled={loading}>
          Continue
        </Button>
      </form>
    </Form>
  );
}
