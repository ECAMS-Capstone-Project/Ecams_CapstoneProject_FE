/* eslint-disable @typescript-eslint/no-unused-vars */
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

import { useEffect, useState } from "react";
import Select from "react-select";
import { Role } from "@/models/User";
import { roleList } from "@/api/agent/UserAgent";
import { UserAuthDTOSchema } from "@/schema/UserSchema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileFormValues = z.infer<typeof UserAuthDTOSchema>;

interface ProfileProps {
  initialData: ProfileFormValues | null;
}

export const ProfileForm: React.FC<ProfileProps> = ({ initialData }) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(UserAuthDTOSchema),
    defaultValues: initialData || {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [, setOpen] = useState(false);
  const [role, setRole] = useState<Role[]>([]);
  const { control, handleSubmit } = form;

  async function onSubmit(values: ProfileFormValues) {
    try {
      setIsLoading(true);
      setOpen(false);
      window.location.reload();
    } catch (error: any) {
      const errorMessage = error.response.data.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    const listRole = async () => {
      try {
        const roleData = await roleList();

        if (Array.isArray(roleData)) {
          setRole(roleData); // Đảm bảo `data.data` tồn tại
        } else {
          console.warn("PolicyList returned no data");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false); // Hoàn tất tải
      }
    };
    listRole(); // Call the function here
  }, []); // Add an empty dependency array to run the effect only once
  // const options = role.map((role) => ({
  //   value: role.roleId,
  //   label: role.roleName,
  // }));

  return (
    <div className=" min-h-[200px] sm:min-h-[300px] h-auto">
      <div>
        <div className="p-4">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                console.log("Form submitted!");
                handleSubmit(onSubmit)(e);
              }}
            >
              <div className="grid grid-cols-1 gap-3 w-2/3">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar Image</FormLabel>
                      <FormControl>
                        <Avatar className="w-32 h-32">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Package Name */}
                <FormField
                  control={control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fullname</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          readOnly={!!initialData}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          readOnly={!!initialData}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Description */}

                {/* Duration */}
                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field }) => {
                    // Chuyển đổi roleName từ initialData thành định dạng cho react-select
                    const defaultRoles = initialData?.roles
                      .map((roleName) => {
                        const option = role.find(
                          (roleItem) => roleItem.roleName === roleName
                        );
                        return option
                          ? { label: option.roleName, value: option.roleId }
                          : null;
                      })
                      .filter(Boolean); // Lọc các giá trị null

                    return (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Select
                            value={defaultRoles} // Sử dụng defaultValue
                            isMulti
                            name="roles"
                            options={role.map((roleItem) => ({
                              label: roleItem.roleName,
                              value: roleItem.roleId,
                            }))}
                            onChange={(selected) => {
                              field.onChange(
                                selected.map((item) => item?.value)
                              );
                            }}
                            className="h-9"
                            classNamePrefix="select"
                            isDisabled={!!initialData}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {/* <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              value={
                                field.value == true ? "Active" : "Inactive"
                              }
                              // onChange={(e) => field.onChange(e.target.value)}
                              readOnly={!!initialData}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full mt-3">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              className="border p-2 rounded w-full h-20"
                              readOnly={!!initialData}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                <div className="flex w-full justify-end mt-4 ">
                  <Button type="submit">Create policy</Button>
                </div>
              </div>
              {/* Submit Button */}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
