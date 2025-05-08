/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
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
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
import { EventSchema } from "@/schema/EventSchema";
import { ArrowLeft, CalendarIcon, Eye, Search, Trash2Icon } from "lucide-react";
import { cn, fixTime } from "@/lib/utils";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { AreaPicker, DatePicker } from "./AreaPicker";
import { Heading } from "@/components/ui/heading";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingAnimation from "@/components/ui/loading";
import EventWalletPicker from "./WalletPicker";
import FieldPicker from "./FieldPicker";
import { useClub } from "@/hooks/club/useClub";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isArray } from "lodash";
import { AvailableClubResponse } from "@/models/Club";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ClubInfoDialog } from "./ClubInfoDialog";

type EventFormValues = z.infer<typeof EventSchema> & {
  eventAreas: {
    AreaId: string;
    Date: Date;
    StartTime: string;
    EndTime: string;
  }[];
  clubs: {
    ClubId: string;
    IsHost: boolean;
  }[];
  fieldIds: string[];
};

interface EventDialogProps {
  initialData?: EventFormValues | null;
  onSuccess?: () => void; // Callback để reload data sau khi tạo area
  setOpen?: (open: boolean) => void; // Nhận state từ component cha
}

export const CreateEvent: React.FC<EventDialogProps> = ({
  onSuccess,
  setOpen,
}) => {
  const [userInfo, setUserInfo] = useState<UserAuthDTO>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClub, setSelectedClub] = useState<AvailableClubResponse>();
  const [openDialog, setOpenDialog] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isClubEvent, setIsClubEvent] = useState(false);
  const location = useLocation();
  const initialData = location.state?.initialData;
  console.log("initialData", initialData);
  // Chỉ fetch thông tin user khi cần thiết
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getCurrentUserAPI();
        if (userInfo) {
          setUserInfo(userInfo.data);
          form.setValue("universityId", userInfo.data?.universityId ?? "");
          form.setValue("representativeId", userInfo.data?.userId ?? "");
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    if (!initialData) {
      fetchUserInfo();
    }
  }, [initialData]);
  const { areas } = useAreas(1, 200, userInfo?.universityId); // Lấy mutation từ React Query
  const { createEvent, isPending } = useEvents();
  const navigate = useNavigate();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventSchema),
    defaultValues: initialData || {
      universityId: "",
      representativeId: "",
      clubs: [],
      walletId: "",
      eventName: "",
      imageUrl: "",
      description: "",
      registeredStartDate: new Date(),
      registeredEndDate: new Date(),
      price: 0,
      maxParticipants: 0,
      eventAreas: [
        { AreaId: "", Date: new Date(), StartTime: "8", EndTime: "17" },
      ],
      eventType: "",
      trainingPoint: 0,
      fieldIds: [],
    },
  });
  // Track form changes for eventAreas
  const watchEventAreas = form.watch("eventAreas");

  useEffect(() => {
    const eventDates = watchEventAreas.map((area) => area.Date);

    if (eventDates.length > 0) {
      const areaStartDate = new Date(
        Math.min(...eventDates.map((date) => new Date(date).getTime()))
      );
      const areaEndDate = new Date(
        Math.max(...eventDates.map((date) => new Date(date).getTime()))
      );

      setStartDate(areaStartDate);
      setEndDate(areaEndDate);
    }
  }, [watchEventAreas]);

  useEffect(() => {
    if (!isClubEvent) {
      form.setValue("clubs", []);
    }
  }, [isClubEvent]);

  // Handle startDate and endDate only when valid
  const validStartDate =
    startDate && !isNaN(startDate.getTime())
      ? fixTime(startDate).toISOString()
      : ""; // Or undefined if API expects undefined

  const validEndDate =
    endDate && !isNaN(endDate.getTime()) ? fixTime(endDate).toISOString() : ""; // Or undefined if API expects undefined

  // Call the API with these valid dates
  const { availableClubs } = useClub(
    "",
    userInfo?.universityId,
    validStartDate,
    validEndDate
  );
  // Now that we have start and end dates, we can call the useClub hook
  console.log(form.formState.errors);
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "eventAreas", // Liên kết với mảng eventAreas
  });

  const combineDateTime = (dateObj: Date, timeStr?: string) => {
    const [hour, minute] = (timeStr?.split(":") ?? ["0", "0"]).map(Number);
    const newDate = new Date(dateObj);
    newDate.setHours(hour, minute, 0, 0);
    return newDate;
  };

  // Handle form submit
  const onSubmit = async (values: EventFormValues) => {
    console.log("Form Submitted with values:", values);

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
      formData.append("RepresentativeId", values.representativeId ?? "");
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
      formData.append("TrainingPoint", values.trainingPoint.toString());
      if ((values.imageUrl as any) instanceof File) {
        formData.append("ImageUrl", values.imageUrl ?? "");
      }

      // Format eventAreas before appending to formData
      const formattedEventAreas = values.eventAreas.map((area) => ({
        AreaId: area.AreaId,
        Date: format(area.Date, "yyyy-MM-dd"),
        StartTime: area.StartTime,
        EndTime: area.EndTime,
      }));
      const formattedClubs = values.clubs.map((club) => ({
        ClubId: club.ClubId,
        IsHost: club.IsHost,
      }));
      if (isClubEvent) {
        formData.append("Clubs", JSON.stringify(formattedClubs));
      }

      formData.append("EventArea", JSON.stringify(formattedEventAreas));

      values.fieldIds.forEach((fieldId, index) => {
        formData.append(`FieldIds[${index}]`, fieldId);
      });

      if (initialData) {
        // Nếu có `initialData`, gọi API `updateArea`
        // await updateArea(formData); // Gọi API update
      } else {
        // Nếu không có `initialData`, gọi API `createArea`
        await createEvent(formData);
      }
      navigate(-1);
      if (!isPending) {
        setOpen && setOpen(false); // Đóng dialog sau khi submit thành công
      }
      onSuccess && onSuccess(); // Callback reload data nếu cần
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
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
    <>
      <div className="min-h-[200px] sm:min-h-[300px] h-auto sm:min-w-[300px]">
        {isPending ? (
          <div className="flex justify-center items-center h-full w-full">
            <LoadingAnimation />
          </div>
        ) : (
          <>
            <Button
              variant="custom"
              onClick={() => navigate(-1)}
              className="mb-3"
            >
              <ArrowLeft size={24} />
            </Button>
            <Heading
              title={`Create new Event`}
              description="Create an event for your university"
            />
            <div>
              <div className="p-4 mx-7">
                <Form {...form}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      form.handleSubmit(onSubmit, onError)();
                    }}
                  >
                    {/* <div className="w-full">
            
            </div> */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => {
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
                      <div className="grid grid-cols-2 gap-5">
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
                                  value={initialData?.eventName}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
                                    const value = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
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
                        <FormField
                          control={form.control}
                          name="trainingPoint"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Training Point</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} min={0} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="fieldIds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Field</FormLabel>
                              <FormControl>
                                <FieldPicker
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="maxParticipants"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Particitipant</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} min={0} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="eventType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event's type</FormLabel>
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
                                      <SelectLabel>{field.value}</SelectLabel>
                                      <SelectItem value={"PUBLIC"}>
                                        PUBLIC
                                      </SelectItem>
                                      <SelectItem value={"PRIVATE"}>
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
                                          !field.value &&
                                            "text-muted-foreground"
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
                                      disabled={(date) =>
                                        date <
                                        new Date(
                                          new Date().setHours(0, 0, 0, 0)
                                        )
                                      }
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
                              <FormLabel className="mb-2">
                                Register end date
                              </FormLabel>
                              <div className="flex-1">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "text-left font-normal w-full",
                                          !field.value &&
                                            "text-muted-foreground"
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
                                      disabled={(date) => {
                                        const startDate = form.watch(
                                          "registeredStartDate"
                                        );
                                        return startDate
                                          ? date <
                                              new Date(
                                                startDate.setHours(0, 0, 0, 0)
                                              )
                                          : date < new Date();
                                      }}
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
                      <div className="grid grid-col-2 gap-5 w-1/2">
                        <FormField
                          control={form.control}
                          name="walletId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Wallet</FormLabel>
                              <FormControl>
                                <EventWalletPicker
                                  value={field.value}
                                  onChange={(selectedWalletId) =>
                                    field.onChange(selectedWalletId)
                                  }
                                  price={form.watch("price")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="eventAreas"
                        render={(field) => (
                          <FormItem className="mt-2">
                            {/* Tiêu đề chung */}
                            <FormLabel className="mt-2  text-gray-800">
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

                                      {/* Date */}
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
                                        <div className="flex gap-2">
                                          <Input
                                            type="time"
                                            {...field}
                                            value={item.StartTime} // Gán giá trị StartTime hiện tại
                                            onChange={(e) => {
                                              const value = e.target.value; // Lấy giá trị từ input (theo định dạng HH:mm)
                                              update(index, {
                                                ...item,
                                                StartTime: value, // Cập nhật lại giá trị StartTime với giờ và phút
                                              });
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* End Time */}
                                      <div className="w-full sm:w-auto flex-1 min-w-[100px]">
                                        <FormLabel>End Time</FormLabel>
                                        <Input
                                          type="time"
                                          {...field}
                                          value={item.EndTime} // Gán giá trị EndTime hiện tại
                                          onChange={(e) => {
                                            const value = e.target.value; // Lấy giá trị từ input (theo định dạng HH:mm)
                                            update(index, {
                                              ...item,
                                              EndTime: value, // Cập nhật lại giá trị EndTime với giờ và phút
                                            });
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {/* Nút thêm Area mới */}
                                <Button
                                  type="button"
                                  variant="custom"
                                  onClick={() =>
                                    append({
                                      AreaId: "",
                                      Date: new Date(),
                                      StartTime: "8",
                                      EndTime: "17",
                                    })
                                  }
                                  className="inline-flex w-fit items-center justify-center px-4 py-2 text-sm font-medium text-white  rounded-md shadow-sm  transition-colors"
                                >
                                  Add Area
                                </Button>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

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
                      <FormField
                        control={form.control}
                        name="clubs"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <div className="">
                              <div className="flex items-center gap-2">
                                <Label
                                  htmlFor="event-type"
                                  className="text-base italic font-semibold text-[#3ca1a2]"
                                >
                                  Create Inter-Club Event
                                </Label>
                                <Checkbox
                                  id="event-type"
                                  checked={isClubEvent}
                                  onCheckedChange={(checked) => {
                                    setIsClubEvent(checked as boolean);
                                  }}
                                />
                              </div>
                            </div>
                            {isClubEvent && (
                              <div className="space-y-4">
                                <FormLabel>Assigned Clubs</FormLabel>
                                <FormMessage>
                                  {form.formState.errors.clubs?.message}
                                </FormMessage>
                                <div className="flex items-center gap-4">
                                  <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                      placeholder="Search clubs..."
                                      value={searchQuery}
                                      onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                      }
                                      className="pl-9 bg-gray-50 border-gray-200"
                                    />
                                  </div>
                                </div>

                                <ScrollArea className="h-[150px] rounded-md border">
                                  <div className="p-4 space-y-2">
                                    {isArray(availableClubs) &&
                                      availableClubs
                                        .filter((club: AvailableClubResponse) =>
                                          club.clubName
                                            .toLowerCase()
                                            .includes(searchQuery.toLowerCase())
                                        )
                                        .map((club: AvailableClubResponse) => (
                                          <div
                                            key={club.clubId}
                                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                          >
                                            <div className="flex items-center gap-3">
                                              {/* Checkbox để chọn club */}
                                              <Checkbox
                                                id={`club-${club.clubId}`}
                                                checked={field.value?.some(
                                                  (c) =>
                                                    c.ClubId === club.clubId
                                                )}
                                                onCheckedChange={(checked) => {
                                                  const currentClubs =
                                                    field.value || [];
                                                  if (checked) {
                                                    // Thêm club mới nếu chưa tồn tại
                                                    if (
                                                      !currentClubs.some(
                                                        (c) =>
                                                          c.ClubId ===
                                                          club.clubId
                                                      )
                                                    ) {
                                                      form.setValue("clubs", [
                                                        ...currentClubs,
                                                        {
                                                          ClubId: club.clubId,
                                                          IsHost: false,
                                                        },
                                                      ]);
                                                    }
                                                  } else {
                                                    // Xóa club nếu bỏ chọn
                                                    form.setValue(
                                                      "clubs",
                                                      currentClubs.filter(
                                                        (c) =>
                                                          c.ClubId !==
                                                          club.clubId
                                                      )
                                                    );
                                                  }
                                                }}
                                              />
                                              <label
                                                htmlFor={`club-${club.clubId}`}
                                                className="flex items-center gap-2 cursor-pointer text-sm"
                                              >
                                                <span className="font-medium">
                                                  {club.clubName}
                                                </span>
                                              </label>
                                            </div>
                                            {/* Checkbox để chọn host */}
                                            <div className="flex items-center gap-2">
                                              <Label
                                                htmlFor={`host-${club.clubId}`}
                                                className="text-sm"
                                              >
                                                Host
                                              </Label>
                                              <Checkbox
                                                id={`host-${club.clubId}`}
                                                checked={field.value?.some(
                                                  (c) =>
                                                    c.ClubId === club.clubId &&
                                                    c.IsHost
                                                )}
                                                onCheckedChange={(checked) => {
                                                  const updatedClubs =
                                                    field.value.map((c) =>
                                                      c.ClubId === club.clubId
                                                        ? {
                                                            ...c,
                                                            IsHost:
                                                              checked as boolean,
                                                          }
                                                        : c
                                                    );
                                                  form.setValue(
                                                    "clubs",
                                                    updatedClubs
                                                  );
                                                }}
                                                disabled={
                                                  !field.value?.some(
                                                    (c) =>
                                                      c.ClubId === club.clubId
                                                  )
                                                }
                                              />
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                type="button"
                                                className="h-8 w-8 hover:bg-gray-100"
                                                onClick={() => {
                                                  setSelectedClub(club);
                                                  setOpenDialog(true);
                                                }}
                                              >
                                                <Eye className="h-4 w-4 text-gray-500" />
                                              </Button>
                                            </div>
                                          </div>
                                        ))}
                                  </div>
                                </ScrollArea>
                              </div>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex w-full justify-end mt-4">
                      <Button type="submit" disabled={isLoading}>
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
            </div>
          </>
        )}
      </div>
      <ClubInfoDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedClub={selectedClub as AvailableClubResponse}
      />
    </>
  );
};
