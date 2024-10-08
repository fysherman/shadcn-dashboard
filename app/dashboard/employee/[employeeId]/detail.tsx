'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { ENDPOINT } from '@/constants/endpoint';
import useFetcher from '@/lib/fetcher';
import { fallbackValue, upperCaseFirstLetter } from '@/lib/utils';
import { Employee } from '@/types';
import { LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ContractTable from '@/components/tables/contract-table';

export function Detail() {
  const params = useParams();
  const fetcher = useFetcher({
    url: `${ENDPOINT.EMPLOYEES}${params.employeeId}/`,
    method: 'GET',
    triggerOnMount: true
  });
  const contractFetcher = useFetcher({
    url: ENDPOINT.CONTRACTS,
    params: {
      collaborator: params.employeeId
    },
    triggerOnMount: true
  });

  const contracts = contractFetcher.data?.results ?? [];
  const user: Employee = fetcher.data;

  return (
    <div className=" grid grid-cols-3 gap-2 space-y-4">
      <div className=" col-span-3 mb-8 flex items-center space-x-4">
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
      <div className=" col-span-1">
        <Label>Employee type</Label>
        <p className=" text-gray-500">{fallbackValue(user?.employee_type)}</p>
      </div>
      <div className=" col-span-1">
        <Label>Quản lí</Label>
        <p className=" text-gray-500">{fallbackValue(user?.manager_name)}</p>
      </div>
      <div className="col-span-1"></div>
      <div className=" col-span-1">
        <Label>Division</Label>
        <p className=" text-gray-500">{fallbackValue(user?.division)}</p>
      </div>
      <div className=" col-span-1">
        <Label>Department</Label>
        <p className=" text-gray-500">{fallbackValue(user?.department)}</p>
      </div>
      <div className="col-span-1"></div>
      <div className=" col-span-3">
        <Label>Số điện thoại</Label>
        <p className=" text-gray-500">{fallbackValue(user?.phone)}</p>
      </div>
      <div className=" col-span-3">
        <Label>Địa chỉ</Label>
        <p className=" text-gray-500">{fallbackValue(user?.address)}</p>
      </div>
      <div className=" col-span-3">
        <Label>Mã số thuế</Label>
        <p className=" text-gray-500">{fallbackValue(user?.tax_id)}</p>
      </div>
      <div className=" col-span-1">
        <Label>Ngân hàng</Label>
        <p className=" text-gray-500">{fallbackValue(user?.bank_name)}</p>
      </div>
      <div className=" col-span-1">
        <Label>Tài khoản</Label>
        <p className=" text-gray-500">{fallbackValue(user?.bank_account)}</p>
      </div>
      <div className=" col-span-1">
        <Label>Chi nhánh</Label>
        <p className=" text-gray-500">{fallbackValue(user?.bank_name)}</p>
      </div>
      <div className=" col-span-1">
        <Label>Người liên hệ khẩn cấp</Label>
        <p className=" text-gray-500">
          {fallbackValue(user?.emergency_contact_name)}
        </p>
      </div>
      <div className=" col-span-1">
        <Label>Số điện thoại</Label>
        <p className=" text-gray-500">
          {fallbackValue(user?.emergency_contact_phone)}
        </p>
      </div>
      <div className="col-span-1"></div>
      <div className=" col-span-1">
        <Label>Căn cước</Label>
        <p className=" text-gray-500">
          {fallbackValue(user?.identification_card)}
        </p>
      </div>
      <div className=" col-span-1">
        <Label>Nơi cấp</Label>
        <p className=" text-gray-500">
          {fallbackValue(user?.identification_issued_place)}
        </p>
      </div>
      <div className=" col-span-1">
        <Label>Ngày cấp</Label>
        <p className=" text-gray-500">
          {fallbackValue(user?.identification_issued_date)}
        </p>
      </div>
      <div className=" col-span-3">
        <Label>Căn cước mặt trước</Label>
        <Image
          src={fallbackValue(user?.identification_front_image, '')}
          alt="identification_front_image"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div className=" col-span-3">
        <Label>Căn cước mặt sau</Label>
        <Image
          src={fallbackValue(user?.identification_back_image, '')}
          alt="identification_back_image"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div className=" col-span-3 space-y-2">
        <Label>Danh sách hợp đồng</Label>
        <ContractTable mini data={contracts} reload={contractFetcher.trigger} />
      </div>
      <div className="col-span-3 flex space-x-2 pt-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button>
              <LayoutGrid className=" mr-2 h-4 w-4" /> Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href={`/dashboard/task?create-user=${user?.id}`}>
                Tạo task
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/dashboard/report?create-user=${user?.id}`}>
                Tạo báo cáo
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/dashboard/contract?create-user=${user?.id}`}>
                Đề nghị gia hạn hợp đồng
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Update Mentor của CTV/TTS</DropdownMenuItem>
            <DropdownMenuItem>Export dữ liệu hợp đồng</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
