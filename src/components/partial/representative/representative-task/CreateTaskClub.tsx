/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, Suspense } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { ArrowLeft, CalendarIcon } from "lucide-react"
import { format } from "date-fns"

// shadcn/ui & Components
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

import { TaskFormValues, TaskSchema } from "@/schema/TaskSchema"

// Lazy import danh sách student
const SpecificStudentList = React.lazy(() => import("./SpecificStudentList"))

interface Student {
  studentId: string
  fullName: string
}

export default function CreateTaskClub() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  // =========== FAKE load ds sinh viên ===========  
  const [allStudents, setAllStudents] = useState<Student[]>([])
  useEffect(() => {
    const fakeData: Student[] = [
      { studentId: "ST001", fullName: "John Smith" },
      { studentId: "ST002", fullName: "Jane Doe" },
      { studentId: "ST003", fullName: "Jane 1" },
      { studentId: "ST004", fullName: "Jane 2" },
      { studentId: "ST005", fullName: "Jane 3" },
      { studentId: "ST006", fullName: "Jane 4" },
      { studentId: "ST007", fullName: "Jane 5" },
      { studentId: "ST008", fullName: "Jane 6" },
      { studentId: "ST009", fullName: "Jane 7" },
      { studentId: "ST0010", fullName: "Jane 8" },
      { studentId: "ST0011", fullName: "Jane 9" },
      // ... Thêm
    ]
    setAllStudents(fakeData)
  }, [])

  // =========== Search + Debounce ===========  
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const filteredStudents = allStudents.filter((st) =>
    st.fullName.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  // =========== REACT HOOK FORM ===========  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    mode: "onChange", // hiển thị lỗi ngay
  })

  const {
    handleSubmit,
    setValue,
    getValues,
  } = form

  // Kết hợp date + time => Date final
  const combineDateTime = (dateObj: Date, timeStr: string) => {
    const [hour, minute] = timeStr.split(":").map(Number)
    const newDate = new Date(dateObj)
    newDate.setHours(hour, minute, 0, 0)
    return newDate
  }

  // Submit
  const onSubmit = async (values: TaskFormValues) => {
    try {
      setIsLoading(true)
      // Tạo 1 Date final
      const finalDeadline = combineDateTime(values.deadlineDate, values.deadlineTime)
      console.log(finalDeadline);
      // Gọi API
      navigate("/club-owner/task")
    } catch (error: any) {
      toast.error(error.message || "An error occurred while creating/updating task.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle student
  const handleToggleStudent = (studentId: string, checked: boolean) => {
    const current = getValues("selectedMembers")
    if (checked) {
      setValue("selectedMembers", [...current, studentId])
    } else {
      setValue("selectedMembers", current.filter((id) => id !== studentId))
    }
  }

  // Check assignAll => xóa selected
  const handleAssignAllChange = (checked: boolean) => {
    setValue("assignAll", checked)
    if (checked) {
      setValue("selectedMembers", [])
    }
  }

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* TaskName */}
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

            {/* Deadline: ngày và giờ KẾ BÊN NHAU */}
            <div className="flex space-x-4 w-1/2">
              {/* Chọn ngày */}
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

              {/* Chọn giờ */}
              <FormField
                control={form.control}
                name="deadlineTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline Time</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pick a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                          <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                          <SelectItem value="PENDING">PENDING</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Score */}
            <FormField
              control={form.control}
              name="score"
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

            {/* Assign All */}
            <FormField
              control={form.control}
              name="assignAll"
              render={() => {
                const val = getValues("assignAll")
                return (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={val}
                        onCheckedChange={handleAssignAllChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Assign all members</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        If checked, all members in the club will be assigned
                      </p>
                    </div>
                  </FormItem>
                )
              }}
            />

            {/* Specific Students */}
            <FormField
              control={form.control}
              name="selectedMembers"
              render={() => {
                const selected = getValues("selectedMembers")
                const isAssignAll = getValues("assignAll")

                return (
                  <FormItem>
                    <FormLabel>Specific Students</FormLabel>

                    {/* Search bar */}
                    <div className="mb-2">
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <Suspense fallback={<div className="p-2 text-center">Loading students...</div>}>
                      <SpecificStudentList
                        students={filteredStudents}
                        selected={selected}
                        isAssignAll={isAssignAll}
                        handleToggleStudent={handleToggleStudent}
                      />
                    </Suspense>

                    {/* FormMessage để hiển thị lỗi refine */}
                    <FormMessage />

                    {/* Label hiển thị selected student (nếu !isAssignAll) */}
                    {!isAssignAll && (
                      <div className="mt-3">
                        <p className="text-sm font-semibold">Selected Students:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selected.length === 0 && (
                            <span className="text-sm text-muted-foreground">
                              No students selected.
                            </span>
                          )}
                          {selected.map((id) => {
                            const st = allStudents.find((s) => s.studentId === id)
                            if (!st) return null
                            return (
                              <span
                                key={id}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                              >
                                {st.fullName}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </FormItem>
                )
              }}
            />

            {/* Submit */}
            <div className="flex justify-end mt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ?
                  "Creating..."
                  : "Create Task"
                }
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
