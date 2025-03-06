/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"

import { useEffect, useState } from "react"
import { UserAuthDTO } from "@/models/Auth/UserAuth"
import { getCurrentUserAPI } from "@/api/auth/LoginAPI"
import { useAreas } from "@/hooks/staff/Area/useArea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EventSchema } from "@/schema/EventSchema"
import { ArrowLeft, CalendarIcon, Trash2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEvents } from "@/hooks/staff/Event/useEvent"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import LoadingAnimation from "@/components/ui/loading"
import { AreaPicker, DatePicker } from "./AreaPicker"
import { Avatar, Box, Button, Grid2, styled } from "@mui/material"

type EventFormValues = z.infer<typeof EventSchema> & {
  eventAreas: {
    areaId: string
    startDate: Date
    endDate: Date
  }[]
}

interface EventDialogProps {
  initialData?: EventFormValues | null
  onSuccess?: () => void // Callback để reload data sau khi tạo area
  setOpen?: (open: boolean) => void // Nhận state từ component cha
}

export const CreateEventClub: React.FC<EventDialogProps> = ({
  initialData,
  onSuccess,
  setOpen,
}) => {
  const [userInfo, setUserInfo] = useState<UserAuthDTO>()
  const [isLoading, setIsLoading] = useState(false)

  // Preview cho ảnh upload
  const [preview, setPreview] = useState<string | null>(null)

  // Chỉ fetch thông tin user khi cần thiết
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getCurrentUserAPI()
        if (userInfo) {
          setUserInfo(userInfo.data)
          form.setValue("universityId", userInfo.data?.universityId ?? "")
          form.setValue(
            "representativeId",
            userInfo.data?.representativeId ?? ""
          )
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error)
      }
    }

    if (!initialData) {
      fetchUserInfo()
    }
  }, [initialData])

  const { areas } = useAreas(1, 10, userInfo?.universityId) // Lấy mutation từ React Query
  const { createEvent, isPending } = useEvents()
  const navigate = useNavigate()

  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventSchema),
    defaultValues:
      initialData || {
        universityId: "",
        representativeId: "",
        clubId: "",
        eventName: "",
        imageUrl: "",
        description: "",
        registeredStartDate: new Date(),
        registeredEndDate: new Date(),
        price: 0,
        maxParticipants: 0,
        eventAreas: [
          {
            areaId: "",
            startDate: new Date(),
            endDate: new Date(),
          },
        ],
        eventType: "",
      },
  })

  // Lấy errors từ form
  const {
    register,
    formState: { errors },
  } = form

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "eventAreas", // Liên kết với mảng eventAreas
  })

  // Xử lý upload file ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
    } else {
      setPreview(null);
    }
  }

  // Tạo styled input ẩn
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  })

  // Xử lý submit
  const onSubmit = async (values: EventFormValues) => {
    console.log("Form Submitted with values:", values)
    try {
      setIsLoading(true)

      const formData = new FormData()
      formData.append("RepresentativeId", values.representativeId ?? "")
      formData.append("UniversityId", values.universityId)
      formData.append("EventName", values.eventName)
      formData.append("Description", values.description ?? "")
      formData.append(
        "RegisteredStartDate",
        values.registeredStartDate.toISOString()
      )
      formData.append(
        "RegisteredEndDate",
        values.registeredEndDate.toISOString()
      )
      formData.append("Price", values.price.toString())
      formData.append("MaxParticipants", values.maxParticipants.toString())
      formData.append("EventType", values.eventType)

      // Kiểm tra nếu imageUrl là File
      if ((values.imageUrl as any) instanceof File) {
        formData.append("ImageUrl", values.imageUrl as any)
      }

      // Format eventAreas
      const formattedEventAreas = values.eventAreas.map((area) => ({
        AreaId: area.areaId,
        StartDate: area.startDate,
        EndDate: area.endDate,
      }))
      formData.append("EventArea", JSON.stringify(formattedEventAreas))

      if (initialData) {
        // TODO: Update event logic
        // await updateEvent(formData)
      } else {
        // Tạo event mới
        await createEvent(formData)
      }

      navigate("/representative/event")
      if (!isPending) {
        setOpen?.(false) // Đóng dialog
      }
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Xử lý lỗi validation
  const onError = (errors: any) => {
    // Nếu lỗi validation từ zod được gắn vào eventAreas, hiển thị toast.error
    if (errors.eventAreas) {
      const message =
        errors.eventAreas._error?.message ||
        errors.eventAreas.message ||
        "Area is not allowed to be duplicated."
      toast.error(message)
    }
  }

  return (
    <div className="min-h-[200px] sm:min-h-[300px] h-auto sm:min-w-[300px]">
      {/* Loading khi đang pending */}
      {isPending ? (
        <div className="flex justify-center items-center h-full w-full">
          <LoadingAnimation />
        </div>
      ) : (
        <>
          {/* Nút Back */}

          {/* Heading */}
          <div className="mb-5">
            <h2 className="text-3xl font-bold tracking-tight">
              <Button sx={{ color: "black" }} variant="text" onClick={() => navigate(-1)} className="mb-2">
                <ArrowLeft size={24} />
              </Button>
              Create Event
            </h2>
            <p className="text-sm text-muted-foreground ml-5">
              Create new event for your club
            </p>
          </div>
          <div className="p-4 mx-7">
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  form.handleSubmit(onSubmit, onError)()
                }}
              >
                <div className="space-y-2">
                  {/* Row 1 */}
                  <div className="grid grid-cols-2 gap-5">
                    {/* Event Name */}
                    <FormField
                      control={form.control}
                      name="eventName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event's Name</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Price */}
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* MaxParticipants */}
                    <FormField
                      control={form.control}
                      name="maxParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Participants</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* EventType */}
                    <FormField
                      control={form.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event's Type</FormLabel>
                          <FormControl>
                            <Select
                              {...field}
                              disabled={!!initialData}
                              value={field.value || ""}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={
                                    field.value
                                      ? field.value
                                      : "Select event's type"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Type</SelectLabel>
                                  <SelectItem value="PUBLIC">PUBLIC</SelectItem>
                                  <SelectItem value="PRIVATE">PRIVATE</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* RegisteredStartDate */}
                    <FormField
                      control={form.control}
                      name="registeredStartDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Registered Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outlined"
                                  sx={{ color: "black", border: "1px solid #e2e8f0", textTransform: "none" }}
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
                            <PopoverContent className="w-auto p-0 mb-0 pb-0" align="start">
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

                    {/* RegisteredEndDate */}
                    <FormField
                      control={form.control}
                      name="registeredEndDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Registered End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outlined"
                                  sx={{ color: "black", border: "1px solid #e2e8f0", textTransform: "none" }}
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
                  </div>

                  {/* Event Areas */}
                  <FormField
                    control={form.control}
                    name="eventAreas"
                    render={() => (
                      <FormItem className="mt-2">
                        <FormLabel className="mt-2 text-gray-800">
                          Event Areas
                        </FormLabel>
                        <FormControl>
                          <div className="flex flex-col space-y-6">
                            {fields.map((item, index) => (
                              <div
                                key={item.id}
                                className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                              >
                                {/* Header cho mỗi Area: Tên + Nút Remove */}
                                <div className="flex items-center justify-between mb-2">
                                  <h2 className="text-sm font-medium text-gray-800">
                                    Area {index + 1}
                                  </h2>
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-sm text-red-600 hover:text-red-800 transition-colors"
                                  >
                                    <Trash2Icon size={20} />
                                  </button>
                                </div>

                                {/* Row chứa Select Area và 2 Date Picker */}
                                <div className="flex flex-wrap items-end gap-3">
                                  {/* Select Area */}
                                  <div className="w-full sm:w-auto flex-1 min-w-[100px]">
                                    <AreaPicker
                                      item={item}
                                      index={index}
                                      update={update}
                                      areas={areas}
                                    />
                                  </div>

                                  {/* Start Date */}
                                  <div className="w-full sm:w-auto flex-1 min-w-[100px]">
                                    <DatePicker
                                      label="Start Date"
                                      selectedDate={item.startDate}
                                      onDateSelect={(date: Date) =>
                                        update(index, {
                                          ...item,
                                          startDate: date,
                                        })
                                      }
                                    />
                                  </div>

                                  {/* End Date */}
                                  <div className="w-full sm:w-auto flex-1 min-w-[100px]">
                                    <DatePicker
                                      label="End Date"
                                      selectedDate={item.endDate}
                                      onDateSelect={(date: Date) =>
                                        update(index, {
                                          ...item,
                                          endDate: date,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Nút thêm Area mới */}
                            <Button
                              type="button"
                              sx={{ background: "linear-gradient(to right, #136CB5, #49BBBD)", textTransform: "none" }}
                              variant="text"
                              onClick={() =>
                                append({
                                  areaId: "",
                                  startDate: new Date(),
                                  endDate: new Date(),
                                })
                              }
                              className="inline-flex w-fit items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm transition-colors"
                            >
                              Add Area
                            </Button>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <textarea
                            className="border p-2 rounded w-full h-30"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* File Upload */}
                <Grid2 size={{ xs: 12 }} className="mt-4">
                  <Box>
                    <VisuallyHiddenInput
                      accept="image/*"
                      id="upload-button-file"
                      type="file"
                      {...register("imageUrl")}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleFileChange(e);
                      }}
                    />
                    <label htmlFor="upload-button-file">
                      <Button
                        variant="contained"
                        component="span"
                        color="primary"
                        sx={{ textTransform: 'none', background: 'linear-gradient(to right, #136CB5, #49BBBD)' }}
                      >
                        Choose image
                      </Button>
                      {errors.imageUrl && (
                        <p className="text-red-500 text-sm mt-1">
                          Please choose a file
                        </p>
                      )}
                    </label>
                  </Box>
                </Grid2>

                {/* Preview Avatar */}
                <Grid2 size={{ xs: 12 }} className="mt-2">
                  {preview && (
                    <Avatar
                      src={preview}
                      variant="square"
                      alt="Preview"
                      sx={{ width: 100, height: 100 }}
                    />
                  )}
                </Grid2>

                {/* Submit Button */}
                <div className="flex w-full justify-end mt-6">
                  <Button variant="contained" sx={{ textTransform: "none", background: "black" }} type="submit" disabled={isLoading}>
                    {isLoading
                      ? initialData
                        ? "Updating..."
                        : "Creating..."
                      : initialData
                        ? "Update Event"
                        : "Create Event"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </>
      )}
    </div>
  )
}
