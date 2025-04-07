/* eslint-disable react-hooks/exhaustive-deps */
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
import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DialogLoading from "@/components/ui/dialog-loading";
import { useEffect, useState } from "react";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import { getCurrentUserAPI } from "@/api/auth/LoginAPI";

import { WalletSchema } from "@/schema/WalletSchema";
import { useWallet } from "@/hooks/staff/Wallet/useWallet";
import { CheckIcon, ChevronDownIcon, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { bankNameOption } from "@/data/bankData";

type WalletFormValues = z.infer<typeof WalletSchema>;

interface WalletDialogProps {
  initialData: WalletFormValues | null;
  onSuccess?: () => void; // Callback để reload data sau khi tạo area
  setOpen?: (open: boolean) => void; // Nhận state từ component cha
}

export const ViewWalletDialog: React.FC<WalletDialogProps> = ({
  initialData,
  setOpen,
}) => {
  const [userInfo, setUserInfo] = useState<UserAuthDTO>();
  const accessToken = localStorage.getItem("accessToken");
  const [isLoading, setIsLoading] = useState(false);
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
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getCurrentUserAPI();
        if (userInfo) {
          setUserInfo(userInfo.data);

          form.setValue("universityId", userInfo.data?.universityId ?? "");
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, [initialData]);
  const { createWallet, isPending, updateWallet, isUpdating } = useWallet(
    userInfo?.universityId ?? "",
    accessToken ?? ""
  ); // Lấy mutation từ React Query
  const form = useForm<WalletFormValues>({
    resolver: zodResolver(WalletSchema),
    defaultValues: initialData || {
      apiKey: "",
      clientId: "",
      checkSumKey: "",
      walletName: "",
      bankName: "",
      universityId: "",
    },
  });

  // Handle form submit
  const onSubmit = async (values: WalletFormValues) => {
    try {
      setIsLoading(true);
      if (initialData) {
        // Nếu có `initialData`, gọi API `updateArea`
        const updateValues = {
          ...values,
          // UniversityId: userInfo?.universityId,
          walletId: initialData.walletId,
        };
        await updateWallet(updateValues); // Gọi API update
      } else {
        // Nếu không có `initialData`, gọi API `createArea`
        const createValues = {
          ...values,
          universityId: userInfo?.universityId,
        };
        await createWallet(createValues);
      }
      if (!isPending || !isUpdating) {
        setOpen && setOpen(false); // Đóng dialog sau khi submit thành công
      }
      // onSuccess && onSuccess(); // Callback reload data nếu cần
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[200px] sm:min-h-[300px] h-auto">
      {isPending || isUpdating ? (
        <div className="flex justify-center items-center h-full w-full">
          <DialogLoading />
        </div>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit Wallet" : "Add New Bank Account"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {initialData
              ? "Edit bank account details below."
              : "Fill out the form below to add a new bank account."}
          </DialogDescription>
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
                            <Input
                              type="text"
                              {...field}
                              placeholder="Enter wallet's name"
                            />
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
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={`h-10 px-4 w-full rounded-lg group relative text-white bg-gradient-to-r from-[#136CB5] to-[#49BBBD] hover:opacity-90 flex items-center justify-between space-x-2  `}
                                >
                                  <span>
                                    {field.value
                                      ? bankNameOption.find(
                                          (bank) => bank.value === field.value
                                        )?.label
                                      : "Select Bank's Name..."}
                                  </span>
                                  <ChevronDownIcon className="h-4 w-4" />
                                </Button>
                                {/* Tooltip when hover */}
                              </PopoverTrigger>

                              <PopoverContent className=" p-0" align="start">
                                <Command>
                                  <CommandInput placeholder="Search bank..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No results found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {bankNameOption.map((option) => {
                                        const isSelected =
                                          field.value == option.value;
                                        return (
                                          <CommandItem
                                            key={option.value}
                                            onSelect={() => {
                                              field.onChange(option.value); // Set the selected value to the form field
                                            }}
                                            className="flex items-center"
                                          >
                                            <div
                                              className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded border border-primary",
                                                isSelected
                                                  ? "bg-primary text-primary-foreground"
                                                  : "opacity-50 [&_svg]:invisible"
                                              )}
                                            >
                                              <CheckIcon className="h-4 w-4" />
                                            </div>
                                            <span>{option.label}</span>
                                          </CommandItem>
                                        );
                                      })}
                                    </CommandGroup>
                                    {field.value && (
                                      <CommandGroup>
                                        <CommandItem
                                          onSelect={() => {
                                            field.onChange(""); // Clear the form field when clearing selection
                                          }}
                                          className="justify-center text-center text-red-500"
                                        >
                                          Clear Filters
                                        </CommandItem>
                                      </CommandGroup>
                                    )}
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
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
                                  passwordVisibility.apiKey
                                    ? "text"
                                    : "password"
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
                                onClick={() =>
                                  togglePasswordVisibility("apiKey")
                                }
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
                    {initialData ? (
                      <DialogClose>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading
                            ? initialData
                              ? "Updating..."
                              : "Creating..."
                            : initialData
                            ? "Update Wallet"
                            : "Create Wallet"}
                        </Button>
                      </DialogClose>
                    ) : (
                      <Button type="submit" disabled={isLoading}>
                        {isLoading
                          ? initialData
                            ? "Updating..."
                            : "Creating..."
                          : initialData
                          ? "Update Wallet"
                          : "Create Wallet"}
                      </Button>
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
