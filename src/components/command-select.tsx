import { ReactNode, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

import {
  CommandEmpty,
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandSeparator,
  CommandResponsiveDialog,
} from "@/components/ui/command";

interface CommandSelectProps {
  options: Array<{ value: string; id: string; children: ReactNode }>;
  onSelect: (value: string) => void;
  onSearch: (value: string) => void;
  value: string;

  placeholder: string;
  isSearchable?: boolean;
  className?: string;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  isSearchable,
  className,
}: CommandSelectProps) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      onSearch("");
    }
  };
  return (
    <>
      <Button

        type="button"
        variant="outline"
        className={cn(
          "h-9 justify-between font-normal px-2",
          !selectedOption && "text-muted-foreground",
          className
        )}
        onClick={() => setOpen(!open)}
      >
        <div>{selectedOption?.children ?? placeholder}</div>
        <ChevronDownIcon className="h-4 w-4" />
      </Button>
      <CommandResponsiveDialog open={open} onOpenChange={handleOpenChange}
      shouldFilter={!onSearch}
      >
        <Command shouldFilter={!onSearch}>
          <CommandInput 
            placeholder="Search..." 
            onValueChange={(value) => {
              if (onSearch) {
                onSearch(value);
              }
            }} 
          />
          <CommandList>
            <CommandEmpty>
                <span className="text-sm text-muted-foreground">
                No results found.
                </span>
                </CommandEmpty>
            <CommandSeparator />
            {options.map((option) => (
              <CommandItem
                key={option.id}
                value={option.value}
                onSelect={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
              >
                {option.children}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </CommandResponsiveDialog>
    </>
  );
};
