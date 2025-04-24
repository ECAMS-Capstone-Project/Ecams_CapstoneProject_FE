/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, CalendarIcon, Sparkles } from "lucide-react";
import { format } from "date-fns";

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
import { cn, fixTime } from "@/lib/utils";

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
  EventSubTaskDetail,
  GetAvailableMember,
  GetAvailableTask,
  TaskRecommendedByAI,
} from "@/api/student/ClubAgent";
import { InterTask } from "@/models/InterTask";
import SpecificTaskList, {
  TaskDependencyResponseDTO,
} from "./SpecificTasktList";
import SpecificStudentList from "./SpecificStudentList";

export default function CreateEventTaskClub() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const clubId = location.state?.clubId;
  const task = location.state?.task as InterTask;
  const [recommendedStudents, setRecommendedStudents] = useState<
    AvailableMemberEventTask[]
  >([]);
  const [recommendedReasons, setRecommendedReasons] = useState<
    Record<string, string>
  >({});
  const [allStudents, setAllStudents] = useState<AvailableMemberEventTask[]>(
    []
  );
  const [allTasks, setAllTasks] = useState<TaskDependencyResponseDTO[]>([]);

  // Search & debounce
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [debouncedSearch2, setDebouncedSearch2] = useState(searchTerm2);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch2(searchTerm2), 500);
    return () => clearTimeout(timer);
  }, [searchTerm2]);

  const filteredStudents = allStudents.filter((st) =>
    st.fullName.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
  );

  const filteredTasks = allTasks.filter((st) =>
    st.detailName.toLowerCase().includes(debouncedSearch2.trim().toLowerCase())
  );

  const form = useForm<TaskEventFormValues>({
    resolver: zodResolver(EventTaskDetailSchema),
    mode: "onChange",
    defaultValues: {
      detailName: "",
      description: "",
      startTimeDate: new Date(),
      deadlineDate: new Date(),
      assignedMembers: [],
      taskDependencyIds: [],
    },
  });
  const { handleSubmit, setValue, getValues, watch } = form;
  const selectedMembers = watch("assignedMembers");
  const selectedTasks = watch("taskDependencyIds");

  const startTimeDate = watch("startTimeDate");
  const deadlineTimeDate = watch("deadlineDate");
  const taskName = watch("detailName");
  const taskDescription = watch("description");
  const priority = watch("priority");

  useEffect(() => {
    async function fetchData() {
      if (!clubId || !startTimeDate || !deadlineTimeDate || !priority) return;

      try {
        const formattedStart = format(
          startTimeDate.toISOString(),
          "yyyy-MM-dd"
        );
        const formattedDeadline = format(
          deadlineTimeDate.toISOString(),
          "yyyy-MM-dd"
        );

        const [membersRes, tasksRes] = await Promise.all([
          GetAvailableMember(
            clubId,
            formattedStart,
            formattedDeadline,
            priority
          ),
          GetAvailableTask(
            task.eventTaskId,
            formattedStart,
            formattedDeadline,
            priority
          ),
        ]);

        if (membersRes.data) {
          setAllStudents(membersRes.data);
        }

        if (tasksRes.data) {
          setAllTasks(tasksRes.data);
        }
      } catch (error: any) {
        console.error("Failed to fetch data", error);
      }
    }

    fetchData();
  }, [clubId, startTimeDate, deadlineTimeDate, priority, task.eventTaskId]);

  const isReadyToFetch = startTimeDate && deadlineTimeDate && priority;

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

      const assignedMembers = selectedMembers.map((id: string) => {
        const stu = allStudents.find((s) => s.studentId === id);
        return stu ? stu.clubMemberId : id;
      });

      const taskDependencyIds = selectedTasks.map((id: string) => {
        const eventTask = allTasks.find((s) => s.eventTaskDetailId === id);
        return eventTask ? eventTask.eventTaskDetailId : id;
      });

      const data: EventSubTaskDetail = {
        eventTaskId: task.eventTaskId,
        detailName: values.detailName,
        description: values.description,
        startTime: fixTime(finalStartTime).toISOString(),
        deadline: fixTime(finalDeadline).toISOString(),
        priority: values.priority || "LOW",
        assignedMemberIds: assignedMembers,
        taskDependencyIds,
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

  const handleToggleTask = (taskId: string, checked: boolean) => {
    const current = getValues("assignedMembers");
    if (checked) {
      setValue("taskDependencyIds", [...current, taskId]);
    } else {
      setValue(
        "taskDependencyIds",
        current.filter((id: string) => id !== taskId)
      );
    }
  };

  const handleAIRecommend = async () => {
    setIsLoading2(true);
    try {
      const body = {
        clubId: clubId as string,
        taskName: taskName.trim().toString(),
        taskDescription: taskDescription.trim().toString(),
        startTime: startTimeDate.toISOString(),
        endTime: deadlineTimeDate.toISOString(),
        priority: priority,
      };

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
      // const recommendedIds = data?.map((s) => s.studentId);
      // form.setValue("assignedMembers", recommendedIds ?? []);
    } catch (error) {
      console.error("Recommendation failed", error);
    } finally {
      setIsLoading2(false);
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
            <form
              onSubmit={handleSubmit((data) => {
                onSubmit(data);
              })}
              className="space-y-6 w-3/4"
            >
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
              <div className="grid grid-cols-2 gap-2">
                {/* Start Time: Date & Time */}
                <div className="flex space-x-4">
                  <div style={{ width: "50%" }}>
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                  </div>
                  <div style={{ width: "50%" }}>
                    <FormField
                      control={form.control}
                      name="startTimeTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl className="w-full">
                            <input
                              className="w-full h-9 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background 
             placeholder:text-muted-foreground focus-visible:outline-none 
             focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              {...field}
                              type="time"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Deadline: Date & Time */}
                <div className="flex space-x-4">
                  <div style={{ width: "50%" }}>
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                  </div>
                  <div style={{ width: "50%" }}>
                    <FormField
                      control={form.control}
                      name="deadlineTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl className="w-full">
                            <input
                              className="w-full h-9 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background 
             placeholder:text-muted-foreground focus-visible:outline-none 
             focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              {...field}
                              type="time"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <>
                <label className="block text-sm font-medium mb-2">
                  Task list
                </label>
                <div className="flex gap-3">
                  <div className="mb-1 w-1/4">
                    <Input
                      placeholder="Search task"
                      value={searchTerm2}
                      onChange={(e) => setSearchTerm2(e.target.value)}
                    />
                  </div>
                </div>
                <Suspense fallback={<div>Loading task...</div>}>
                  <SpecificTaskList
                    handleToggleTask={handleToggleTask}
                    tasks={filteredTasks}
                    selected={selectedTasks}
                    taskDependencies={task.eventTaskDetails.flatMap(
                      (task) => task.taskDependencies
                    )}
                  />
                </Suspense>
                {/* {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>} */}
              </>

              {/* Specific Students */}
              <FormField
                control={form.control}
                name="assignedMembers"
                render={() => (
                  <FormItem>
                    <>
                      <FormLabel>Assigned Member</FormLabel>
                      <div className="flex gap-3">
                        {/* Search bar */}
                        <div className="mb-2 w-1/4">
                          <Input
                            placeholder="Search students"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>

                        <Button
                          onClick={handleAIRecommend}
                          type="button"
                          disabled={
                            isLoading2 ||
                            !taskName ||
                            !taskDescription ||
                            allStudents.length <= 0
                          }
                          className="relative overflow-hidden btn-style501 text-[#133a95] 
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
                            {isLoading2 ? "Is loading..." : "AI Recommendation"}
                          </span>
                        </Button>
                      </div>
                      {!isReadyToFetch ? (
                        <div className="text-sm text-red-500 italic">
                          After selecting the Start Date, Deadline, and Privacy,
                          a list of available students will be displayed.
                        </div>
                      ) : (
                        <Suspense fallback={<div>Loading students...</div>}>
                          <SpecificStudentList
                            students={filteredStudents}
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
                          {selectedMembers && selectedMembers.length === 0 && (
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
