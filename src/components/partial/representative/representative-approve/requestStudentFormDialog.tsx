/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { editPackageSchema } from "@/schema/PackageSchema";
import {
  DialogHeader,
  DialogTitle,
  DialogClose,
  Dialog,
} from "@/components/ui/dialog";
// import { useState } from "react";

import DialogLoading from "@/components/ui/dialog-loading";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, XCircle } from "lucide-react";
import { DenyRequest } from "./DenialDialog";
import { approveStu } from "@/api/representative/StudentAPI";
import toast from "react-hot-toast";
import StudentRequest from "@/models/StudentRequest";
import WaitingModal from "@/components/global/WaitingModal";

type FormMode = "view" | "pending" | "edit";

interface StudentDialogProps {
  initialData: StudentRequest | null;
  mode: FormMode; // Chế độ của form
  setActiveTab?: (tabId: string) => void;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>
}

export const ViewRequestStudentDialog: React.FC<StudentDialogProps> = ({
  initialData,
  mode,
  setFlag
}) => {
  const form = useForm<StudentRequest>({
    resolver: zodResolver(editPackageSchema),
    defaultValues: initialData || {},
  });
  const [isLoading, setIsLoading] = useState(false);
  // const [, setOpen] = useState(false);
  // const [open, setOpen] = useState(false)
  const { control } = form;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleApprove = async () => {
    if (!initialData) return;
    try {
      setIsLoading(true);
      // Call API để cập nhật status thành "Active"
      await approveStu(initialData.userId);
      toast.success("Student approved successfully.");
      if (setFlag) {
        setFlag(pre => !pre);
      }
    } catch (error: any) {
      const errorMessage = error.response.data.message || "An error occurred";
      toast.error(errorMessage);
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
        <div className="w-full max-w-2xl mx-auto my-auto">
          <DialogHeader>
            <DialogTitle>
              View Student Details
            </DialogTitle>
          </DialogHeader>
          <div>
            <div className="p-4 mt-2">
              <Form {...form}>
                <form>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Package Name */}
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={() => (
                        <FormItem>
                          <FormLabel>Avatar</FormLabel>
                          <FormControl>
                            <Avatar className="w-20 h-20">
                              <AvatarImage src="https://github.com/shadcn.png" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              readOnly={!!initialData}
                              style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                fontSize: "16px",
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="studentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student ID</FormLabel>
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
                          <FormLabel>University Name</FormLabel>
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
                      name="yearOfStudy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Academic Year</FormLabel>
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
                      name="phonenumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
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
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
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
                      name="major"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Major</FormLabel>
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
                  <div className="flex justify-center mt-6">
                    <Avatar className="w-96 h-72 rounded-lg">
                      <AvatarImage
                        src={initialData?.imageUrl}
                        alt={initialData?.fullname}
                        className="object-cover w-full h-full"
                      />
                    </Avatar>
                  </div>

                  <div className="flex w-full justify-end mt-4 space-x-3">
                    {mode === "pending" && (
                      <>
                        <div className="flex justify-center w-full space-x-1 gap-5">
                          <Dialog>
                            <Button
                              onClick={handleApprove}
                              className={`w-1/4 sm:w-1/4 p-3 transition duration-300 ease-in-out ${isLoading
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-[#D4F8E8] text-[#007B55] hover:bg-[#C2F2DC] hover:text-[#005B40]"
                                }`}
                            >
                              {isLoading ? (
                                <span className="flex items-center">
                                  <span className="loader mr-2"></span> Processing...
                                </span>
                              ) : (
                                <>
                                  <CheckCircle2 size={18} /> Approve
                                </>
                              )}
                            </Button>
                          </Dialog>
                          <Button
                            type="button"
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
                          userId={initialData.userId}
                          onClose={() => {
                            setIsDialogOpen(false);
                          }}
                          setFlag={setFlag}
                          dialogAction={"reject"}
                        />
                      )}
                    </Dialog>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      )}
      <WaitingModal open={isLoading} />
    </div>
  );
};
