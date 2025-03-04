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
import { AreaSchema } from "@/schema/AreaSchema";
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

type AreaFormValues = z.infer<typeof AreaSchema>;

interface AreaDialogProps {
  initialData: AreaFormValues | null;
  onSuccess?: () => void; // Callback để reload data sau khi tạo area
  setOpen?: (open: boolean) => void; // Nhận state từ component cha
}

export const EditAreaDialog: React.FC<AreaDialogProps> = ({
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
          form.setValue("universityId", userInfo.data?.universityId ?? "");
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    if (!initialData) {
      fetchUserInfo();
    }
  }, [initialData]);
  const { createArea, isPending, updateArea, isUpdating } = useAreas(); // Lấy mutation từ React Query

  const form = useForm<AreaFormValues>({
    resolver: zodResolver(AreaSchema),
    defaultValues: initialData || {
      universityId: "",
      name: "",
      description: "",
      capacity: 0,
    },
  });

  // Handle form submit
  const onSubmit = async (values: AreaFormValues) => {
    console.log("Form Submitted with values:", values);
    try {
      setIsLoading(true);
      const formData = new FormData();
      if (initialData) {
        formData.append("AreaId", values.areaId ?? "");
        formData.append("ImageUrl", values.imageUrl ?? "");
        // Chuyển đổi status từ boolean sang string
      }
      if (initialData == null) {
        formData.append("UniversityId", values.universityId);
      }

      formData.append("Name", values.name);
      formData.append("Description", values.description ?? "");
      formData.append("Capacity", values.capacity.toString());

      if ((values.imageUrl as any) instanceof File) {
        formData.append("ImageUrl", values.imageUrl ?? "");
      }

      if (initialData) {
        // Nếu có `initialData`, gọi API `updateArea`
        await updateArea(formData); // Gọi API update
      } else {
        // Nếu không có `initialData`, gọi API `createArea`
        await createArea(formData);
      }
      if (!isPending || !isUpdating) {
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
      {isPending || isUpdating ? (
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
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Image</FormLabel>
                          <FormControl>
                            {/* Nếu có ảnh, hiển thị ảnh hiện tại */}
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
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="name"
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
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {initialData ? (
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <Select
                                {...field}
                                value={
                                  field.value
                                    ? field.value.toString()
                                    : undefined
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={
                                      field.value ? "Active" : "Inactive"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>{field.value}</SelectLabel>
                                    <SelectItem value={true.toString()}>
                                      Active
                                    </SelectItem>
                                    <SelectItem value={false.toString()}>
                                      Inactive
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      ""
                    )}
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
                        ? "Update Area"
                        : "Create Area"}
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
