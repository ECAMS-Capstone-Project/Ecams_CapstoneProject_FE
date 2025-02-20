import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DialogClose } from "@radix-ui/react-dialog";
import { CheckCircle, XCircle } from "lucide-react";

// Interface User
export interface User {
  userId: string;
  email: string;
  fullname: string;
  address: string;
  phonenumber: string;
  gender: string;
  avatar: string;
  status: string;
  isVerified: boolean;
}

interface UserDetailDialogProps {
  initialData: User | null;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}

const MemberDetailDialog: React.FC<UserDetailDialogProps> = ({ initialData }) => {
  const form = useForm<User>({
    defaultValues: initialData || {
      userId: "",
      email: "",
      fullname: "",
      address: "",
      phonenumber: "",
      gender: "",
      avatar: "",
      status: "Inactive",
      isVerified: false,
    },
  });

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">User Detail</h2>

      {/* Avatar */}
      <div className="flex justify-center">
        <Avatar className="w-20 h-20">
          <AvatarImage src={"https://github.com/shadcn.png"} alt={initialData?.fullname} />
        </Avatar>
      </div>

      <Form {...form}>
        <form className="grid grid-cols-2 gap-4 mt-4">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name:</FormLabel>
                <FormControl>
                  <Input {...field} readOnly className="bg-gray-100" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input {...field} readOnly className="bg-gray-100" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phonenumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number:</FormLabel>
                <FormControl>
                  <Input {...field} readOnly className="bg-gray-100" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address:</FormLabel>
                <FormControl>
                  <Input {...field} readOnly className="bg-gray-100" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    readOnly
                    className={`bg-gray-100 ${field.value === "Male" ? "text-blue-500" : "text-pink-500"}`}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    readOnly
                    className={`bg-gray-100 ${field.value === "Active" ? "text-green-500" : "text-red-500"}`}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Verified */}
          <div className="flex flex-col col-span-2">
            <FormLabel>Verified:</FormLabel>
            <div className="flex items-center gap-2 p-2 rounded-md w-full bg-gray-100">
              {initialData?.isVerified ? (
                <CheckCircle size={20} className="text-green-500" />
              ) : (
                <XCircle size={20} className="text-red-500" />
              )}
              <span>{initialData?.isVerified ? "Verified" : "Not Verified"}</span>
            </div>
          </div>

          {/* Close Button */}
          <div className="col-span-2 flex justify-end">
            <DialogClose asChild>
              <Button type="button" className="bg-gray-500 text-white">
                Close
              </Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MemberDetailDialog;
