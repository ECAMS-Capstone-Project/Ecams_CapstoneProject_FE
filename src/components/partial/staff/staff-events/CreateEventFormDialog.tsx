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
import { ArrowLeft, CalendarIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { AreaPicker, DatePicker } from "./AreaPicker";
import { Heading } from "@/components/ui/heading";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "@/components/ui/loading";
import EventWalletPicker from "./WalletPicker";

type EventFormValues = z.infer<typeof EventSchema> & {
  eventAreas: {
    areaId: string;
    startDate: Date;
    endDate: Date;
  }[];
};

interface EventDialogProps {
  initialData?: EventFormValues | null;
  onSuccess?: () => void; // Callback để reload data sau khi tạo area
  setOpen?: (open: boolean) => void; // Nhận state từ component cha
}

export const CreateEvent: React.FC<EventDialogProps> = ({
  initialData,
  onSuccess,
  setOpen,
}) => {
  const [userInfo, setUserInfo] = useState<UserAuthDTO>();
  const [isLoading, setIsLoading] = useState(false);

  // Chỉ fetch thông tin user khi cần thiết
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getCurrentUserAPI();
        if (userInfo) {
          setUserInfo(userInfo.data);
          form.setValue("universityId", userInfo.data?.universityId ?? "");
          form.setValue(
            "representativeId",
            userInfo.data?.representativeId ?? ""
          );
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    if (!initialData) {
      fetchUserInfo();
    }
  }, [initialData]);

  const { areas } = useAreas(1, 10, userInfo?.universityId); // Lấy mutation từ React Query
  const { createEvent, isPending } = useEvents();
  const navigate = useNavigate();
  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventSchema),
    defaultValues: initialData || {
      universityId: "",
      representativeId: "",
      clubId: "",
      walletId: "",
      eventName: "",
      imageUrl: "",
      description: "",
      registeredStartDate: new Date(),
      registeredEndDate: new Date(),
      price: 0,
      maxParticipants: 0,
      eventAreas: [{ areaId: "", startDate: new Date(), endDate: new Date() }],
      eventType: "",
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "eventAreas", // Liên kết với mảng eventAreas
  });

  // Handle form submit
  const onSubmit = async (values: EventFormValues) => {
    console.log("Form Submitted with values:", values);

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("RepresentativeId", values.representativeId ?? "");
      formData.append("UniversityId", values.universityId);
      formData.append("EventName", values.eventName);
      formData.append("Description", values.description ?? "");
      formData.append(
        "RegisteredStartDate",
        values.registeredStartDate.toISOString()
      );
      formData.append("WalletId", values.walletId ?? "");
      formData.append(
        "RegisteredEndDate",
        values.registeredEndDate.toISOString()
      );
      formData.append("Price", values.price.toString());
      formData.append("MaxParticipants", values.maxParticipants.toString());
      formData.append("EventType", values.eventType);

      if ((values.imageUrl as any) instanceof File) {
        formData.append("ImageUrl", values.imageUrl ?? "");
      }

      // Format eventAreas before appending to formData
      const formattedEventAreas = values.eventAreas.map((area) => ({
        AreaId: area.areaId,
        StartDate: area.startDate,
        EndDate: area.endDate,
      }));
      formData.append("EventArea", JSON.stringify(formattedEventAreas));

      if (initialData) {
        // Nếu có `initialData`, gọi API `updateArea`
        // await updateArea(formData); // Gọi API update
      } else {
        // Nếu không có `initialData`, gọi API `createArea`
        await createEvent(formData);
      }
      navigate("/representative/event");
      if (!isPending) {
        setOpen && setOpen(false); // Đóng dialog sau khi submit thành công
      }
      onSuccess && onSuccess(); // Callback reload data nếu cần
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const onError = (errors: any) => {
    // Nếu lỗi validation từ zod được gắn vào eventAreas, hiển thị toast.error
    if (errors.eventAreas) {
      // Nếu lỗi được gắn vào _error hoặc trực tiếp vào message
      const message =
        errors.eventAreas._error?.message ||
        errors.eventAreas.message ||
        "Area is not allowed to be duplicated.";
      toast.error(message);
    }
  };
  return (
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
            description="Create a new Event in the system"
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
                      {/* <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Upload Image</FormLabel>
                            <FormControl>
                        
                              <>
                                {initialData && initialData.imageUrl && (
                                  <img
                                    src={String(initialData.imageUrl)} // Hiển thị ảnh từ URL
                                    alt="Current Image"
                                    className="w-full h-52 object-contain mb-4"
                                    onChange={field.onChange}
                                  />
                                )}
                                <Input
                                  className="w-60"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      field.onChange(file); // Cập nhật ảnh mới khi người dùng chọn file mới
                                    } else {
                                      // Nếu không chọn ảnh mới, giữ nguyên ảnh cũ (không thay đổi state của ảnh)
                                      field.onChange(null);
                                    }
                                  }} // Lưu file vào state nếu có file mới
                                />
                              </>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}
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
                      <FormField
                        control={form.control}
                        name="maxParticipants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Particitipant</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
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

                      {/* Hiển thị ngày bắt đầu và kết thúc cho mỗi khu vực */}
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
                                    variant={"outline"}
                                    className={cn(
                                      " text-left font-normal",
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

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="registeredEndDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Registered Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
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
                              <PopoverContent
                                className="w-auto p-0"
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

                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                                variant="custom"
                                onClick={() =>
                                  append({
                                    areaId: "",
                                    startDate: new Date(),
                                    endDate: new Date(),
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
  );
};
