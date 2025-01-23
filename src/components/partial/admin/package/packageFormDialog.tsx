/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { useForm } from "react-hook-form";
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
import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { editPackageSchema } from "@/schema/PackageSchema";

type EditPackageFormValues = z.infer<typeof editPackageSchema>;

interface EditPackageDialogProps {
  initialData: EditPackageFormValues | null; // Dữ liệu ban đầu, có thể null
}

export const EditPackageDialog: React.FC<EditPackageDialogProps> = ({
  initialData,
}) => {
  const form = useForm<EditPackageFormValues>({
    resolver: zodResolver(editPackageSchema),
    defaultValues: initialData || {
      PackageId: "",
      Name: "",
      Price: 0,
      Duration: 0,
      Description: "",
      EndOfSupportDate: "",
    },
  });

  async function onSubmit(values: EditPackageFormValues) {
    try {
      // Gửi API để lưu dữ liệu
      if (initialData) {
        console.log("Updating Package:", values);
        toast.success("Package updated successfully.");
      } else {
        console.log("Adding New Package:", values);
        toast.error("Package created successfully.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Error:", error);
    }
  }

  return (
    <div>
      <DialogHeader>
        <DialogTitle>
          {initialData ? "View Package Details" : "Add New Package"}
        </DialogTitle>
      </DialogHeader>
      <DialogDescription>
        {initialData
          ? "View the package details below."
          : "Fill out the form below to add a new package."}
      </DialogDescription>
      <div className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-3">
              {/* Package ID */}

              {/* Package Name */}
              <FormField
                control={form.control}
                name="Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} readOnly={!!initialData} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="Price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
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

              {/* Description */}
              <FormField
                control={form.control}
                name="Description"
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
              {/* Duration */}
              <FormField
                control={form.control}
                name="Duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Months)</FormLabel>
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
              <FormField
                control={form.control}
                name="Status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        readOnly={!!initialData}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} readOnly={!!initialData} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} readOnly={!!initialData} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* End Of Support Date */}
              <FormField
                control={form.control}
                name="EndOfSupportDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Of Support Date</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} readOnly={!!initialData} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Submit Button */}
            <div className="flex w-full justify-end mt-4 ">
              {initialData ? (
                <DialogClose asChild>
                  <Button className="w-fit ">Quit</Button>
                </DialogClose>
              ) : (
                <Button type="submit" className="w-fit ">
                  Add Package
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
