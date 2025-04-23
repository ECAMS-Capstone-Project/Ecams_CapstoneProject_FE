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
import { InterTask, UpdateInterTaskRequest } from "@/models/InterTask";
import { InterTaskSchema } from "@/schema/InterTaskSchema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, combineDateTime } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterClubEventDTO } from "@/models/Event";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { EventClubDTO } from "@/api/representative/EventAgent";

interface TaskEditDialogProps {
  task: InterTask;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    taskId: string,
    data: Partial<UpdateInterTaskRequest>
  ) => Promise<void>;
  isHost?: boolean;
  isLoading?: boolean;
  selectedEvent: InterClubEventDTO;
  currentClub: EventClubDTO;
}

// Thêm 7 giờ vào mọi timestamp
function fixTime(date: Date) {
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 7);
  return adjustedDate;
}

export const TaskEditDialog = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  isHost,
  isLoading,
  selectedEvent,
  currentClub,
}: TaskEditDialogProps) => {
  const [openClubSelect, setOpenClubSelect] = useState(false);
  // const timeZone = "Asia/Ho_Chi_Minh";
  const form = useForm<z.infer<typeof InterTaskSchema>>({
    resolver: zodResolver(InterTaskSchema),
    defaultValues: {
      taskName: task.taskName,
      description: task.description,
      startTime: fixTime(new Date(task.startTime)),
      startTimeTime: new Date(task.startTime).toTimeString().slice(0, 5),
      deadline: fixTime(new Date(task.deadline)),
      deadlineTime: new Date(task.deadline).toTimeString().slice(0, 5),
      status: task.status,
      clubId: task.clubId,
      listEventTaskDetails: task.eventTaskDetails.map((detail) => ({
        detailName: detail.detailName,
        description: detail.description,
        startTime: fixTime(new Date(detail.startTime)),
        deadline: fixTime(new Date(detail.deadline)),
        status: detail.status,
        priority: detail.priority,
      })),
    },
  });

  const onSubmit = async (values: z.infer<typeof InterTaskSchema>) => {
    try {
      // Tách các subtask thành hai loại: đã tồn tại và mới
      const existingSubtasks = values.listEventTaskDetails
        .slice(0, task.eventTaskDetails.length)
        .map((detail, index) => ({
          eventTaskDetailId: task.eventTaskDetails[index].eventTaskDetailId,
          eventTaskId: task.eventTaskId,
          detailName: detail.detailName,
          description: detail.description,
          startTime: fixTime(
            new Date(
              values.listEventTaskDetails[index].startTime ||
                task.eventTaskDetails[index].startTime
            )
          ),
          deadline: fixTime(
            new Date(
              values.listEventTaskDetails[index].deadline ||
                task.eventTaskDetails[index].deadline
            )
          ),
          status: detail.status || task.eventTaskDetails[index].status,
          priority: detail.priority || task.eventTaskDetails[index].priority,
          assignedMembers: task.eventTaskDetails[index].assignedMembers || [],
        }));

      // Xử lý các subtask mới (không có eventTaskDetailId)
      const newSubtasks = values.listEventTaskDetails
        .slice(task.eventTaskDetails.length)
        .map((detail) => ({
          eventTaskId: task.eventTaskId,
          detailName: detail.detailName,
          description: detail.description,
          startTime: fixTime(new Date(detail.startTime || task.startTime)),
          deadline: fixTime(new Date(detail.deadline || task.deadline)),
          status: detail.status || "ON_GOING",
          priority: detail.priority,
          assignedMembers: [],
        }));
      const finalStartTime = combineDateTime(
        values.startTime,
        values.startTimeTime || "00:00"
      );
      const finalDeadline = combineDateTime(
        values.deadline,
        values.deadlineTime || "00:00"
      );
      const updateData: UpdateInterTaskRequest = {
        eventTaskId: task.eventTaskId,
        clubId: values.clubId || task.clubId,
        eventId: selectedEvent.eventId,
        taskName: values.taskName,
        description: values.description,
        startTime: fixTime(finalStartTime),
        deadline: fixTime(finalDeadline),
        status: values.status || task.status || "ON_GOING", // Thêm giá trị mặc định để tránh undefined
        eventTaskDetails: [...existingSubtasks, ...newSubtasks],
      };

      await onUpdate(task.eventTaskId, updateData);
      onClose();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  // const handleEditSubtask = (index: number) => {
  //   const currentSubtask = form.getValues("listEventTaskDetails")[index];
  //   const subtaskToEdit = {
  //     detailName: currentSubtask.detailName,
  //     description: currentSubtask.description,
  //     startTime: fixTime(currentSubtask.startTime || new Date()),
  //     deadline: fixTime(currentSubtask.deadline || new Date()),
  //     status: currentSubtask.status || "ON_GOING",
  //     priority: currentSubtask.priority || "MEDIUM",
  //   };

  //   setEditingSubtask(subtaskToEdit);
  //   setEditingSubtaskIndex(index);
  //   setIsSubtaskDialogOpen(true);
  // };

  // const handleAddSubtask = (data: {
  //   detailName: string;
  //   description: string;
  //   startTime: Date;
  //   deadline: Date;
  //   status: string;
  //   priority: string;
  // }) => {
  //   const currentSubtasks = form.getValues("listEventTaskDetails");
  //   console.log("Adding/Editing subtask:", data);

  //   if (editingSubtaskIndex !== null) {
  //     // Đang edit subtask
  //     const updatedSubtasks = [...currentSubtasks];
  //     updatedSubtasks[editingSubtaskIndex] = data;
  //     form.setValue("listEventTaskDetails", updatedSubtasks);
  //     setEditingSubtaskIndex(null);
  //   } else {
  //     // Thêm subtask mới
  //     form.setValue("listEventTaskDetails", [...currentSubtasks, data]);
  //   }
  //   setIsSubtaskDialogOpen(false);
  // };

  // const handleCloseSubtaskDialog = () => {
  //   setIsSubtaskDialogOpen(false);
  //   setEditingSubtaskIndex(null);
  //   setEditingSubtask(null);
  // };

  // const handleRemoveSubtask = (index: number) => {
  //   const currentSubtasks = form.getValues("listEventTaskDetails");
  //   form.setValue(
  //     "listEventTaskDetails",
  //     currentSubtasks.filter((_, i) => i !== index)
  //   );
  // };

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4 h-[calc(100vh-500px)] overflow-y-auto">
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
                          disabled={!isHost}
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
                          {...field}
                          disabled={!isHost}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-4 gap-2">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  " text-left font-normal",
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
                    name="startTimeTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input {...field} type="time" />
                        </FormControl>
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
                                  " text-left font-normal",
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
                    name="deadlineTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input {...field} type="time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clubId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign to Club</FormLabel>
                        <Popover
                          open={openClubSelect}
                          onOpenChange={setOpenClubSelect}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={!isHost}
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

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={currentClub.clubId !== task.clubId}
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
                </div>

                {/* {isHost && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-[#136CB9]">Subtasks</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingSubtask(null);
                          setEditingSubtaskIndex(null);
                          setIsSubtaskDialogOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subtask
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {form
                        .watch("listEventTaskDetails")
                        .map((subtask, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gradient-to-r from-[#49BBBD]/5 to-[#136CB9]/5 rounded-lg border border-[#49BBBD]/20"
                          >
                            <div>
                              <p className="font-medium">
                                {subtask.detailName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {subtask.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                {subtask.startTime &&
                                subtask.deadline &&
                                subtask.startTime !== subtask.deadline
                                  ? `${format(
                                      subtask.startTime,
                                      "PPP"
                                    )} - ${format(subtask.deadline, "PPP")}`
                                  : "No date"}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditSubtask(index)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveSubtask(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                 {!isHost && currentClub.clubId === task.clubId && (
                  <div className="space-y-4 h-[calc(100vh-600px)] overflow-y-auto">
                    <h4 className="font-medium text-[#136CB9]">Subtasks</h4>
                    <div className="space-y-2">
                      {form
                        .watch("listEventTaskDetails")
                        .map((subtask, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gradient-to-r from-[#49BBBD]/5 to-[#136CB9]/5 rounded-lg border border-[#49BBBD]/20"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">
                                  {subtask.detailName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {subtask.description}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {subtask.startTime &&
                                  subtask.deadline &&
                                  subtask.startTime !== subtask.deadline
                                    ? `${format(
                                        subtask.startTime,
                                        "PPP"
                                      )} - ${format(subtask.deadline, "PPP")}`
                                    : "No date"}
                                </p>
                              </div>
                              <div className="w-32">
                                <FormField
                                  control={form.control}
                                  name={`listEventTaskDetails.${index}.status`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={
                                          currentClub.clubId !== task.clubId
                                        }
                                      >
                                        <FormControl>
                                          <SelectTrigger className="h-8">
                                            <SelectValue placeholder="Status" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="ON_GOING">
                                            On Going
                                          </SelectItem>
                                          <SelectItem value="COMPLETED">
                                            Completed
                                          </SelectItem>
                                          <SelectItem value="REVIEWING">
                                            Reviewing
                                          </SelectItem>
                                          <SelectItem value="OVERDUE">
                                            Overdue
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}  */}
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

      {/* <SubtaskDialog
        isOpen={isSubtaskDialogOpen}
        onClose={handleCloseSubtaskDialog}
        onSubmit={handleAddSubtask}
        initialValues={editingSubtask || undefined}
        mainTaskStartTime={form.getValues("startTime")}
        mainTaskDeadline={form.getValues("deadline")}
      /> */}
    </>
  );
};
