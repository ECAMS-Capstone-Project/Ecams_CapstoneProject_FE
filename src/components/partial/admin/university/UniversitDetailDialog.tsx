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
  Dialog,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { universitySchema } from "@/schema/UniversitySchema";
import { CheckCircle2, XCircle } from "lucide-react";
import { DenyRequest } from "./DenialDialog";
import { useState } from "react";
import { approveUni } from "@/api/agent/UniversityAgent";
import LoadingAnimation from "@/components/ui/loading";
import DialogLoading from "@/components/ui/dialog-loading";

type UniversityDetail = z.infer<typeof universitySchema>;

interface UniversityDetailProps {
  initialData: UniversityDetail | null; // Dữ liệu ban đầu, có thể null
}

type FormMode = "view" | "pending" | "edit";

interface UniversityDetailProps {
  initialData: UniversityDetail | null; // Dữ liệu ban đầu, có thể null
  mode: FormMode; // Chế độ của form
  setActiveTab?: (tabId: string) => void;
  onClose: () => void; // Hàm đóng dialog từ `DataTableRowActions`
  onSuccess?: () => void; // Hàm để làm mới danh sách
}

export const UniversityFormDialog: React.FC<UniversityDetailProps> = ({
  initialData,
  mode,
  onClose,
  onSuccess,
}) => {
  const form = useForm<UniversityDetail>({
    resolver: zodResolver(universitySchema),
    defaultValues: initialData || undefined,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  async function onSubmit(values: UniversityDetail) {
    try {
      console.log("Updating University:", values);
      toast.success("University updated successfully.");
    } catch (error: any) {
      // const errorMessage = error.response?.data?.message || "An error occurred";
      // toast.error(errorMessage);
      console.error("Error:", error);
    }
  }

  async function handleApprove() {
    try {
      console.log("Approving university...");
      // Call API để cập nhật status thành "Active"
      if (initialData) {
        setIsLoading(true);
        await approveUni(initialData.universityId);
        toast.success("University approved successfully.");
        // navigate("/admin/university")
        window.location.reload();
      }
    } catch (error: any) {
      const errorMessage = error.response.data.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }
  // const updateLocalUniversityList = (universityId: string) => {
  //   setUniList((prevList) =>
  //     prevList.filter((uni) => uni.universityId !== universityId) // Loại bỏ item bị từ chối
  //   );
  // };
  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-full w-full">
          <DialogLoading />
        </div>
      ) : (
        <>
          <div className="w-full max-w-2xl mx-auto my-auto">
            <DialogHeader>
              <DialogTitle>
                {mode === "view"
                  ? "View University Details"
                  : "Pending Request"}
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>
              {mode === "view"
                ? "View the university details below."
                : "Review the pending request below."}
            </DialogDescription>
            <div className="p-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Các trường form */}
                    <FormField
                      control={form.control}
                      name="universityName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>University Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              readOnly={mode === "view" || mode === "pending"}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="staffName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Staff</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              readOnly={mode === "view" || mode === "pending"}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shortName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>University's Abbreviate Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              readOnly={mode === "view" || mode === "pending"}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        readOnly={mode === "view" || mode === "pending"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              readOnly={mode === "view" || mode === "pending"}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        readOnly={mode === "view" || mode === "pending"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
                    {/* <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        readOnly={mode === "view" || mode === "pending"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
                    {/* Các trường khác tương tự */}
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
                              readOnly
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <FormField
                control={form.control}
                name="subscriptionStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription Status</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        readOnly
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
                    <FormField
                      control={form.control}
                      name="logoLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo Link</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              readOnly
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Các nút hành động */}
                  <div className="flex w-full justify-end mt-4 space-x-3">
                    {mode === "pending" && (
                      <>
                        <div className="flex justify-center w-full space-x-1">
                          <DialogClose asChild>
                            <Button
                              onClick={handleApprove}
                              className="w-1/4 sm:w-1/4 bg-[#D4F8E8] text-[#007B55] p-3 hover:bg-[#C2F2DC] hover:text-[#005B40] transition duration-300 ease-in-out"
                            >
                              <CheckCircle2 size={18} /> Approve
                            </Button>
                          </DialogClose>
                          <Button
                            onClick={() => setIsDialogOpen(true)}
                            className="w-1/4 sm:w-1/4 bg-[#F8D7DA] text-[#842029] p-3 hover:bg-[#F4C2C5] hover:text-[#6A1B20] transition duration-300 ease-in-out"
                          >
                            <XCircle size={18} /> Reject
                          </Button>
                        </div>
                      </>
                    )}
                    {mode !== "pending" && (
                      <DialogClose asChild>
                        <Button className="w-fit">Close</Button>
                      </DialogClose>
                    )}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      {initialData && (
                        <DenyRequest
                          universityId={initialData.universityId}
                          onClose={() => {
                            setIsDialogOpen(false); // Đóng dialog phụ
                            onClose(); // Đóng dialog chính
                            if (onSuccess) onSuccess(); // Làm mới danh sách
                          }}
                          dialogAction={"reject"}
                        />
                      )}
                    </Dialog>
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
