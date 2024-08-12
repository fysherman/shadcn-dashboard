import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './ui/command';
import { FocusScope } from '@radix-ui/react-focus-scope';
import { Key, ReactNode } from 'react';

function ComboboxTrigger({
  children,
  ...props
}: Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <PopoverTrigger asChild>
      <Button variant="outline" role="combobox" {...props}>
        {children}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
  );
}

interface ComboboxItem {
  key: Key | null;
  value: string;
  label: string;
  rawValue?: any;
  selected?: boolean;
}

interface ComboboxContentProps {
  className?: string;
  items: ComboboxItem[];
  onSelect: (item: ComboboxItem) => void;
}

function ComboboxContent({
  className,
  items,
  onSelect
}: Readonly<ComboboxContentProps>) {
  return (
    <DismissableLayer>
      <PopoverContent className={className}>
        <Command>
          <CommandInput placeholder="Search assignee..." />
          <CommandList>
            <CommandEmpty>No employee found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.key}
                  value={item.value}
                  onSelect={() => onSelect(item)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      item.selected ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </DismissableLayer>
  );
}

interface ComboboxProps {
  open: boolean;
  modal?: boolean;
  children: ReactNode;
  onOpenChange: (state: boolean) => void;
}

function Combobox({
  open,
  modal,
  children,
  onOpenChange
}: Readonly<ComboboxProps>) {
  return (
    <Popover modal={modal} open={open} onOpenChange={onOpenChange}>
      <FocusScope loop trapped>
        {children}
      </FocusScope>
    </Popover>
  );
}

export { Combobox, ComboboxContent, ComboboxTrigger };
