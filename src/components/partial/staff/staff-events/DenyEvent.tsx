/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import DialogLoading from "@/components/ui/dialog-loading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEvents } from "@/hooks/staff/Event/useEvent";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const DenySchema = z.object({
  eventId: z.string().uuid(), //
  reason: z.string().min(1, { message: "Reason is Required" }),
});

type DenyUniversity = z.infer<typeof DenySchema>;

interface DenyProps {
  eventId: string;
  onClose: () => void; // Hàm để đóng dialog
  onSuccess?: () => void; // Hàm để tải lại danh sách
  dialogAction: string;
}
export const DenyEventRequest: React.FC<DenyProps> = ({
  eventId,
  onClose,
  onSuccess,
  dialogAction,
}) => {
  const [, setIsLoading] = useState(false);
  const form = useForm<DenyUniversity>({
    resolver: zodResolver(DenySchema),
    defaultValues: {
      eventId: eventId,
      reason: "",
    },
  });
  const navigate = useNavigate();
  const { rejectEvent, isRejecting } = useEvents();
  async function handleReject(value: DenyUniversity) {
    try {
      setIsLoading(true); // Bắt đầu loading
      if (dialogAction === "reject") {
        console.log("Rejecting university...");

        await rejectEvent(value); // Gọi API reject
        navigate("/representative/event");
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      const errorMessage = error.response.data.message || "An error occurred";
      console.log(errorMessage);
    } finally {
      setIsLoading(false); // Tắt loading
    }
  }

  return (
    <DialogContent className="max-w-lg min-h-[200px] sm:min-h-[300px] h-auto">
      {isRejecting ? (
        <div className="flex justify-center items-center h-full w-full">
          <DialogLoading />
        </div>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>Give your reason</DialogTitle>
            <DialogDescription>
              Giving the reason for this action.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleReject)}>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-gray-800 mb-2">
                          Reason
                        </FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            value={field.value ?? ""}
                            className="w-full rounded-md border border-gray-300 p-4 text-gray-700 focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your reason for rejection"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" color="primary">
                    {dialogAction === "reject" ? "Reject" : "Deactivate"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </>
      )}
    </DialogContent>
  );
};
