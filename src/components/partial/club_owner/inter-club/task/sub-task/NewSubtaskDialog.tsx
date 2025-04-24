/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { CalendarIcon, Sparkles, Eye, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, fixTime, fixTime2 } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClubMemberDTO } from "@/api/club-owner/ClubByUser";
import {
  AvailableMember,
  InterTask,
  TaskDependencyResponseDTO,
} from "@/models/InterTask";
import { EventClubDTO } from "@/api/representative/EventAgent";
import { useInterTask } from "@/hooks/club/useInterTask";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { GetAIRecommendation } from "@/api/club-owner/InterEventTask";
import "@/styles/datetime-picker.css";
import { MemberInfoDialog } from "../MemberInfoDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { newSubtaskSchema } from "@/schema/InterTaskSchema";
import { isArray } from "lodash";

const subtaskSchema = z
  .object({
    detailName: z.string().min(1, "Subtask name is required"),
    description: z.string().min(1, "Description is required"),
    startTime: z.date(),
    startTimeTime: z.string().min(1, "Start time is required"),
    deadline: z.date(),
    deadlineTime: z.string().min(1, "Deadline time is required"),
    status: z.string(),
    priority: z.string().min(1, "Priority is required"),
    assignedMemberIds: z.array(z.string()).optional(),
    taskDependencyIds: z.array(z.string()).optional(),
    isDependencyExtended: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.deadline) {
      const finalStartTime = combineDateTime(
        data.startTime,
        data.startTimeTime
      );
      const finalDeadline = combineDateTime(data.deadline, data.deadlineTime);

      if (finalStartTime > finalDeadline) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start time must be before deadline",
          path: ["deadline"],
        });
      }
    }
  });

// Helper function to combine date and time
const combineDateTime = (dateObj: Date, timeStr: string) => {
  const [hours, minutes] = timeStr.split(":").map(Number);

  // Tạo date mới và set giờ phút
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const date = dateObj.getDate();

  // Tạo date với timezone local
  const newDate = new Date(year, month, date, hours, minutes, 0);

  return newDate;
};

interface SubtaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<z.infer<typeof subtaskSchema>, "startTime" | "deadline"> & {
      startTime: Date;
      deadline: Date;
    }
  ) => void;
  initialValues?: {
    detailName: string;
    description: string;
    startTime: Date;
    startTimeTime: string;
    deadline: Date;
    deadlineTime: string;
    status?: string;
    priority: string;
  };
  members: ClubMemberDTO[];
  currentClub: EventClubDTO;
  task: InterTask;
}

