import * as React from "react";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Ví dụ: inside / outside
const filterOptions = [
  { label: "Private", value: "PRIVATE" },
  { label: "Public", value: "PUBLIC" },
];

interface EventCategoryFilterProps {
  // Mảng các giá trị đã chọn (ví dụ: ["inside", "outside"])
  value: string[];
  // Hàm callback khi thay đổi filter
  onChange: (newValue: string[]) => void;
}

export function EventCategoryFilter({
  value,
  onChange,
}: EventCategoryFilterProps) {
  const [open, setOpen] = React.useState(false);

  // Toggle một lựa chọn trong mảng
  const toggleSelection = (val: string) => {
    let newValue: string[];
    if (value.includes(val)) {
      // Bỏ chọn
      newValue = value.filter((v) => v !== val);
    } else {
      // Chọn thêm
      newValue = [...value, val];
    }
    onChange(newValue);
  };

  const handleClearFilters = () => {
    onChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-10 px-4 rounded-lg text-white bg-gradient-to-r from-[#136CB5] to-[#49BBBD] hover:opacity-90 flex items-center justify-between space-x-2"
          onClick={() => setOpen(true)}
        >
          <span>
            {value.length > 0 ? `${value.length} Selected` : "Event's scope"}
          </span>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {filterOptions.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      toggleSelection(option.value);
                      setOpen(false);
                    }}
                    className="flex items-center"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {value.length > 0 && (
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    handleClearFilters();
                    setOpen(false);
                  }}
                  className="justify-center text-center text-red-500"
                >
                  Clear Filters
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
