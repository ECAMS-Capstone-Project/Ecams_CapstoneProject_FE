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
import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

import { WalletSchema } from "@/schema/WalletSchema";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type WalletFormValues = z.infer<typeof WalletSchema>;

interface WalletDialogProps {
  initialData: WalletFormValues | null;
  onSuccess?: () => void; // Callback để reload data sau khi tạo area
  setOpen?: (open: boolean) => void; // Nhận state từ component cha
}

export const OnlyViewWalletDialog: React.FC<WalletDialogProps> = ({
  initialData,
}) => {
  const [isLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState<{
    apiKey: boolean;
    clientId: boolean;
    checkSumKey: boolean;
  }>({
    apiKey: false,
    clientId: false,
    checkSumKey: false,
  });

  // Toggle password visibility for a specific field
  const togglePasswordVisibility = (
    field: "apiKey" | "clientId" | "checkSumKey"
  ) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field], // Toggle the visibility for the specific field
    }));
  };
  // Chỉ fetch thông tin user khi cần thiết

  const form = useForm<WalletFormValues>({
    resolver: zodResolver(WalletSchema),
    defaultValues: initialData || {
      apiKey: "",
      clientId: "",
      checkSumKey: "",
      walletName: "",
      universityId: "",
    },
  });

  // Handle form submit
  const onSubmit = async () => {};

  return (
    <div className="min-h-[200px] sm:min-h-[300px] h-auto">
      <>
        <DialogHeader>
          <DialogTitle>View wallet</DialogTitle>
        </DialogHeader>
        <DialogDescription>View wallet's details</DialogDescription>
        <div>
          <div className="p-5">
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)();
                }}
              >
                <div className="grid grid-cols-1 gap-3">
                  <FormField
                    control={form.control}
                    name="walletName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wallet's Name</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank's Name</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <div className="relative rounded-md">
                            <input
                              type={
                                passwordVisibility.apiKey ? "text" : "password"
                              }
                              className={cn(
                                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              )}
                              {...(field ?? "")}
                              placeholder="Enter API Key"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-md text-muted-foreground"
                              onClick={() => togglePasswordVisibility("apiKey")}
                            >
                              {passwordVisibility.apiKey ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Id</FormLabel>
                        <FormControl>
                          <div className="relative rounded-md">
                            <input
                              type={
                                passwordVisibility.clientId
                                  ? "text"
                                  : "password"
                              }
                              className={cn(
                                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              )}
                              {...(field ?? "")}
                              placeholder="Enter Client ID"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-md text-muted-foreground"
                              onClick={() =>
                                togglePasswordVisibility("clientId")
                              }
                            >
                              {passwordVisibility.clientId ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="checkSumKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CheckSumKey</FormLabel>
                        <FormControl>
                          <div className="relative rounded-md">
                            <input
                              type={
                                passwordVisibility.checkSumKey
                                  ? "text"
                                  : "password"
                              }
                              className={cn(
                                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              )}
                              {...field}
                              placeholder="Enter CheckSumKey"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-md text-muted-foreground"
                              onClick={() =>
                                togglePasswordVisibility("checkSumKey")
                              }
                            >
                              {passwordVisibility.checkSumKey ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* 
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Select
                              {...field}
                              disabled={!!initialData}
                              value={
                                field.value ? field.value.toString() : undefined
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
                    /> */}
                </div>

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
                  <DialogClose>
                    <Button type="submit" disabled={isLoading}>
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </>
    </div>
  );
};
