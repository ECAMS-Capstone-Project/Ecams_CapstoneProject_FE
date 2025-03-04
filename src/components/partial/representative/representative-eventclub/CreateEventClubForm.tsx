/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
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
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DialogLoading from "@/components/ui/dialog-loading";
import { useEffect, useState } from "react";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import { getCurrentUserAPI } from "@/api/auth/LoginAPI";

import { EventClubSchema } from "@/schema/EventSchema";
import { useEvents } from "@/hooks/staff/Event/useEvent";

type EventClubFormValues = z.infer<typeof EventClubSchema>;

interface AreaDialogProps {
  initialData: EventClubFormValues | null;
  onSuccess?: () => void; // Callback để reload data sau khi tạo area
  setOpen?: (open: boolean) => void; // Nhận state từ component cha
}

export const CreateEventClubDialog: React.FC<AreaDialogProps> = ({
  initialData,
  onSuccess,
  setOpen,
}) => {
  const [, setUserInfo] = useState<UserAuthDTO>();
  const [isLoading, setIsLoading] = useState(false);

  // Chỉ fetch thông tin user khi cần thiết
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getCurrentUserAPI();
        if (userInfo) {
          setUserInfo(userInfo.data);
          form.setValue("userId", userInfo.data?.userId ?? "");
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    if (!initialData) {
      fetchUserInfo();
    }
  }, [initialData]);
  const { createEventClub, isCreatePending } = useEvents(); // Lấy mutation từ React Query

  const form = useForm<EventClubFormValues>({
    resolver: zodResolver(EventClubSchema),
    defaultValues: initialData || {
      userId: "",
      clubName: "",
      description: "",
      purpose: "",
      ownerEmail: "",
    },
  });

  // Handle form submit
  const onSubmit = async (values: EventClubFormValues) => {
    console.log("Form Submitted with values:", values);
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("UserId", values.userId ?? "");
      formData.append("ClubName", values.clubName ?? "");
      formData.append("Purpose", values.purpose);

      formData.append("Description", values.description);
      formData.append("OwnerEmail", values.ownerEmail);

      if ((values.logo as any) instanceof File) {
        formData.append("Logo", values.logo ?? "");
      }

      // Nếu không có `initialData`, gọi API `createArea`
      await createEventClub(formData);

      if (!isCreatePending) {
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

  return (
    <div className="min-h-[200px] sm:min-h-[300px] h-auto sm:min-w-[300px]">
      {isCreatePending ? (
        <div className="flex justify-center items-center h-full w-full">
          <DialogLoading />
        </div>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit Area" : "Add New Area"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {initialData
              ? "Edit area details below."
              : "Fill out the form below to add a new area."}
          </DialogDescription>
          <div>
            <div className="p-4">
              <Form {...form}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)();
                  }}
                >
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Image</FormLabel>
                          <FormControl>
                            {/* Nếu có ảnh, hiển thị ảnh hiện tại */}
                            <>
                              <img
                                src={String(field.value)} // Hiển thị ảnh từ URL
                                alt="Current Image"
                                className="w-full h-52 object-contain mb-4"
                                onChange={field.onChange}
                              />
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
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="clubName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ownerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Club owner email</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
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
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose</FormLabel>
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
                  {/* <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem className="w-fit">
                        <FormLabel>Upload Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <div className="flex w-full justify-end mt-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading
                        ? initialData
                          ? "Updating..."
                          : "Creating..."
                        : initialData
                        ? "Update Event Club"
                        : "Create Event Club"}
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
