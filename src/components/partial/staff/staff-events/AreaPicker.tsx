/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormItem } from "@/components/ui/form";
import { FormLabel, FormControl } from "@mui/material";
import { ChevronDownIcon, CheckIcon, CalendarIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface AreaPickerProps {
  item: {
    AreaId: string;
    Date: Date;
    StartTime: string;
    EndTime: string;
  };
  index: number;
  update: (index: number, value: any) => void;
  areas: Array<{
    areaId: string;
    name: string;
  }>;
}

export const AreaPicker: React.FC<AreaPickerProps> = ({
  item,
  index,
  update,
  areas,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <FormLabel>Area</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {item.AreaId
              ? areas.find((area) => area.areaId === item.AreaId)?.name
              : "Select area..."}
            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search area..." />
            <CommandList>
              <CommandEmpty>No area found.</CommandEmpty>
              <CommandGroup>
                {areas?.map((area) => (
                  <CommandItem
                    key={area.areaId}
                    value={area.areaId}
                    onSelect={(value) => {
                      update(index, {
                        ...item,
                        AreaId: value,
                      });
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={`mr-2 h-4 w-4 ${
                        item.AreaId === area.areaId
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {area.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Component chọn ngày (có thể dùng cho cả Start Date và End Date)
export const DatePicker = ({ selectedDate, onDateSelect, label }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <FormItem className="flex flex-col">
      <FormLabel className="text-gray-500 font-normal text-sm">
        {label}
      </FormLabel>
      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              onClick={() => setOpen(true)}
              className="w-full px-3 text-left font-normal"
            >
              {selectedDate
                ? format(selectedDate, "PPP")
                : `Pick ${label.toLowerCase()}`}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onDateSelect(date);
                setOpen(false);
              }}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </FormControl>
    </FormItem>
  );
};
