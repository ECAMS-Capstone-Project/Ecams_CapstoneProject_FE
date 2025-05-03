/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, CalendarIcon } from "lucide-react";
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
import { cn, fixTime } from "@/lib/utils";

import { TaskFormValues, TaskSchema } from "@/schema/TaskSchema";

// Import API lấy danh sách member trong club và API tạo task
import { CreateTaskToStudent } from "@/api/club-owner/TaskAPI";
import useAuth from "@/hooks/useAuth";
import { Grid2 } from "@mui/material";
import { AvailableMemberEventTask, GetAvailableMember } from "@/api/student/ClubAgent";
import SpecificStudentClubList from "./SpecificStudentClubList";

export default function CreateTaskClub() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const clubId = location.state?.clubId;
  const [priority] = useState<string>("MEDIUM");

  const [allStudents, setAllStudents] = useState<AvailableMemberEventTask[]>([]);

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
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    mode: "onChange",
    defaultValues: {
      taskName: "",
      description: "",
      deadlineDate: new Date(),
      deadlineTime: "",
      startTimeDate: new Date(),
      startTimeTime: "",
      taskScore: 0,
      selectedMembers: [],
      clubId: clubId,
    },
  });
  const { handleSubmit, setValue, getValues, watch } = form;
  const selectedMembers = watch("selectedMembers");
  const startTimeDate = watch("startTimeDate");
  const deadlineTimeDate = watch("deadlineDate");

  // Kết hợp ngày & giờ thành 1 Date final
  const combineDateTime = (dateObj: Date, timeStr: string) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    const newDate = new Date(dateObj);
    newDate.setHours(hour, minute, 0, 0);
    return newDate;
  };

  useEffect(() => {
    async function fetchMembers() {
      if (!clubId || !startTimeDate || !deadlineTimeDate) return;

      try {
        const response = await GetAvailableMember(
          clubId,
          new Date(startTimeDate).toISOString(),
          new Date(deadlineTimeDate).toISOString(),
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

  // Submit form
  const onSubmit = async (values: TaskFormValues) => {
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

      // Nếu assignAll là true, lấy tất cả member (sử dụng clubMemberId)
      // Nếu không, chuyển selectedMembers (được lưu là studentId) sang clubMemberId qua việc tra cứu trong allStudents.
      const assignedMembers =
        selectedMembers.map((id: string) => {
          const stu = allStudents.find((s) => s.studentId === id);
          return { clubMemberId: stu ? stu.clubMemberId : id };
        });

      const data = {
        clubId,
        createdBy: user.userId,
        taskName: values.taskName,
        description: values.description,
        startTime: fixTime(finalStartTime).toISOString(),
        deadline: fixTime(finalDeadline).toISOString(),
        taskScore: values.taskScore,
        assignedMembers,
      };

      console.log("CreateTask data:", data);
      await CreateTaskToStudent(data);
      toast.success("Task created successfully!");
      navigate(`/club/detail/${clubId}`, { state: { status: "tasks" } });
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while creating/updating task."
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle chọn sinh viên cụ thể (lưu studentId, sẽ convert sang clubMemberId khi submit)
  const handleToggleStudent = (studentId: string, checked: boolean) => {
    const current = getValues("selectedMembers");
    if (checked) {
      setValue("selectedMembers", [...current, studentId]);
    } else {
      setValue(
        "selectedMembers",
        current.filter((id: string) => id !== studentId)
      );
    }
  };

  return (
    <div className="min-h-[300px]">
      {/* Nút Back */}
      <div className="mb-5">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </Button>
          Create task in club
        </h2>
        <p className="text-sm text-muted-foreground ml-10 mt-3">
          Create new task for your club
        </p>
      </div>

      <div className="p-4 mx-7">
        <Form {...form}>
          <div className="flex justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-3/4">
              {/* Task Name */}
              <Grid2 container spacing={2}>
                <Grid2 size={6}>
                  <FormField
                    control={form.control}
                    name="taskName"
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
                  {/* Score */}
                  <FormField
                    control={form.control}
                    name="taskScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Score</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Enter score (0-100)"
                          />
                        </FormControl>
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

              <div className="grid grid-cols-2 gap-3">
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
                  <div style={{ width: "50%" }}>
                    <FormField
                      control={form.control}
                      name="startTimeTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
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
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const startDate = form.watch("startTimeDate");
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
                  </div>
                  <div style={{ width: "50%" }}>
                    <FormField
                      control={form.control}
                      name="deadlineTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Specific Students */}
              <FormField
                control={form.control}
                name="selectedMembers"
                render={() => (
                  <FormItem>
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
                      </div>
                      <Suspense
                        fallback={
                          <div className="p-2 text-center">
                            Loading students...
                          </div>
                        }
                      >
                        <SpecificStudentClubList
                          students={filteredStudents}
                          selected={selectedMembers}
                          handleToggleStudent={handleToggleStudent}
                        />
                      </Suspense>

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