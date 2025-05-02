/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, fixTime } from "@/lib/utils";
import { ArrowLeft, CalendarIcon, Trash2Icon } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import { Heading } from "@/components/ui/heading";

import { useAreas } from "@/hooks/staff/Area/useArea";
import { updateEvent } from "@/api/representative/EventAgent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaPicker,
  DatePicker,
} from "@/components/partial/staff/staff-events/AreaPicker";
const EventSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),

  endDate: z.date({
    required_error: "End date is required",
  }),
  registeredStartDate: z.date({
    required_error: "Registration start date is required",
  }),
  registeredEndDate: z.date({
    required_error: "Registration end date is required",
  }),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  maxParticipants: z
    .number()
    .min(1, "Maximum participants must be greater than 0"),
  trainingPoint: z
    .number()
    .min(0, "Training points must be greater than or equal to 0"),
  eventAreas: z.array(
    z.object({
      AreaId: z.string(),
      Date: z.coerce.date(),
      StartTime: z.string(),
      EndTime: z.string(),
    })
  ),
  FieldIds: z.array(z.string()).min(1, "At least one field is required"),
  ImageUrl: z.union([
    z.string().url("Invalid image URL").optional(), // Nếu có URL ảnh
    z
      .instanceof(File)
      .refine((file) => file instanceof File, {
        message: "Image must be a file", // Kiểm tra nếu là file ảnh
      })
      .optional(),
  ]),
  status: z.string().optional(),
});

// type EventFormValues = z.infer<typeof EventSchema>;

export function ClubEditEventForm() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { getEventDetailQuery } = useEvents();
  const { data: eventDetail } = getEventDetailQuery(
    eventId ?? "",
    user?.userId ?? ""
  );
  const event = eventDetail?.data;
  const { areas } = useAreas(1, 999, user?.universityId); // Lấy mutation từ React Query

  const form = useForm<z.infer<typeof EventSchema>>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      eventName: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      registeredStartDate: new Date(),
      registeredEndDate: new Date(),
      price: 0,
      maxParticipants: 0,
      trainingPoint: 0,
      FieldIds: [],
      ImageUrl: "",
      status: "",
    },
  });
  console.log("form", form.formState.errors);

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "eventAreas",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        setIsLoading(true);

        form.reset({
          eventName: event?.eventName,
          description: event?.description,
          eventAreas: event?.eventAreas?.map((area) => ({
            AreaId: area.areaId,
            Date: new Date(area.date),
            StartTime: area.startTime,
            EndTime: area.endTime,
          })),
          startDate: event?.startDate ? new Date(event?.startDate) : new Date(),
          endDate: event?.endDate ? new Date(event?.endDate) : new Date(),
          registeredStartDate: event?.registeredStartDate
            ? new Date(event?.registeredStartDate)
            : new Date(),
          registeredEndDate: event?.registeredEndDate
            ? new Date(event?.registeredEndDate)
            : new Date(),
          price: event?.price,
          maxParticipants: event?.maxParticipants,
          trainingPoint: event?.trainingPoint,
          FieldIds: event?.eventFields?.map((field) => field.fieldId) || [],
          ImageUrl: event?.imageUrl || "",
        });
      } catch (error) {
        console.log(error);
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, form, navigate, event]);
  const onSubmit = async () => {
    if (!eventId) return;
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("eventId", eventId);
      formData.append("eventName", form.getValues("eventName"));
      formData.append("description", form.getValues("description"));
      formData.append(
        "startDate",
        fixTime(form.getValues("startDate")).toISOString()
      );
      formData.append(
        "endDate",
        fixTime(form.getValues("endDate")).toISOString()
      );
      formData.append(
        "registeredStartDate",
        fixTime(form.getValues("registeredStartDate")).toISOString()
      );
      formData.append(
        "registeredEndDate",
        fixTime(form.getValues("registeredEndDate")).toISOString()
      );
      formData.append(
        "price",
        form.getValues("price").toString() || event?.price?.toString() || "0"
      );
      formData.append(
        "maxParticipants",
        form.getValues("maxParticipants").toString() ||
          event?.maxParticipants?.toString() ||
          "0"
      );
      formData.append(
        "trainingPoint",
        form.getValues("trainingPoint").toString() ||
          event?.trainingPoint?.toString() ||
          "0"
      );
      formData.append("status", event?.status || "");
      // Xử lý ImageUrl

      // Kiểm tra và xử lý ImageUrl
      const imageValue = form.getValues("ImageUrl");
      if (imageValue instanceof File) {
        formData.append("ImageUrl", imageValue);
      } else if (event?.imageUrl) {
        formData.append("ImageUrl", event.imageUrl);
      } else {
        formData.append("ImageUrl", "");
      }

      const formattedEventAreas = form.getValues("eventAreas")
        ? form.getValues("eventAreas").map((area) => ({
            AreaId: area.AreaId,
            Date: format(area.Date, "yyyy-MM-dd"),
            StartTime: area.StartTime,
            EndTime: area.EndTime,
          }))
        : event?.eventAreas?.map((area) => ({
            AreaId: area.areaId,
            Date: format(area.date, "yyyy-MM-dd"),
            StartTime: area.startTime,
            EndTime: area.endTime,
          }));
      const formattedClubs = event?.clubs?.map((club) => ({
        ClubId: club.clubId,
        IsHost: club.isHost,
      }));

      formData.append("Clubs", JSON.stringify(formattedClubs));
      formData.append("UniversityId", user?.universityId || "");
      formData.append("EventArea", JSON.stringify(formattedEventAreas));

      // Xử lý FieldIds
      const fieldIds = form.getValues("FieldIds");
      if (!fieldIds || fieldIds.length === 0) {
        toast.error("Please select at least one field for the event");
        return;
      }
      fieldIds.forEach((fieldId, index) => {
        formData.append(`FieldIds[${index}]`, fieldId);
      });

      const response = await updateEvent(formData);
      console.log("response", response);
      if (response.statusCode === 204) {
        toast.success("Event updated successfully");
        navigate(-1);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <>
      <div className="flex justify-start items-center gap-2">
        <ArrowLeft
          size={24}
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        />
        <Heading title={`Edit Event`} description={`Edit event details`} />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="ImageUrl"
            render={({ field }) => {
              const [preview, setPreview] = useState<string | null>(
                event?.imageUrl ? String(event.imageUrl) : null
              );
              const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <FormField
            control={form.control}
            name="eventName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter event description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="registeredStartDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Registration Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select date</span>
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
                        disabled={(date) =>
                          date < form.getValues("registeredStartDate")
                        }
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
              name="registeredEndDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Registration End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select date</span>
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
                        disabled={(date) =>
                          date < form.getValues("registeredStartDate")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter ticket price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <FormLabel>Maximum Participants</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter maximum participants"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <FormLabel>Training Points</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter training points"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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

                        <div className="flex flex-wrap items-end gap-3">
                          <div className="w-full sm:w-auto flex-1 min-w-[100px]">
                            <AreaPicker
                              item={item}
                              index={index}
                              update={(index, value) => {
                                update(index, value);
                              }}
                              areas={areas}
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
                                  <SelectItem key={i} value={i.toString()}>
                                    {`${i}:00`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

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
                                  <SelectItem key={i} value={i.toString()}>
                                    {`${i}:00`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}

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
                      className="inline-flex w-fit items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm transition-colors"
                    >
                      Add Area
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Event"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
