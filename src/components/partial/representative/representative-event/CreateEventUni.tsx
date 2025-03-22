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
import { ArrowLeft, CalendarIcon, Trash2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEvents } from "@/hooks/staff/Event/useEvent"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useLocation, useNavigate } from "react-router-dom"
import LoadingAnimation from "@/components/ui/loading"
import { AreaPicker, DatePicker } from "./AreaPicker"
import { Button, Grid2 } from "@mui/material"
import { createEvent } from "@/api/representative/EventAgent"
import { ring2 } from "ldrs"

type EventFormValues = z.infer<typeof EventSchema1> & {
  eventAreas: {
    areaId: string
    startDate: Date
    endDate: Date
  }[]
}
const EventSchema1 = z.object({
  eventId: z.string().uuid().optional(), // Validate UUID cho eventId
  universityId: z.string().uuid(),
  representativeName: z.string().optional(), // Có thể là string hoặc null
  clubId: z.string().optional(), // Có thể là string hoặc null
  clubName: z.string().optional(), // Có thể là string hoặc null
  eventName: z.string().min(1, { message: "Event name is required" }), // Event name không được rỗng
  // startDate: z.date(), // Kiểm tra là đối tượng Date hợp lệ
  // endDate: z.coerce.date().superRefine((date, ctx) => {
  //     const parsedDate = Date.parse(date.toString());
  //     if (isNaN(parsedDate)) {
  //       ctx.addIssue({ code: "custom", message: "Invalid date format" });
  //     }
  //     const startDate = (ctx as any).parent?.startDate ? Date.parse((ctx as any).parent.startDate) : null;
  //     if (startDate && parsedDate <= startDate) {
  //       ctx.addIssue({ code: "custom", message: "Ended date must be after created date." });
  //     }
  //   }), // Kiểm tra ngày kết thúc phải lớn hơn ngày bắt đầu
  registeredStartDate: z.date(), // Kiểm tra là đối tượng Date hợp lệ
  registeredEndDate: z.coerce.date().superRefine((date, ctx) => {
    const parsedDate = Date.parse(date.toString());
    if (isNaN(parsedDate)) {
      ctx.addIssue({ code: "custom", message: "Invalid date format" });
    }
    const registeredStartDate = (ctx as any).parent?.registeredStartDate ? Date.parse((ctx as any).parent.registeredStartDate) : null;
    if (registeredStartDate && parsedDate <= registeredStartDate) {
      ctx.addIssue({ code: "custom", message: "Registered end date must be after registered start date", });
    }
  }),

  price: z.coerce.number().min(0, { message: "Price must be a positive number" }), // Kiểm tra giá trị price là số nguyên và dương
  maxParticipants: z.coerce.number().int().positive({ message: "Max participants must be a positive integer" }), // Kiểm tra maxParticipants là số nguyên và dương
  status: z.string().optional(), // Kiểm tra status không rỗng
  walletId: z.string().optional(),
  eventAreas: z
    .array(
      z.object({
        areaId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .superRefine((areas, ctx) => {
      const ids = areas.map((a) => a.areaId);
      if (new Set(ids).size !== ids.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Area is not allowed to be duplicated.",
          path: ["_error"], // Đặt lỗi toàn cục của mảng vào _error
        });
      }
    }),

  // eventAreas là mảng tùy chọn, nếu có
  feedbacks: z.array(z.unknown()).optional(), // feedbacks là mảng tùy chọn, nếu có
  imageUrl: z.any(),
  description: z.string(),
  eventType: z.string(),
  trainingPoint: z.coerce.number().min(0, { message: "Training point must be a positive number" })
});
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
  const [, setIsLoading] = useState(false)
  const location = useLocation()
  // Lấy dữ liệu state
  const { clubId } = location.state || {}

  // Chỉ fetch thông tin user khi cần thiết
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getCurrentUserAPI()
        if (userInfo) {
          setUserInfo(userInfo.data)
          form.setValue("universityId", userInfo.data?.universityId ?? "")
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
  const { isPending } = useEvents()
  const navigate = useNavigate()

  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventSchema1),
    defaultValues:
      initialData || {
        universityId: "",
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
        trainingPoint: 0,
      },
  })

  // Lấy errors từ form
  const {
    formState: { errors, isSubmitting },
  } = form

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "eventAreas", // Liên kết với mảng eventAreas
  })

  // Xử lý submit
  const onSubmit = async (values: EventFormValues) => {
    ring2.register()
    try {
      setIsLoading(true)
      console.log(values.imageUrl);
      const formData = new FormData()
      if (clubId) {
        formData.append("ClubId", clubId)
      } else {
        toast.error("Club Id is not available")
      }
      // formData.append("RepresentativeId", values.representativeId ?? "")
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
      formData.append("TrainingPoint", values.trainingPoint.toString())
      formData.append("MaxParticipants", values.maxParticipants.toString())
      formData.append("EventType", values.eventType)
      if ((values.imageUrl as any) instanceof File) {
        formData.append("ImageUrl", values.imageUrl ?? "");
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
        toast.success("Create successfully")
      }

      navigate(-1)
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
  console.log(errors);

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
                    <FormField
                      control={form.control}
                      name="trainingPoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Training point</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
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
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => {
                      // eslint-disable-next-line react-hooks/rules-of-hooks
                      const [preview, setPreview] = useState<string | null>(
                        initialData?.imageUrl
                          ? String(initialData.imageUrl)
                          : null
                      );
                      const handleChange = (
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                          setPreview(URL.createObjectURL(file));
                        } else {
                          field.onChange(null);
                          setPreview(null);
                        }
                      };

                      return (
                        <FormItem>
                          <FormLabel>Upload Image</FormLabel>
                          <FormControl>
                            <div>
                              {preview && (
                                <img
                                  src={preview}
                                  alt="Preview"
                                  className="w-32 h-32 object-contain "
                                />
                              )}
                              <div className="flex items-center gap-4">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleChange}
                                  className="w-60"
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </Grid2>

                {/* Submit Button */}
                <div className="flex w-full justify-end mt-6">
                  <Button variant="contained" sx={{ textTransform: "none", background: "black" }} type="submit"
                    disabled={isSubmitting}
                    startIcon={
                      isSubmitting && (
                        <l-ring-2
                          size="40"
                          stroke="5"
                          stroke-length="0.25"
                          bg-opacity="0.1"
                          speed="0.8"
                          color="black"
                        ></l-ring-2>
                      )
                    }>
                    {(isSubmitting) ? "Loading..." : "Create event"}
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
