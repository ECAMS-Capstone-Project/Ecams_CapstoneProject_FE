/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

const subtaskSchema = z
  .object({
    detailName: z.string().min(1, "Subtask name is required"),
    description: z.string().min(1, "Description is required"),
    startTime: z.date(),
    startTimeTime: z.string().min(1, "Please select a time"),
    deadlineTime: z.string().min(1, "Please select a time"),
    deadline: z.date(),
    status: z.string(),
    priority: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.deadline) {
      if (data.startTime > data.deadline) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start time must be before deadline",
          path: ["deadline"], // gán vào deadline
        });
      }
    }
  });
interface SubtaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: z.infer<typeof subtaskSchema>,
    startTimeTime: string,
    deadlineTime: string
  ) => void;
  initialValues?: {
    detailName: string;
    description: string;
    startTime: Date;
    deadline: Date;
    status?: string;
    startTimeTime: string;
    deadlineTime: string;
    priority: string;
  };
  mainTaskStartTime: Date;
  mainTaskDeadline: Date;
}

export const SubtaskDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  mainTaskStartTime,
  mainTaskDeadline,
}: SubtaskDialogProps) => {
  useEffect(() => {
    form.reset(
      initialValues ?? {
        detailName: "",
        description: "",
        startTime: new Date(),
        deadline: new Date(),
        startTimeTime: "",
        deadlineTime: "",
        status: "ON_GOING",
        priority: "LOW",
      }
    );
  }, [initialValues]);
  const form = useForm<z.infer<typeof subtaskSchema>>({
    resolver: zodResolver(subtaskSchema),
    mode: "onChange",
    defaultValues: initialValues
      ? initialValues
      : {
          detailName: "",
          description: "",
          startTime: new Date(),
          deadline: new Date(),
          status: "ON_GOING",
          priority: "LOW",
        },
  });
  const combineDateTime = (dateObj: Date, timeStr: string) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    const newDate = new Date(dateObj);
    newDate.setHours(hour, minute, 0, 0);
    return newDate;
  };
  const handleSubmit = (values: z.infer<typeof subtaskSchema>) => {
    const finalDeadline = combineDateTime(values.deadline, values.deadlineTime);
    const finalStartTime = combineDateTime(
      values.startTime,
      values.startTimeTime
    );
    if (
      finalStartTime < mainTaskStartTime ||
      finalDeadline > mainTaskDeadline
    ) {
      console.log(finalStartTime, mainTaskStartTime);
      console.log(finalDeadline, mainTaskDeadline);
      toast.error(
        "Subtask's start time must be before the main task start time and deadline must be before the main task deadline"
      );
      return;
    }

    onSubmit(values, values.startTimeTime, values.deadlineTime);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#136CB9]">
            {initialValues ? "Edit Subtask" : "Add Subtask"}
          </DialogTitle>
          <DialogDescription>
            {initialValues
              ? "Edit the subtask details below"
              : "Add a new subtask to the task"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="detailName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtask Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subtask name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter subtask description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTimeTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadlineTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // setPriority(value as any)
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* {initialValues?.status != "COMPLETED" && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ON_GOING">On Going</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="REVIEWING">Reviewing</SelectItem>
                        <SelectItem value="OVERDUE">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )} */}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#136CB9] hover:bg-[#136CB9]/90"
              >
                {initialValues ? "Update Subtask" : "Add Subtask"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
