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
  DialogClose,
} from "@/components/ui/dialog";
import DialogLoading from "@/components/ui/dialog-loading";
import { useEffect, useState } from "react";
import { PolicySchema } from "@/schema/PolicySchema";
import Select from "react-select";
import { Role } from "@/models/User";
import { roleList } from "@/api/agent/UserAgent";
import { usePolicy } from "@/hooks/admin/usePolicy";

type PolicyFormValues = z.infer<typeof PolicySchema>;

interface PolicyDialogProps {
  initialData: PolicyFormValues | null;
  onClose?: () => void;
}

export const EditPolicyDialog: React.FC<PolicyDialogProps> = ({
  initialData,
  onClose,
}) => {
  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(PolicySchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      status: true,
      effectiveAt: new Date(),
      roleName: [""],
    },
  });
  const [, setOpen] = useState(false);
  const [role, setRole] = useState<Role[]>([]);
  const { control, handleSubmit } = form;
  const { createPolicy, isCreating } = usePolicy();
  async function onSubmit(values: PolicyFormValues) {
    console.log("Adding New Policy:", values);
    try {
      console.log("Adding New Policy:", values);
      await createPolicy(values);
      toast.success("Policy created successfully.");
      setOpen(false);
      onClose && onClose();
    } catch (error: any) {
      const errorMessage = error.response.data.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Error:", error);
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
      {isCreating ? (
        <div className="flex justify-center items-center h-full w-full">
          <DialogLoading />
        </div>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "View Policy Details" : "Add New Policy"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {initialData
              ? "View the policy details below."
              : "Fill out the form below to add a new policy."}
          </DialogDescription>
          <div>
            <div className="p-4">
              <Form {...form}>
                <form
                  onSubmit={(e) => {
                    console.log("Form submitted!");
                    handleSubmit(onSubmit)(e);
                  }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {/* Package Name */}
                    <FormField
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
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
                      name="effectiveAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Effective Date</FormLabel>
                          <FormControl>
                            <Input
                              type="Date"
                              {...field}
                              value={
                                field.value
                                  ? String(field.value).split("T")[0] // Chỉ lấy phần ngày (YYYY-MM-DD) của chuỗi ISO
                                  : ""
                              }
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
                      name="roleName"
                      render={({ field }) => {
                        // Chuyển đổi roleName từ initialData thành định dạng cho react-select
                        const defaultRoles = initialData?.roleName
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
                                name="roleName"
                                options={role
                                  .filter((role) => role.roleName !== "ADMIN")
                                  .map((roleItem) => ({
                                    label: roleItem.roleName,
                                    value: roleItem.roleId,
                                  }))}
                                onChange={(selected) => {
                                  field.onChange(
                                    selected.map((item) => item?.value)
                                  );
                                }}
                                className="h-fit"
                                classNamePrefix="select"
                                isDisabled={!!initialData}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
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
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex w-full justify-end mt-4 ">
                    {!initialData ? (
                      <Button type="submit">Create policy</Button>
                    ) : (
                      <DialogClose>
                        <Button type="button">Quit</Button>
                      </DialogClose>
                    )}
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
