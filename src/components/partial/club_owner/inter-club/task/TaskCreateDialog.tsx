import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, X, Loader2 } from "lucide-react";
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
import { CreateInterTaskRequest } from "@/models/InterTask";
import { InterTaskSchema, subtaskSchema } from "@/schema/InterTaskSchema";
import useAuth from "@/hooks/useAuth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { InterClubEventDTO } from "@/models/Event";
import { SubtaskDialog } from "./SubtaskDialog";
interface TaskCreateDialogProps {
  onCreateTask: (task: CreateInterTaskRequest) => void;
  eventId: string;
  selectedEvent: InterClubEventDTO | null;
}

export const TaskCreateDialog = ({
  onCreateTask,
  eventId,
  selectedEvent,
}: TaskCreateDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openClubSelect, setOpenClubSelect] = useState(false);
  const [isSubtaskDialogOpen, setIsSubtaskDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof InterTaskSchema>>({
    resolver: zodResolver(InterTaskSchema),
    defaultValues: {
      taskName: "",
      description: "",
      startTime: new Date(),
      deadline: new Date(),
      listEventTaskDetails: [],
      clubId: "",
    },
  });
  console.log(form.formState.errors);

  const onSubmit = async (values: z.infer<typeof InterTaskSchema>) => {
    try {
      setIsSubmitting(true);
      const taskData: CreateInterTaskRequest = {
        ...values,
        eventId,
        createdBy: user?.userId || "",
        clubId: values.clubId || "",
        startTime: values.startTime || new Date(),
        deadline: values.deadline || new Date(),
        listEventTaskDetails: values.listEventTaskDetails.map((detail) => ({
          ...detail,
          startTime: detail.startTime || new Date(),
          deadline: detail.deadline || new Date(),
        })),
      };
      await onCreateTask(taskData);
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSubtask = (subtask: z.infer<typeof subtaskSchema>) => {
    const currentSubtasks = form.getValues("listEventTaskDetails");
    form.setValue("listEventTaskDetails", [...currentSubtasks, subtask]);
  };

  const handleRemoveSubtask = (index: number) => {
    const currentSubtasks = form.getValues("listEventTaskDetails");
    form.setValue(
      "listEventTaskDetails",
      currentSubtasks.filter((_, i) => i !== index)
    );
  };

  if (!selectedEvent) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="custom" className=" hover:bg-[#136CB9]/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#136CB9]">
              Create New Task
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="clubId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
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
                        >
                          <Command>
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
                  name="taskName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter task name" {...field} />
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
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-[#136CB9]">Subtasks</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsSubtaskDialogOpen(true)}
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
                            <p className="font-medium">{subtask.detailName}</p>
                            <p className="text-sm text-gray-500">
                              {subtask.description}
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(subtask.startTime || new Date(), "PPP")} -{" "}
                              {format(subtask.deadline || new Date(), "PPP")}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSubtask(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#136CB9] hover:bg-[#136CB9]/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Task"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <SubtaskDialog
        isOpen={isSubtaskDialogOpen}
        onClose={() => setIsSubtaskDialogOpen(false)}
        onSubmit={handleAddSubtask}
      />
    </>
  );
};
