/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, CalendarIcon, Sparkles } from "lucide-react";
import { format } from "date-fns";

// shadcn/ui & Components
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, fixTime } from "@/lib/utils";

// Lazy import danh sách student
const SpecificStudentList = React.lazy(() => import("./SpecificStudentList"));

import useAuth from "@/hooks/useAuth";
import { Grid2 } from "@mui/material";
import {
  EventTaskDetailSchema,
  TaskEventFormValues,
} from "@/schema/TaskEventSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AvailableMemberEventTask,
  CreateSubTaskAPI,
  EventSubTaskDTO,
  GetAvailableMember,
  TaskRecommendedByAI,
} from "@/api/student/ClubAgent";
import { InterTask } from "@/models/InterTask";

export default function CreateEventTaskClub() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const clubId = location.state?.clubId;
  const task = location.state?.task as InterTask;
  const eventId = location.state?.eventId as string
  const [recommendedStudents, setRecommendedStudents] = useState<AvailableMemberEventTask[]>([]);
  const [recommendedReasons, setRecommendedReasons] = useState<Record<string, string>>({});
  const [allStudents, setAllStudents] = useState<AvailableMemberEventTask[]>(
    []
  );

  // Search & debounce
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredStudents = allStudents.filter((st) =>
    st.fullName.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // React Hook Form
  const form = useForm<TaskEventFormValues>({
    resolver: zodResolver(EventTaskDetailSchema),
    mode: "onChange",
    defaultValues: {
      detailName: "",
      description: "",
      startTimeDate: new Date(),
      deadlineDate: new Date(),
      assignedMembers: [],
      assignAll: false,
    },
  });
  const { handleSubmit, setValue, getValues, watch } = form;
  const assignAll = watch("assignAll");
  const selectedMembers = watch("assignedMembers");

  const startTimeDate = watch("startTimeDate");
  const deadlineTimeDate = watch("deadlineDate");
  const priority = watch("priority");

  useEffect(() => {
    async function fetchMembers() {
      if (!clubId || !startTimeDate || !deadlineTimeDate || !priority) return;

      try {
        const response = await GetAvailableMember(
          clubId,
          format(startTimeDate.toISOString(), "yyyy-MM-dd"),
          format(deadlineTimeDate.toISOString(), "yyyy-MM-dd"),
          priority
        );
        if (response.data) {
          setAllStudents(response.data);
        }
      } catch (error: any) {
        console.error("Failed to fetch club members", error);
      }
    }

    fetchMembers();
  }, [clubId, startTimeDate, deadlineTimeDate, priority]);

  const isReadyToFetch = startTimeDate && deadlineTimeDate && priority;

  // Kết hợp ngày & giờ thành 1 Date final
  const combineDateTime = (dateObj: Date, timeStr: string) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    const newDate = new Date(dateObj);
    newDate.setHours(hour, minute, 0, 0);
    return newDate;
  };

  // Submit form
  const onSubmit = async (values: TaskEventFormValues) => {
    if (!user) return;
    try {
      setIsLoading(true);
      const finalDeadline = combineDateTime(
        values.deadlineDate,
        values.deadlineTime
      );
      const finalStartTime = combineDateTime(
        values.startTimeDate,
        values.startTimeTime
      );

      const assignedMembers =
        assignAll && allStudents.length > 0
          ? allStudents.map((student) => ({
            clubMemberId: student.clubMemberId,
          }))
          : selectedMembers.map((id: string) => {
            const stu = allStudents.find((s) => s.studentId === id);
            return { clubMemberId: stu ? stu.clubMemberId : id };
          });

      const data: EventSubTaskDTO = {
        clubId,
        eventTaskId: task.eventTaskId,
        eventId: eventId,
        taskName: task.taskName,
        description: task.description,
        startTime: task.startTime,
        deadline: task.deadline,
        status: task.status,
        eventTaskDetails: [
          {
            eventTaskId: task.eventTaskId,
            detailName: values.detailName,
            description: values.description,
            startTime: fixTime(finalStartTime).toISOString(),
            deadline: fixTime(finalDeadline).toISOString(),
            status: "ON_GOING",
            priority: values.priority || "LOW",
            assignedMembers,
          },
        ],
      };

      await CreateSubTaskAPI(task.eventTaskId, data);
      toast.success("Task created successfully!");
      window.history.back();
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle chọn sinh viên cụ thể (lưu studentId, sẽ convert sang clubMemberId khi submit)
  const handleToggleStudent = (studentId: string, checked: boolean) => {
    const current = getValues("assignedMembers");
    if (checked) {
      setValue("assignedMembers", [...current, studentId]);
    } else {
      setValue(
        "assignedMembers",
        current.filter((id: string) => id !== studentId)
      );
    }
  };

  // Khi assignAll thay đổi: nếu true, xóa selectedMembers; nếu false, cho phép chọn lại.
  const handleAssignAllChange = (checked: boolean) => {
    setValue("assignAll", checked);
    if (checked) {
      setValue("assignedMembers", []);
    }
  };

  const handleAIRecommend = async () => {
    // if (!form.getValues("startTime") || !form.getValues("endTime")) {
    //   toast.error("Please select start time and deadline first");
    //   return;
    // }

    setIsLoading(true);
    try {
      const body = {
        clubId: "ae57b2f6-8ec2-4d7d-87e3-4e347c52c2f0",
        taskName: "Choose a song to play",
        taskDescription: "Choose a song to play",
        startTime: "2025-04-22T08:55:57.121Z",
        endTime: "2025-04-23T08:55:57.121Z",
        priority: "MEDIUM"
      }

      const response = await TaskRecommendedByAI(body.clubId, body);
      const data = response.data;

      // Update danh sách recommend
      if (data) {
        setRecommendedStudents(data);
      }

      // Lưu lại lý do recommend theo studentId
      const reasonMap: Record<string, string> = {};
      data?.forEach((student) => {
        reasonMap[student.studentId] = student.reason || "";
      });
      setRecommendedReasons(reasonMap);

      // Cập nhật luôn selected members
      const recommendedIds = data?.map((s) => s.studentId);
      form.setValue("assignedMembers", recommendedIds ?? []);
    } catch (error) {
      console.error("Recommendation failed", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const hasErrors = !!Object.keys(form.formState.errors).length;
    if (hasErrors) {
      console.log("🔥 FORM ERRORS:", form.formState.errors);
    }
  }, [form.formState.errors]);


  return (
    <div className="min-h-[300px]">
      {/* Nút Back */}
      <div className="mb-5">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </Button>
          Create Sub Task
        </h2>
        <p className="text-sm text-muted-foreground ml-11">
          Create sub task for your event
        </p>
      </div>

      <div className="p-4 mx-7">
        <Form {...form}>
          <div className="flex justify-center">
            <form onSubmit={handleSubmit((data) => {
              onSubmit(data);
            })}
              className="space-y-6 w-3/4">
              {/* Task Name */}
              <Grid2 container spacing={2}>
                <Grid2 size={6}>
                  <FormField
                    control={form.control}
                    name="detailName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter Task Name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
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
                </Grid2>
              </Grid2>
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        className="border p-2 rounded w-full h-32"
                        {...field}
                        placeholder="Enter task description..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start Time: Date & Time */}
              <div className="flex space-x-4 w-1/3">
                <FormField
                  control={form.control}
                  name="startTimeDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Start Time Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              // setStartDate(date ?? null)
                            }}
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
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input {...field} type="time" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Deadline: Date & Time */}
              <div className="flex space-x-4 w-1/3">
                <FormField
                  control={form.control}
                  name="deadlineDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Deadline Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              // setDeadlineDate(date ?? null)
                            }}
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
                    <FormItem>
                      <FormLabel>Deadline Time</FormLabel>
                      <FormControl>
                        <Input {...field} type="time" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Assign All */}
              <FormField
                control={form.control}
                name="assignAll"
                render={() => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={assignAll}
                        onCheckedChange={handleAssignAllChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Assign all members</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        {assignAll
                          ? "All members in the club will be assigned"
                          : "If checked, all members in the club will be assigned"}
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Specific Students */}
              <FormField
                control={form.control}
                name="assignedMembers"
                render={() => (
                  <FormItem>
                    {!assignAll && (
                      <>
                        <FormLabel>Specific Students</FormLabel>
                        <div className="flex gap-3">
                          {/* Search bar */}
                          <div className="mb-2 w-1/4">
                            <Input
                              placeholder="Search students..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>

                          <Button
                            onClick={handleAIRecommend}
                            type="button"
                            disabled={isLoading}
                            className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
                    px-6 py-2 rounded-lg font-semibold transition-all duration-300 
                    hover:scale-105 hover:shadow-lg group"
                          >
                            <span
                              className="absolute inset-0 before:content-[''] before:absolute before:top-0 before:left-[-75%] 
                      before:w-[50%] before:h-full before:bg-white before:opacity-20 before:rotate-12
                      before:animate-none group-hover:before:animate-shine pointer-events-none"
                            />
                            <span className="relative z-10 flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              {isLoading
                                ? "Is loading..."
                                : "AI Recommendation"}
                            </span>
                          </Button>
                        </div>
                        {!isReadyToFetch ? (
                          <div className="text-sm text-red-500 italic">
                            After selecting the Start Date, Deadline, and Privacy, a list of available students will be displayed.
                          </div>
                        ) : (
                          <Suspense fallback={<div>Loading students...</div>}>
                            <SpecificStudentList
                              students={filteredStudents}
                              isAssignAll={assignAll}
                              selected={selectedMembers}
                              handleToggleStudent={handleToggleStudent}
                              recommendedStudents={recommendedStudents}
                              recommendedReasons={recommendedReasons}
                            />
                          </Suspense>
                        )}

                        <FormMessage />

                        <div className="mt-3">
                          <p className="text-sm font-semibold">
                            Selected Students:
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedMembers &&
                              selectedMembers.length === 0 && (
                                <span className="text-sm text-muted-foreground">
                                  No students selected.
                                </span>
                              )}
                            {selectedMembers &&
                              selectedMembers.map((id) => {
                                const st = allStudents.find(
                                  (s) => s.studentId === id
                                );
                                if (!st) return null;
                                return (
                                  <span
                                    key={id}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                                  >
                                    {st.fullName} - {st.email}
                                  </span>
                                );
                              })}
                          </div>
                        </div>
                      </>
                    )}
                  </FormItem>
                )}
              />

              {/* Submit */}
              <div className="flex justify-end mt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </form>
          </div>
        </Form>
      </div>
    </div>
  );
}
