import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckIcon, ChevronDownIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useFields } from "@/hooks/staff/Event/useField";
import { FieldDTO } from "@/api/club-owner/RequestClubAPI";

interface FieldPickerProps {
  value: string[];
  onChange: (fieldIds: string[]) => void;
}

const FieldPicker: React.FC<FieldPickerProps> = ({ value = [], onChange }) => {
  const [open, setOpen] = useState(false);

  const { fields } = useFields();

  const selectedFields = fields.filter((field: FieldDTO) =>
    value.includes(field.fieldId)
  );

  const handleSelect = (field: FieldDTO) => {
    if (value.includes(field.fieldId)) {
      onChange(value.filter((id) => id !== field.fieldId));
    } else {
      onChange([...value, field.fieldId]);
    }
  };

  const handleRemove = (fieldId: string) => {
    onChange(value.filter((id) => id !== fieldId));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedFields.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {selectedFields.map((field: FieldDTO) => (
                <Badge
                  key={field.fieldId}
                  variant="secondary"
                  className="mr-1 mb-1"
                >
                  {field.fieldName}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(field.fieldId);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <span>Select fields...</span>
          )}
          <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search fields..." />
          <CommandList>
            <CommandEmpty>No fields found.</CommandEmpty>
            <CommandGroup>
              {fields.map((field: FieldDTO) => {
                const isSelected = value.includes(field.fieldId);
                return (
                  <CommandItem
                    key={field.fieldId}
                    onSelect={() => handleSelect(field)}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {isSelected && <CheckIcon className="h-4 w-4" />}
                    </div>
                    {field.fieldName}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FieldPicker;
