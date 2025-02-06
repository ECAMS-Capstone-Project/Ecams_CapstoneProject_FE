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

export interface Transaction {
  transactionId: number;
  methodId: number;
  universityPackageId: number;
  amount: number;
  paymentDate: Date;
  status: string;
}

// Giả định đây là schema Zod cho Transaction
const transactionSchema = z.object({
  transactionId: z.number(),
  methodId: z.number(),
  universityPackageId: z.number(),
  amount: z.number().positive(), // Số tiền phải dương
  paymentDate: z.date(), // Ngày thanh toán
  status: z.string(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface PaymentDialogProps {
  initialData: Transaction | null;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  initialData,
}) => {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialData || {
      transactionId: 0,
      methodId: 0,
      universityPackageId: 0,
      amount: 0,
      paymentDate: new Date(),
      status: "Pending", // Hoặc trạng thái mặc định khác
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit } = form;

  async function onSubmit(values: TransactionFormValues) {
    try {
      setIsLoading(true);
      console.log("Processing Payment:", values);
      // await createPayment(values); // Gọi API tạo payment
      toast.success("Payment processed successfully.");
      // Đóng dialog hoặc làm gì đó sau khi thành công
      window.location.reload(); // Refresh hoặc điều hướng
    } catch (error: any) {
      const errorMessage = error.response.data.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[200px] sm:min-h-[300px] h-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-full w-full">
          <DialogLoading />
        </div>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "View Payment Details" : "Add New Payment"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {initialData
              ? "View the payment details below."
              : "Fill out the form below to process a new payment."}
          </DialogDescription>
          <div>
            <div className="p-4">
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Transaction ID */}
                    <FormField
                      control={form.control}
                      name="transactionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction ID</FormLabel>
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

                    {/* Method ID */}
                    <FormField
                      control={form.control}
                      name="methodId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Method ID</FormLabel>
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

                    {/* University Package ID */}
                    <FormField
                      control={form.control}
                      name="universityPackageId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>University Package ID</FormLabel>
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

                    {/* Amount */}
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
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

                    {/* Payment Date */}
                    <FormField
                      control={form.control}
                      name="paymentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              value={field.value.toString().split("T")[0]}
                              readOnly={!!initialData}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Status */}
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
                      <Button type="submit">Add Payment</Button>
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
