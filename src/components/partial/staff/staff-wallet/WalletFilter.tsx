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
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const filterOptions = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];
interface WalletStatusFilterProps {
  selected: Set<string>;
  setSelectedStatus: (selected: Set<string>) => void;
}

export function WalletStatusFilter({
  selected,
  setSelectedStatus,
}: WalletStatusFilterProps) {
  const toggleSelection = (value: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(value)) {
      newSelected.delete(value);
    } else {
      newSelected.add(value);
    }
    setSelectedStatus(newSelected);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-10 px-4 rounded-lg text-white bg-gradient-to-r from-[#136CB5] to-[#49BBBD] hover:opacity-90 flex items-center justify-between space-x-2"
        >
          <span>
            {selected.size > 0
              ? `${selected.size} Selected`
              : "Wallet's status"}
          </span>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search status..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {filterOptions.map((option) => {
                const isSelected = selected.has(option.value.toString());
                return (
                  <CommandItem
                    key={option.value.toString()}
                    onSelect={() => toggleSelection(option.value.toString())}
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
            {selected.size > 0 && (
              <CommandGroup>
                <CommandItem
                  onSelect={() => setSelectedStatus(new Set())}
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
