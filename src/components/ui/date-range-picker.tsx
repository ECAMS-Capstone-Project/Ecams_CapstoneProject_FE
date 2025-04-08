import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  const handleFromDateChange = (date: Date | undefined) => {
    onDateRangeChange({
      from: date,
      to: dateRange?.to,
    });
  };

  const handleToDateChange = (date: Date | undefined) => {
    onDateRangeChange({
      from: dateRange?.from,
      to: date,
    });
  };

  return (
    <div className={cn("grid gap-2")}>
      <div className="flex gap-4">
        {(dateRange?.from || dateRange?.to) && (
          <Button
            variant={"outline"}
            onClick={() => onDateRangeChange(undefined)}
          >
            Clear filters
          </Button>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="from-date"
              variant={"outline"}
              className={cn(
                "w-[150px] justify-start text-left font-normal",
                !dateRange?.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                format(dateRange.from, "LLL dd, y")
              ) : (
                <span>From</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="single"
              selected={dateRange?.from}
              onSelect={handleFromDateChange}
              disabled={(date) => (dateRange?.to ? date > dateRange.to : false)}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="to-date"
              variant={"outline"}
              className={cn(
                "w-[150px] justify-start text-left font-normal",
                !dateRange?.to && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.to ? (
                format(dateRange.to, "LLL dd, y")
              ) : (
                <span>To</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="single"
              selected={dateRange?.to}
              onSelect={handleToDateChange}
              disabled={(date) =>
                dateRange?.from ? date < dateRange.from : false
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