export const NewSubtaskDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  currentClub,
  members,
  task,
}: SubtaskDialogProps) => {
  const [, setShowAIRecommendations] = useState(false);
  const [aiRecommendations, setAIRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedMember, setSelectedMember] = useState<
    AvailableMember | ClubMemberDTO | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues]);

  const form = useForm<z.infer<typeof newSubtaskSchema>>({
    resolver: zodResolver(newSubtaskSchema),
    mode: "onChange",
    defaultValues: initialValues
      ? initialValues
      : {
          detailName: "",
          description: "",
          startTime: new Date(),
          startTimeTime: "00:00",
          deadline: new Date(),
          deadlineTime: "00:00",
          status: "NOT_STARTED",
          priority: "MEDIUM",
          assignedMemberIds: [],
          taskDependencyIds: [],
        },
  });

  console.log("form.formState.errors", form.formState.errors);

  const handleSubmit = (values: z.infer<typeof newSubtaskSchema>) => {
    // Combine date and time
    const startTime = values.startTimeTime
      ? combineDateTime(values.startTime, values.startTimeTime)
      : values.startTime;
    const deadline = values.deadlineTime
      ? combineDateTime(values.deadline, values.deadlineTime)
      : values.deadline;

    // Tạo subtask mới với assignedMembers đúng format và thời gian đã combine
    const newSubtask = {
      ...values,
      startTime: fixTime2(startTime),
      deadline: fixTime2(deadline),
      assignedMemberIds: values.assignedMemberIds || [],
      taskDependencyIds: values.taskDependencyIds || [],
    };

    try {
      onSubmit(newSubtask);
    } catch (error) {
      // Giữ dialog mở khi có lỗi
      console.error("Error submitting subtask:", error);
    }
  };
  const { getAvailableMemberQuery, getSubtaskDependencyQuery } = useInterTask();

  const { data: avaiMembers } = getAvailableMemberQuery(
    currentClub.clubId,
    fixTime(form.getValues("startTime")).toISOString(),
    fixTime(form.getValues("deadline")).toISOString(),
    form.getValues("priority")
  );
  const availableMembers = (avaiMembers?.data ?? []) as AvailableMember[];

  const { data: subtaskDependency } = getSubtaskDependencyQuery(
    task.eventTaskId,
    fixTime(
      combineDateTime(
        form.getValues("startTime"),
        form.getValues("startTimeTime")
      )
    ).toISOString(),
    fixTime(
      combineDateTime(
        form.getValues("deadline"),
        form.getValues("deadlineTime")
      )
    ).toISOString(),
    form.getValues("priority")
  );

  const getMemberRecommendation = (memberId: string) => {
    return aiRecommendations.find((rec) => rec.clubMemberId === memberId);
  };

  const filteredSubtaskDependency =
    subtaskDependency?.data && Array.isArray(subtaskDependency.data)
      ? subtaskDependency.data.filter((subtask: any) => {
          const searchStr = searchQuery.toLowerCase();
          const name = subtask.detailName.toLowerCase();
          return name.includes(searchStr);
        })
      : [];

  // Thêm hàm filter members
  const filteredMembers = (
    availableMembers
      ? availableMembers.map((member) => {
          const recommendation = aiRecommendations.find(
            (rec) => rec.clubMemberId === member.clubMemberId
          );
          return {
            ...member,
            isRecommended: !!recommendation,
            recommendationDetails: recommendation,
          };
        })
      : members
  ).filter((member: AvailableMember | ClubMemberDTO) => {
    const searchStr = searchQuery.toLowerCase();
    const name = (
      (member as AvailableMember).fullName ||
      (member as ClubMemberDTO).fullname ||
      ""
    ).toLowerCase();
    return name.includes(searchStr);
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl ">
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="">
            <ScrollArea className="h-[70vh] rounded-md">
              <div className="space-y-4 px-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
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
                        <FormLabel>Deadline Date</FormLabel>
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

                {initialValues && (
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
                )}

                <FormField
                  control={form.control}
                  name="taskDependencyIds"
                  render={() => (
                    <FormItem className="space-y-4">
                      <FormLabel>Task Dependencies</FormLabel>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search task..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-9 bg-gray-50 border-gray-200"
                            />
                          </div>
                        </div>
                        {isArray(subtaskDependency?.data) &&
                          subtaskDependency?.data.length == 0 && (
                            <div className="p-4 space-y-2">
                              <p>No task dependencies found</p>
                            </div>
                          )}
                        {isArray(subtaskDependency?.data) &&
                          subtaskDependency?.data.length > 0 && (
                            <ScrollArea className="h-[150px] rounded-md border">
                              <div className="p-4 space-y-2">
                                {filteredSubtaskDependency.map(
                                  (dependency: TaskDependencyResponseDTO) => (
                                    <div
                                      key={dependency.eventTaskDetailId}
                                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        <Checkbox
                                          id={dependency.eventTaskDetailId}
                                          checked={form
                                            .getValues("taskDependencyIds")
                                            ?.some(
                                              (m) =>
                                                m ===
                                                dependency.eventTaskDetailId
                                            )}
                                          onCheckedChange={(checked) => {
                                            const newValue =
                                              form.getValues(
                                                "taskDependencyIds"
                                              ) || [];
                                            if (checked) {
                                              form.setValue(
                                                "taskDependencyIds",
                                                [
                                                  ...newValue,
                                                  dependency.eventTaskDetailId,
                                                ]
                                              );
                                            } else {
                                              form.setValue(
                                                "taskDependencyIds",
                                                newValue.filter(
                                                  (m) =>
                                                    m !==
                                                    dependency.eventTaskDetailId
                                                )
                                              );
                                            }
                                          }}
                                        />
                                        <label
                                          htmlFor={dependency.eventTaskDetailId}
                                          className="flex items-center gap-2 cursor-pointer text-sm"
                                        >
                                          <span className="font-medium">
                                            {dependency.detailName}
                                          </span>
                                        </label>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </ScrollArea>
                          )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assignedMemberIds"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel>Assigned Member</FormLabel>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search members..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-9 bg-gray-50 border-gray-200"
                            />
                          </div>
                          <a
                            className="click-btn btn-style501 px-3 w-fit m-0 whitespace-nowrap"
                            onClick={async () => {
                              try {
                                setIsLoading(true);
                                const response = await GetAIRecommendation(
                                  {
                                    taskName: form.getValues("detailName"),
                                    taskDescription:
                                      form.getValues("description"),
                                    startTime: fixTime(
                                      form.getValues("startTime")
                                    ).toISOString(),
                                    endTime: fixTime(
                                      form.getValues("deadline")
                                    ).toISOString(),
                                    priority: form.getValues("priority"),
                                    clubId: currentClub.clubId,
                                    taskId: "",
                                  },
                                  currentClub.clubId
                                );
                                if (response.data) {
                                  setAIRecommendations(response.data);
                                  setShowAIRecommendations(true);
                                  form.setValue("assignedMemberIds", []);
                                } else {
                                  toast.error(response.message);
                                }
                              } catch (error: any) {
                                toast.error(error.response.data.message);
                              } finally {
                                setIsLoading(false);
                              }
                            }}
                          >
                            <span className="relative z-10 flex items-center gap-1">
                              <Sparkles className="h-4 w-4" />
                              {isLoading ? "Loading..." : "AI Recommendation"}
                            </span>
                          </a>
                        </div>

                        {/* {showAIRecommendations && (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              setShowAIRecommendations(false);
                            }}
                          >
                            Back to All Members
                          </Button>
                        )} */}

                        <ScrollArea className="h-[150px] rounded-md border">
                          <div className="p-4 space-y-2">
                            {filteredMembers.map((member) => (
                              <div
                                key={member.clubMemberId}
                                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    id={member.clubMemberId}
                                    checked={field.value?.some(
                                      (m) => m === member.clubMemberId
                                    )}
                                    onCheckedChange={(checked) => {
                                      const newValue = field.value || [];
                                      if (checked) {
                                        form.setValue("assignedMemberIds", [
                                          ...newValue,
                                          member.clubMemberId,
                                        ]);
                                      } else {
                                        form.setValue(
                                          "assignedMemberIds",
                                          newValue.filter(
                                            (m) => m !== member.clubMemberId
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={member.clubMemberId}
                                    className="flex items-center gap-2 cursor-pointer text-sm"
                                  >
                                    <span className="font-medium">
                                      {(member as AvailableMember).fullName ||
                                        (member as ClubMemberDTO).fullname}
                                    </span>
                                    <div className="flex gap-1">
                                      <Badge
                                        variant="outline"
                                        className="bg-green-50 text-green-700 border-green-200"
                                      >
                                        Available
                                      </Badge>
                                      {(member as any).isRecommended && (
                                        <Badge
                                          variant="outline"
                                          className="bg-indigo-50 text-indigo-700 border-indigo-200"
                                        >
                                          Recommended
                                        </Badge>
                                      )}
                                    </div>
                                  </label>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  type="button"
                                  className="h-8 w-8 hover:bg-gray-100"
                                  onClick={() => setSelectedMember(member)}
                                >
                                  <Eye className="h-4 w-4 text-gray-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
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

      {selectedMember && (
        <MemberInfoDialog
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          member={selectedMember as AvailableMember}
          recommendation={getMemberRecommendation(selectedMember.clubMemberId)}
        />
      )}
    </Dialog>
  );
};
