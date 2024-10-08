'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useContractStore } from '@/store/contract-store';
import { Contract } from '@/types';
import { MoreHorizontal, Package } from 'lucide-react';

interface CellActionProps {
  data: Contract;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const setOpenDetail = useContractStore((state) => state.setOpenDetail);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          className=" cursor-pointer"
          onClick={() => setOpenDetail(data)}
        >
          <Package className="mr-2 h-4 w-4" /> Xem / Cập nhật hợp đồng
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
