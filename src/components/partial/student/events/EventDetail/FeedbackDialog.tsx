/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { FeedbackRequest } from "@/models/Feedback";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rating } from "@mui/material";
import { useFeedback } from "@/hooks/student/useFeedback";

const feedbackSchema = z.object({
  content: z.string().min(1, "Please enter feedback content"),
  rating: z.coerce
    .number()
    .min(1, "Please select a rating")
    .max(10, "Maximum rating is 10 stars"),
});

export default function FeedbackDialog({
  studentId,
  eventId,
}: {
  studentId: string;
  eventId: string;
}) {
  const [, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { createFeedbackQuery, isPending } = useFeedback();
  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      content: "",
      rating: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof feedbackSchema>) => {
    try {
      setIsSubmitting(true);
      const feedbackRequest: FeedbackRequest = {
        studentId,
        eventId,
        content: values.content,
        rating: values.rating,
      };

      await createFeedbackQuery(feedbackRequest);
      form.reset();
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["feedback", eventId] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error sending feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Send Feedback</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-xl overflow-hidden border-none shadow-xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#136CB5]/10 to-[#49BBBD]/10 rounded-t-xl" />
            <DialogHeader className="relative p-4">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#136CB5] to-[#49BBBD] bg-clip-text text-transparent">
                Send Feedback
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                Please share your thoughts about the event
              </DialogDescription>
            </DialogHeader>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 p-6"
            >
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2">
                      <FormLabel className="text-gray-700 font-medium">
                        Rating
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-[#136CB5]/5 to-[#49BBBD]/5">
                          <Rating
                            value={field.value}
                            onChange={field.onChange}
                            max={10}
                            precision={1}
                            sx={{
                              "& .MuiRating-iconHover": {
                                color: "#49BBBD",
                              },
                            }}
                          />
                          <span className="text-sm text-gray-500">
                            {field.value}/10
                          </span>
                        </div>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Feedback Content
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your thoughts about the event..."
                        className="min-h-[120px] resize-none border-gray-200 focus:border-[#136CB5] focus:ring-1 focus:ring-[#136CB5] transition-all duration-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#136CB5] to-[#49BBBD] text-white hover:from-[#136CB5]/90 hover:to-[#49BBBD]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
