import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { InterTask, UpdateInterTaskRequest2 } from "@/models/InterTask";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, fixTime } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { InterClubEventDTO } from "@/models/Event";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { EventTaskSchema } from "@/schema/EventTaskSchema";
import toast from "react-hot-toast";

interface TaskEditDialogProps {
  task: InterTask;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    taskId: string,
    data: Partial<UpdateInterTaskRequest2>
  ) => Promise<void>;
  isHost?: boolean;
  isLoading?: boolean;
  selectedEvent: InterClubEventDTO;
}

export const TaskBigEditDialog = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  isLoading,
  selectedEvent,
}: TaskEditDialogProps) => {
  const [openClubSelect, setOpenClubSelect] = useState(false);

  const form = useForm<z.infer<typeof EventTaskSchema>>({
    resolver: zodResolver(EventTaskSchema),
    defaultValues: {
      taskName: task.taskName,
      description: task.description,
      startTime: new Date(task.startTime),
      deadline: new Date(task.deadline),
      deadlineTime: format(new Date(task.deadline), "HH:mm"),
      startTimeTime: format(new Date(task.startTime), "HH:mm"),
      status: task.status,
      clubId: task.clubId,
    },
  });

  const combineDateTime = (dateObj: Date, timeStr: string) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    const newDate = new Date(dateObj);
    newDate.setHours(hour, minute, 0, 0);
    return newDate;
  };

  const onSubmit = async (values: z.infer<typeof EventTaskSchema>) => {
    try {
      const finalDeadline = combineDateTime(
        values.deadline,
        values.deadlineTime
      );
      const finalStartTime = combineDateTime(
        values.startTime,
        values.startTimeTime
      );
      const updateData: UpdateInterTaskRequest2 = {
        eventTaskId: task.eventTaskId,
        clubId: values.clubId || task.clubId,
        eventId: selectedEvent.eventId,
        taskName: values.taskName,
        description: values.description,
        startTime: fixTime(finalStartTime).toISOString(),
        deadline: fixTime(finalDeadline).toISOString(),
        status: task.status,
      };

      await onUpdate(task.eventTaskId, updateData);
      onClose();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl ">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#136CB9]">
              Edit Task
            </DialogTitle>
            <DialogDescription>Edit the task details below</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.error("Zod validation errors:", errors);
                toast.error("Check your detail time in sub task");
              })}
              className="space-y-6"
            >
              <div className="space-y-4 h-[300px)] p-2 overflow-y-auto">
                <FormField
                  control={form.control}
                  name="taskName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter task name"
                          {...field}
                          disabled={task.status === "ON_GOING"}
                        />
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
                          placeholder="Enter task description"
                          className="resize-none"
                          rows={5}
                          {...field}
                          disabled={task.status === "ON_GOING"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex gap-4">
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
                                  disabled={task.status === "ON_GOING"}
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
                            <PopoverContent
                              className="w-auto p-0 mb-0 pb-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
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
                      name="startTimeTime"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              disabled={task.status === "ON_GOING"}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4">
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
                            <PopoverContent
                              className="w-auto p-0 mb-0 pb-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const startDate = form.watch("startTime");
                                  return startDate ? date < new Date(startDate.setHours(0, 0, 0, 0)) : date < new Date();
                                }}
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
                      name="deadlineTime"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clubId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Club Assign</FormLabel>
                        <Popover open={openClubSelect}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                disabled={task.status === "ON_GOING"}
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? selectedEvent.clubs.find(
                                    (club) => club.clubId === field.value
                                  )?.clubName
                                  : "Select club"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[calc(var(--radix-popover-trigger-width)*0.75)] p-0"
                            align="start"
                            sideOffset={4}
                          >
                            <Command className="w-full">
                              <CommandInput placeholder="Search club..." />
                              <CommandEmpty>No club found.</CommandEmpty>
                              <CommandGroup>
                                {selectedEvent.clubs.map((club) => (
                                  <CommandItem
                                    value={club.clubId}
                                    key={club.clubId}
                                    onSelect={() => {
                                      form.setValue("clubId", club.clubId);
                                      setOpenClubSelect(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === club.clubId
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {club.clubName}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#136CB9] hover:bg-[#136CB9]/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Task"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
