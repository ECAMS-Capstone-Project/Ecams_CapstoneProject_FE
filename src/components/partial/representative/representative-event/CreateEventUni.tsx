/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import { getCurrentUserAPI } from "@/api/auth/LoginAPI";
import { useAreas } from "@/hooks/staff/Area/useArea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, CalendarIcon, Trash2Icon } from "lucide-react";
import { cn, fixTime } from "@/lib/utils";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingAnimation from "@/components/ui/loading";
import { AreaPicker, DatePicker } from "./AreaPicker";
import { Autocomplete, Grid2, TextField } from "@mui/material";
import { createEvent } from "@/api/representative/EventAgent";
import { ring2 } from "ldrs";
import { FieldDTO, GetAllFields } from "@/api/club-owner/RequestClubAPI";
import { Button } from "@/components/ui/button";

type EventFormValues = z.infer<typeof EventSchema1> & {
  eventAreas: {
    AreaId: string;
    Date: Date;
    StartTime: string;
    EndTime: string;
  }[];
};
const EventSchema1 = z
  .object({
    eventId: z.string().uuid().optional(),
    universityId: z.string().uuid(),
    representativeName: z.string().optional(),
    clubId: z.string().optional(),
    clubName: z.string().optional(),
    eventName: z.string().min(1, { message: "Event name is required" }),

    registeredStartDate: z.coerce.date(),
    registeredEndDate: z.coerce.date(),

    startTimeTime: z.string().min(1, "Please select a time"),
    deadlineTime: z.string().min(1, "Please select a time"),

    fieldIds: z.array(z.string()).min(1, "At least one field is required"),

    price: z.coerce.number().min(0, { message: "Price is required" }),
    maxParticipants: z.coerce
      .number()
      .int()
      .positive({ message: "Max participants must be a positive integer" }),

    status: z.string().optional(),
    walletId: z.string().optional(),

    eventAreas: z.array(
      z.object({
        AreaId: z.string().min(1, "Area ID is required"),
        Date: z.coerce.date(),
        StartTime: z.string(),
        EndTime: z.string(),
      })
    ),

    feedbacks: z.array(z.unknown()).optional(),

    imageUrl: z.any().refine(
      (val) => {
        if (typeof val === "string") return true; // URL string hợp lệ
        if (val instanceof File) return val.type.startsWith("image/");
        return false;
      },
      {
        message: "Image must be a valid image file or URL",
      }
    ),
    description: z.string().min(1, "Description is required"),
    eventType: z.string().min(1, "Event Type Require"),
  })
  .refine(
    (data) => {
      return data.registeredEndDate >= data.registeredStartDate;
    },
    {
      path: ["registeredEndDate"],
      message: "Registered end date must be after or equal to start date",
    }
  )
  .superRefine((data, ctx) => {
    const now = new Date();

    // Check if there is at least one event area
    if (!data.eventAreas || data.eventAreas.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one event area is required",
        path: ["eventAreas", "_error"],
      });
      return;
    }

    const startDateTime = new Date(data.registeredStartDate);
    const [startHour, startMinute] = data.startTimeTime.split(":").map(Number);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const deadlineDateTime = new Date(data.registeredEndDate);
    const [endHour, endMinute] = data.deadlineTime.split(":").map(Number);
    deadlineDateTime.setHours(endHour, endMinute, 0, 0);

    if (startDateTime < now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start time must be after now.",
        path: ["startTimeTime"],
      });
    }
    const isSameDate =
      data.registeredStartDate.toDateString() ===
      data.registeredEndDate.toDateString();
    if (isSameDate) {
      const [startHour, startMinute] = data.startTimeTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = data.deadlineTime.split(":").map(Number);

      const start = startHour * 60 + startMinute;
      const end = endHour * 60 + endMinute;

      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "When end time must be after start time.",
          path: ["deadlineTime"],
        });
      }
    }

    // Group areas by date
    const areaGroups = data.eventAreas.reduce((acc, area) => {
      const dateKey = area.Date.toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(area);
      return acc;
    }, {} as Record<string, typeof data.eventAreas>);

    // Check time overlap for all areas on the same date
    Object.entries(areaGroups).forEach(([, areas]) => {
      // Check all pairs of areas for time overlap
      for (let i = 0; i < areas.length; i++) {
        for (let j = i + 1; j < areas.length; j++) {
          const area1 = areas[i];
          const area2 = areas[j];

          // Convert time strings to minutes
          const start1 = parseInt(area1.StartTime) * 60;
          const end1 = parseInt(area1.EndTime) * 60;
          const start2 = parseInt(area2.StartTime) * 60;
          const end2 = parseInt(area2.EndTime) * 60;

          // Check for time overlap
          if (
            (start1 < end2 && end1 > start2) ||
            (start2 < end1 && end2 > start1)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Time slots overlap between 2 Area`,
              path: ["eventAreas", "_error"],
            });
            return;
          }
        }
      }
    });

    data.eventAreas.forEach((area, index) => {
      const start = parseInt(area.StartTime) * 60;
      const end = parseInt(area.EndTime) * 60;

      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be after start time.",
          path: ["eventAreas", index, "EndTime"],
        });
      }

      if (area.Date <= data.registeredEndDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Event date must be after registered end date.",
          path: ["eventAreas", index, "Date"],
        });
      }
    });
  });

interface EventDialogProps {
  initialData?: EventFormValues | null;
  onSuccess?: () => void; // Callback để reload data sau khi tạo area
  setOpen?: (open: boolean) => void; // Nhận state từ component cha
}

export const CreateEventClub: React.FC<EventDialogProps> = ({
  initialData,
  onSuccess,
  setOpen,
}) => {
  const [userInfo, setUserInfo] = useState<UserAuthDTO>();
  const [fieldOptions, setFieldOptions] = useState<FieldDTO[]>([]);
  const [, setIsLoading] = useState(false);
  const location = useLocation();
  // Lấy dữ liệu state
  const { clubId } = location.state || {};

  // Chỉ fetch thông tin user khi cần thiết
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [userInfoRes, fieldsRes] = await Promise.all([
          !initialData ? getCurrentUserAPI() : Promise.resolve(null),
          GetAllFields(),
        ]);

        if (userInfoRes?.data) {
          const data = userInfoRes.data;
          setUserInfo(data);
          form.setValue("universityId", data.universityId ?? "");
        }

        setFieldOptions(fieldsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch user info or fields:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [initialData]);

  const { areas } = useAreas(1, 200, userInfo?.universityId);
  const { isPending } = useEvents();
  const navigate = useNavigate();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventSchema1),
    defaultValues: initialData || {
      universityId: "",
      clubId: "",
      eventName: "",
      description: "",
      registeredStartDate: new Date(),
      registeredEndDate: new Date(),
      price: 0,
      maxParticipants: 0,
      eventAreas: [
        { AreaId: "", Date: new Date(), StartTime: "8", EndTime: "17" },
      ],
      eventType: "",
    },
  });

  // Lấy errors từ form
  const {
    formState: { errors, isSubmitting },
  } = form;

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "eventAreas",
  });

  const combineDateTime = (dateObj: Date, timeStr?: string) => {
    const [hour, minute] = (timeStr?.split(":") ?? ["0", "0"]).map(Number);
    const newDate = new Date(dateObj);
    newDate.setHours(hour, minute, 0, 0);
    return newDate;
  };

  // Xử lý submit
  const onSubmit = async (values: EventFormValues) => {
    ring2.register();
    try {
      setIsLoading(true);
      const finalDeadline = combineDateTime(
        values.registeredEndDate,
        values.deadlineTime
      );
      const finalStartTime = combineDateTime(
        values.registeredStartDate,
        values.startTimeTime
      );
      const formData = new FormData();
      if (clubId) {
        formData.append("Clubs", `[{"ClubId":"${clubId}", "IsHost":true}]`);
      } else {
        toast.error("Club Id is not available");
      }
      // formData.append("RepresentativeId", values.representativeId ?? "")
      formData.append("UniversityId", values.universityId);
      formData.append("EventName", values.eventName);
      formData.append("Description", values.description ?? "");
      formData.append(
        "RegisteredStartDate",
        fixTime(finalStartTime).toISOString()
      );
      formData.append(
        "RegisteredEndDate",
        fixTime(finalDeadline).toISOString()
      );
      formData.append("Price", values.price.toString());
      formData.append("MaxParticipants", values.maxParticipants.toString());
      formData.append("EventType", values.eventType);
      if ((values.imageUrl as any) instanceof File) {
        formData.append("ImageUrl", values.imageUrl ?? "");
      }
      values.fieldIds.forEach((id) => formData.append("FieldIds", id));
      // Format eventAreas
      const formattedEventAreas = values.eventAreas.map((area) => ({
        AreaId: area.AreaId,
        Date: format(area.Date, "yyyy-MM-dd"),
        StartTime: area.StartTime,
        EndTime: area.EndTime,
      }));
      formData.append("EventArea", JSON.stringify(formattedEventAreas));

      if (initialData) {
        // TODO: Update event logic
        // await updateEvent(formData)
      } else {
        // Tạo event mới
        await createEvent(formData);
        toast.success("Create successfully");
      }

      navigate(-1);
      if (!isPending) {
        setOpen?.(false); // Đóng dialog
      }
      onSuccess?.();
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý lỗi validation
  const onError = (errors: any) => {
    const areaErrors = errors.eventAreas;

    if (areaErrors?._error) {
      toast.error(areaErrors._error.message);
      return;
    }

    if (Array.isArray(areaErrors)) {
      areaErrors.forEach((err: any, index: number) => {
        if (err?.AreaId?.message) {
          toast.error(`Area ${index + 1}: ${err.AreaId.message}`);
        }
        if (err?.Date?.message) {
          toast.error(`Area ${index + 1}: ${err.Date.message}`);
        }
        if (err?.StartTime?.message) {
          toast.error(`Area ${index + 1}: ${err.StartTime.message}`);
        }
        if (err?.EndTime?.message) {
          toast.error(`Area ${index + 1}: ${err.EndTime.message}`);
        }
      });
    }
  };

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
              <Button
                style={{ color: "black" }}
                variant="link"
                onClick={() => navigate(-1)}
                className="mb-2"
              >
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
              <form onSubmit={form.handleSubmit(onSubmit, onError)}>
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
                            <Input
                              placeholder="Enter event name"
                              type="text"
                              {...field}
                            />
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
                          <FormLabel>Price (VNĐ)</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter price (VNĐ)"
                              {...field}
                              onChange={(e) => {
                                // Remove all non-digit characters
                                const value = e.target.value.replace(/\D/g, "");
                                // Format with thousand separators
                                const formattedValue = value.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ","
                                );
                                field.onChange(value);
                                e.target.value = formattedValue;
                              }}
                              value={
                                field.value
                                  ? field.value
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  : ""
                              }
                            />
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
                                  <SelectItem value="PRIVATE">
                                    PRIVATE
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-5 w-full">
                    <FormField
                      control={form.control}
                      name="registeredStartDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col h-full">
                          <FormLabel className="mb-2">
                            Register start date
                          </FormLabel>
                          <div className="flex-1">
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "text-left font-normal w-full",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(new Date(field.value), "PPP")
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
                          </div>
                          <FormMessage className="mt-1 text-sm text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startTimeTime"
                      render={({ field }) => (
                        <FormItem className="flex flex-col h-full">
                          <FormLabel className="mb-2">Time</FormLabel>
                          <div className="flex-1">
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </div>
                          <FormMessage className="mt-1 text-sm text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="registeredEndDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col h-full">
                          <FormLabel className="mb-2">Register end date</FormLabel>
                          <div className="flex-1">
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "text-left font-normal w-full",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(new Date(field.value), "PPP")
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
                          </div>
                          <FormMessage className="mt-1 text-sm text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deadlineTime"
                      render={({ field }) => (
                        <FormItem className="flex flex-col h-full">
                          <FormLabel className="mb-2">Time</FormLabel>
                          <div className="flex-1">
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </div>
                          <FormMessage className="mt-1 text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <Controller
                      name="fieldIds"
                      control={form.control}
                      render={({ field }) => {
                        const currentValue = fieldOptions?.filter((fo) =>
                          field.value?.includes(fo.fieldId)
                        );

                        return (
                          <div className="mt-2 space-y-1">
                            {/* Label giống FormLabel */}
                            <label
                              className={
                                !errors.fieldIds
                                  ? "block text-sm font-medium text-gray-800"
                                  : "block text-sm font-medium text-red-600"
                              }
                            >
                              Fields
                            </label>

                            <Autocomplete
                              multiple
                              options={fieldOptions}
                              value={currentValue}
                              onChange={(_, newVal) => {
                                const finalIds: string[] = newVal.map(
                                  (item) => item.fieldId
                                );
                                field.onChange(finalIds);
                              }}
                              isOptionEqualToValue={(option, val) =>
                                option.fieldId === val.fieldId
                              }
                              getOptionLabel={(option) =>
                                typeof option === "string"
                                  ? option
                                  : option.fieldName
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&:hover": {
                                    borderColor: "#000",
                                  },
                                  "&:hover .MuiAutocomplete-tag": {
                                    color: "#000",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#000",
                                  },
                                },
                                "& .MuiInputBase-input": {
                                  fontSize: "0.875rem",
                                },
                                "& .MuiAutocomplete-tag": {
                                  fontSize: "0.75rem",
                                },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Search and select"
                                  className="text-sm"
                                  error={!!errors.fieldIds}
                                  helperText={errors.fieldIds?.message}
                                  size="small"
                                  fullWidth
                                />
                              )}
                            />
                          </div>
                        );
                      }}
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
                                      areas={areas.filter(
                                        (a) => a.status == true
                                      )}
                                    />
                                  </div>

                                  <div className="w-full sm:w-auto flex-1 min-w-[100px]">
                                    <DatePicker
                                      label="Date"
                                      selectedDate={item.Date}
                                      onDateSelect={(date: Date) =>
                                        update(index, {
                                          ...item,
                                          Date: date,
                                        })
                                      }
                                    />
                                  </div>

                                  {/* Start Time */}
                                  <div className="w-full sm:w-auto flex-1 min-w-[100px]">
                                    <FormLabel>Start Time</FormLabel>
                                    <Select
                                      value={item.StartTime}
                                      onValueChange={(value) =>
                                        update(index, {
                                          ...item,
                                          StartTime: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select start time" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Array.from({ length: 24 }, (_, i) => (
                                          <SelectItem
                                            key={i}
                                            value={i.toString()}
                                          >
                                            {`${i}:00`}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* End Time */}
                                  <div className="w-full sm:w-auto flex-1 min-w-[100px]">
                                    <FormLabel>End Time</FormLabel>
                                    <Select
                                      value={item.EndTime}
                                      onValueChange={(value) =>
                                        update(index, {
                                          ...item,
                                          EndTime: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select end time" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Array.from({ length: 24 }, (_, i) => (
                                          <SelectItem
                                            key={i}
                                            value={i.toString()}
                                          >
                                            {`${i}:00`}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Nút thêm Area mới */}
                            <Button
                              type="button"
                              variant={"custom"}
                              onClick={() =>
                                append({
                                  AreaId: "",
                                  Date: new Date(),
                                  StartTime: "8",
                                  EndTime: "17",
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
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? isSubmitting && (
                          <l-ring-2
                            size="40"
                            stroke="5"
                            stroke-length="0.25"
                            bg-opacity="0.1"
                            speed="0.8"
                            color="black"
                          ></l-ring-2>
                        )
                      : "Create event"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </>
      )}
    </div>
  );
};
