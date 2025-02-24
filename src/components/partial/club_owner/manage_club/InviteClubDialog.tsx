/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
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
  DialogHeader,
  DialogTitle,
  DialogClose,
  Dialog,
} from "@/components/ui/dialog";
// import { useState } from "react";

import DialogLoading from "@/components/ui/dialog-loading";
import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import WaitingModal from "@/components/global/WaitingModal";
import { ApproveClubAPI, ClubResponseDTO } from "@/api/club-owner/ClubByUser";
import { Grid2, Typography } from "@mui/material";
import useAuth from "@/hooks/useAuth";
import { DenyClubByStu } from "@/pages/club-owner/manage-club/DenialDialog";

type FormMode = "view" | "pending" | "edit";

interface InviteClubDialogProps {
  initialData: ClubResponseDTO | null;
  mode: FormMode;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InviteClubDialog: React.FC<InviteClubDialogProps> = ({
  initialData,
  mode,
  setFlag,
  setOpenDialog
}) => {
  const form = useForm<ClubResponseDTO>({
    defaultValues: initialData || {},
  });
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleApprove = async () => {
    if (!initialData) return;
    if (!user) return;
    try {
      setIsLoading(true);
      await ApproveClubAPI(initialData.clubId, user.userId);
      toast.success("Club approved successfully.");
      if (setFlag) setFlag(prev => !prev);
      setOpenDialog(false);
    } catch (error: any) {
      console.log(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setOpen(true);
  };

  return (
    <div className="min-h-[200px] sm:min-h-[300px] h-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-full w-full">
          <DialogLoading />
        </div>
      ) : (
        <div className="w-full max-w-2xl mx-auto my-auto">
          <DialogHeader>
            <DialogTitle>View Club Details</DialogTitle>
          </DialogHeader>

          <div className="p-4 mt-2">
            <Form {...form}>
              <form>
                <Grid2 container spacing={3}>
                  {/* Club Avatar */}
                  <Grid2 size={{ xs: 12, sm: 12 }}>
                    <div className="flex justify-center">
                      <img
                        src={initialData?.logoUrl}
                        alt={"test"}
                        style={{ height: "250px", width: "300px" }}
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </Grid2>

                  {/* Club Name */}
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormField
                      control={form.control}
                      name="clubName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Club Name</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} readOnly={!!initialData} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Grid2>

                  {/* Description */}
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              readOnly
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
                  </Grid2>

                  {/* Purpose */}
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purpose</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} readOnly={!!initialData} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Grid2>

                  {/* Status */}
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} readOnly={!!initialData} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Grid2>

                </Grid2>

                {/* Club Fields */}
                <div className="mt-4 mb-7">
                  <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                    Type of club
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {initialData?.clubFields?.map((field) => (
                      <span
                        key={field.fieldId}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
                      >
                        {field.fieldName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex w-full justify-end mt-4 space-x-3">
                  {mode === "pending" && (
                    <div className="flex justify-center w-full space-x-1 gap-5">
                      {/* Approve Button */}
                      <Dialog>
                        <Button
                          onClick={handleApprove}
                          className={`w-1/4 sm:w-1/4 p-3 transition duration-300 ease-in-out ${isLoading
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-[#D4F8E8] text-[#007B55] hover:bg-[#C2F2DC] hover:text-[#005B40]"
                            }`}
                        >
                          {isLoading ? "Processing..." : <><CheckCircle2 size={18} /> Approve</>}
                        </Button>

                        {/* Reject Button */}
                        <Button
                          type="button"
                          onClick={handleReject}
                          className="w-1/4 sm:w-1/4 bg-[#F8D7DA] text-[#842029] p-3 hover:bg-[#F4C2C5] hover:text-[#6A1B20] transition duration-300 ease-in-out"
                        >
                          <XCircle size={18} /> Reject
                        </Button>
                      </Dialog>
                    </div>
                  )}

                  {/* Close Button */}
                  {mode !== "pending" && (
                    <DialogClose asChild>
                      <Button className="w-fit">Close</Button>
                    </DialogClose>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
      <WaitingModal open={isLoading} />
      <DenyClubByStu
        clubId={initialData?.clubId || ""}
        studentId={user?.userId || ""}
        setFlag={setFlag}
        open={open}
        onClose={() => {
          setOpenDialog(false)
          setOpen(false)
        }}
      />
    </div>
  );
};