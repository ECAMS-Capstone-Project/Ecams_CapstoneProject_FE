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
import { editPackageSchema } from "@/schema/PackageSchema";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
// import { useState } from "react";

import { createPackage } from "@/api/agent/PackageAgent";
import DialogLoading from "@/components/ui/dialog-loading";
import { useState } from "react";
import { StudentSchema } from "@/schema/UserSchema";

type StudentFormValues = z.infer<typeof StudentSchema>;

interface StudentDialogProps {
  initialData: StudentFormValues | null | undefined;
}

export const ViewStudentDialog: React.FC<StudentDialogProps> = ({
  initialData,
}) => {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(editPackageSchema),
    defaultValues: initialData || {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [, setOpen] = useState(false);
  // const [open, setOpen] = useState(false)
  const { control, handleSubmit } = form;

  async function onSubmit(values: StudentFormValues) {
    try {
      setIsLoading(true);
      console.log("Adding New Package:", values);
      await createPackage(values);
      toast.success("Package created successfully.");
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

  return (
    <div className=" min-h-[200px] sm:min-h-[300px] h-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-full w-full">
          <DialogLoading />
        </div>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "View Student Details" : "Add New Package"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {initialData
              ? "View student details below."
              : "Fill out the form below to add a new package."}
          </DialogDescription>
          <div>
            <div className="p-4">
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Package Name */}

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

                    {/* Price */}
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
                    <FormField
                      control={control}
                      name="universityName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>University</FormLabel>
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
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
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
                              value={field.value}
                              // onChange={(e) => field.onChange(e.target.value)}
                              readOnly={!!initialData}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phonenumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
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
                      <Button type="submit">Add Package</Button>
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
