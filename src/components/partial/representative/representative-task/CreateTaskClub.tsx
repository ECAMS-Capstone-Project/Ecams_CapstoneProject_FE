/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// UI & Components
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { TaskSchema } from "./TaskSchema"

type TaskFormValues = z.infer<typeof TaskSchema>

interface CreateTaskProps {
  initialData?: TaskFormValues | null
  onSuccess?: () => void
  setOpen?: (open: boolean) => void
}

export const CreateTaskClub: React.FC<CreateTaskProps> = ({
  initialData,
  onSuccess,
  setOpen
}) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  // Tạo form hook
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    defaultValues: initialData || {
      clubId: "",
      taskName: "",
      description: "",
      deadline: new Date(),
      status: "IN_PROGRESS",
    },
  })

  // Lấy error state
  const {
    formState: { errors },
  } = form
  console.log(errors);

  // Submit handler
  const onSubmit = async (values: TaskFormValues) => {
    try {
      setIsLoading(true)

      // Chuyển dữ liệu sang FormData (nếu cần) hoặc JSON
      const formData = new FormData()
      formData.append("ClubId", values.clubId)
      formData.append("TaskName", values.taskName)
      formData.append("Description", values.description)
      formData.append("Deadline", values.deadline.toISOString())
      formData.append("Status", values.status)

      // Gọi API tạo task (Ví dụ)
      // await createTaskAPI(formData)

      toast.success("Task created successfully!")
      onSuccess?.()
      setOpen?.(false)
      navigate("/club-owner/task") // Chuyển hướng sang trang Task list (Ví dụ)
    } catch (error: any) {
      toast.error(error.message || "An error occurred while creating task.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[300px]">
      {/* Nút Back */}

      <div className="mb-5">
        <h2 className="text-3xl font-bold tracking-tight">
          <Button variant="link" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </Button>
          Create Task
        </h2>
        <p className="text-sm text-muted-foreground ml-5">
          Create new task for your club
        </p>
      </div>

      <div className="p-4 mx-7">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >

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

            {/* Deadline */}
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline</FormLabel>
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

            {/* Nút Submit */}
            <div className="flex justify-end mt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? (initialData ? "Updating..." : "Creating...")
                  : (initialData ? "Update Task" : "Create Task")
                }
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
