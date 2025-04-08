/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, Suspense } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import { TaskFormValues, TaskSchema } from "@/schema/TaskSchema";

// Lazy import danh sách student
const SpecificStudentList = React.lazy(() => import("./SpecificStudentList"));

// Interface cho student (đã cập nhật)
interface Student {
  studentId: string;
  fullName: string;
  userId: string;
  roleName: string;
  clubMemberId: string;
}

// Import API lấy danh sách member trong club và API tạo task
import { CreateTaskToStudent } from "@/api/club-owner/TaskAPI";
import { ClubMemberDTO, GetMemberInClubsByStatusAPI } from "@/api/club-owner/ClubByUser";
import useAuth from "@/hooks/useAuth";
import { Grid2 } from "@mui/material";

export default function CreateTaskClub() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  // Club ID (có thể lấy từ context hoặc auth)
  const location = useLocation();
  const clubId = location.state?.clubId; // Lấy clubId

  // Lấy danh sách thành viên từ API
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  useEffect(() => {
    async function fetchMembers() {
      try {
        if (!clubId) return;
        // Gọi API với clubId, pageSize và pageNo
        const response = await GetMemberInClubsByStatusAPI(clubId, 100, 1, "ACTIVE");
        if (response.data) {
          // Giả sử API trả về { data: ClubMemberDTO[] }
          const members: ClubMemberDTO[] = response.data.data;
          const students: Student[] = members.filter(a => a.clubRoleName != "CLUB_OWNER").map((m) => ({
            studentId: m.studentId,
            fullName: m.fullname,
            roleName: m.clubRoleName,
            userId: m.userId,
            clubMemberId: m.clubMemberId, // Lấy trường clubMemberId từ API
          }));
          setAllStudents(students);
        }
      } catch (error: any) {
        console.error("Failed to fetch club members", error);
        toast.error("Failed to load club members");
      }
    }
    fetchMembers();
  }, [clubId]);

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
      assignAll: false,
      selectedMembers: [],
      clubId: clubId,
    },
  });
  const { handleSubmit, setValue, getValues, watch } = form;
  const assignAll = watch("assignAll");
  const selectedMembers = watch("selectedMembers");

  // Kết hợp ngày & giờ thành 1 Date final
  const combineDateTime = (dateObj: Date, timeStr: string) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    const newDate = new Date(dateObj);
    newDate.setHours(hour, minute, 0, 0);
    return newDate;
  };

  // Submit form
  const onSubmit = async (values: TaskFormValues) => {
    if (!user) return;
    try {
      setIsLoading(true);
      const finalDeadline = combineDateTime(values.deadlineDate, values.deadlineTime);
      const finalStartTime = combineDateTime(values.startTimeDate, values.startTimeTime);

      // Nếu assignAll là true, lấy tất cả member (sử dụng clubMemberId)
      // Nếu không, chuyển selectedMembers (được lưu là studentId) sang clubMemberId qua việc tra cứu trong allStudents.
      const assignedMembers =
        assignAll && allStudents.length > 0
          ? allStudents.filter((student) => student.roleName != "CLUB_OWNER")
            .map((student) => ({ clubMemberId: student.clubMemberId }))
          : selectedMembers.map((id: string) => {
            const stu = allStudents.find((s) => s.studentId === id);
            return { clubMemberId: stu ? stu.clubMemberId : id };
          });

      const data = {
        clubId,
        createdBy: user.userId,
        taskName: values.taskName,
        description: values.description,
        startTime: finalStartTime.toISOString(),
        deadline: finalDeadline.toISOString(),
        taskScore: values.taskScore,
        assignedMembers,
      };

      console.log("CreateTask data:", data);
      await CreateTaskToStudent(data);
      toast.success("Task created successfully!");
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while creating/updating task.");
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
      setValue("selectedMembers", current.filter((id: string) => id !== studentId));
    }
  };

  // Khi assignAll thay đổi: nếu true, xóa selectedMembers; nếu false, cho phép chọn lại.
  const handleAssignAllChange = (checked: boolean) => {
    setValue("assignAll", checked);
    if (checked) {
      setValue("selectedMembers", []);
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
          Create Task
        </h2>
        <p className="text-sm text-muted-foreground ml-11">
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
                          <Input {...field} type="number" placeholder="Enter score (0-100)" />
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
                            className={cn("text-left font-normal w-full", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
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
                            className={cn("text-left font-normal w-full", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
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
                      <Checkbox checked={assignAll} onCheckedChange={handleAssignAllChange} />
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
                name="selectedMembers"
                render={() => (
                  <FormItem>
                    {!assignAll && (
                      <>
                        <FormLabel>Specific Students</FormLabel>
                        {/* Search bar */}
                        <div className="mb-2 w-1/4">
                          <Input
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>

                        <Suspense fallback={<div className="p-2 text-center">Loading students...</div>}>
                          <SpecificStudentList
                            students={filteredStudents}
                            selected={selectedMembers}
                            isAssignAll={assignAll}
                            handleToggleStudent={handleToggleStudent}
                          />
                        </Suspense>

                        <FormMessage />

                        <div className="mt-3">
                          <p className="text-sm font-semibold">Selected Students:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedMembers && selectedMembers.length === 0 && (
                              <span className="text-sm text-muted-foreground">
                                No students selected.
                              </span>
                            )}
                            {selectedMembers &&
                              selectedMembers.map((id) => {
                                const st = allStudents.find((s) => s.studentId === id);
                                if (!st) return null;
                                return (
                                  <span key={id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                    {st.fullName} - {st.roleName}
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
