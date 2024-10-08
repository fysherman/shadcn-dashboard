'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user-store';
import { upperCaseFirstLetter } from '@/lib/utils';
import { useMemo } from 'react';

export function UserNav() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const needUpdateProfile = useMemo(() => {
    if (!user) return false;

    return [
      user.fullname,
      user.phone,
      user.tax_id,
      user.address,
      user.bank_account,
      user.identification_card,
      user.identification_front_image,
      user.identification_back_image,
      user.emergency_contact_phone
    ].some((item) => !item);
  }, [user]);

  function handleLogout() {
    localStorage.removeItem('token');
    setUser();
    router.push('/sign-in');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className=" relative">
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.image_profile ?? ''}
                alt={user?.username ?? ''}
              />
              <AvatarFallback>
                {upperCaseFirstLetter(user?.username)}
              </AvatarFallback>
            </Avatar>
          </Button>
          {needUpdateProfile && (
            <span className=" absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.fullname}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup onClick={() => router.push('/setting/profile')}>
          <DropdownMenuItem>
            Profile
            {needUpdateProfile && (
              <Badge variant="destructive" className=" ml-auto">
                Update
              </Badge>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className=" text-red-500" onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
