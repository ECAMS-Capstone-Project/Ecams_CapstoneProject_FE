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
import { useState } from "react";
import { NotificationSchema } from "@/schema/NotiSchema";
import { useNotification } from "@/hooks/admin/useNoti";

type NotificationFormValues = z.infer<typeof NotificationSchema>;

interface NotiDialogProps {
  initialData: NotificationFormValues | null;
  onClose?: () => void;
}

export const ViewNotiDialog: React.FC<NotiDialogProps> = ({
  initialData,
  onClose,
}) => {
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(NotificationSchema),
    defaultValues: initialData || {
      notificationType: "SYSTEM",
      message: "",
    },
  });
  // const [isLoading, setIsLoading] = useState(false);
  const [, setOpen] = useState(false);
  const { createNotification, isCreating } = useNotification();
  // const [open, setOpen] = useState(false)
  console.log("Form Errors:", form.formState.errors);

  async function onSubmit(values: NotificationFormValues) {
    console.log("create notification", values);

    try {
      await createNotification(values);
      toast.success("Notification created successfully.");
      setOpen(false);
      onClose && onClose();
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Error:", error);
    }
  }

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
              {initialData
                ? "View Notification Details"
                : "Add New System's Notification"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {initialData
              ? "View notification details below."
              : "Fill out the form below to add a new system's notification."}
          </DialogDescription>
          <div>
            <div className="p-4">
              <Form {...form}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault(); // Chặn mặc định để kiểm tra
                    console.log("Form Submitted!");
                    form.handleSubmit(onSubmit)();
                  }}
                >
                  <div className="grid grid-cols-1 gap-3">
                    {/* Package Name */}
                    <FormField
                      control={form.control}
                      name="notificationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <textarea
                              className="border p-2 rounded w-full h-30"
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
                      <Button type="submit">Create Notification</Button>
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
