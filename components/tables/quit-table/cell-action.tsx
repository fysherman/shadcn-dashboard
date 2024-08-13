'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useQuitStore } from '@/store/quit-store';
import { Quit } from '@/types';
import { MoreHorizontal, Package } from 'lucide-react';

interface CellActionProps {
  data: Quit;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const setOpenDetail = useQuitStore((state) => state.setOpenDetail);

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
          <Package className="mr-2 h-4 w-4" /> Chi tiết
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
