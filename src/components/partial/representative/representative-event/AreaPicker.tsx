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
  CommandEmpty,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

// Component chọn khu vực
export const AreaPicker = ({ item, index, update, areas }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="h-9 px-3 w-full rounded-md flex items-center justify-between"
        >
          <span>
            {item.areaId
              ? areas.find((a: any) => a.areaId === item.areaId)?.name
              : "Select Area..."}
          </span>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search area..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {areas.map((area: any) => {
                const isSelected = item.areaId === area.areaId;
                return (
                  <CommandItem
                    key={area.areaId}
                    onSelect={() => {
                      update(index, { ...item, areaId: area.areaId });
                      setOpen(false);
                    }}
                    className="flex items-center"
                  >
                    <div
                      className={`mr-2 flex h-4 w-4 items-center justify-center rounded border ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      }`}
                    >
                      {isSelected && <CheckIcon className="h-4 w-4" />}
                    </div>
                    <span>{area.name}</span>
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
