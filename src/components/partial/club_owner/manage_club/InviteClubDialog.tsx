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
        <div className="w-full max-w-2xl mx-auto my-auto px-6 py-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-800">
              Club Information
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <Form {...form}>
              <form className="flex flex-col max-h-[80vh] overflow-y-auto pr-1">
                <Grid2 container spacing={4} p={1}>
                  {/* Club Avatar */}
                  <Grid2 size={{ xs: 12 }}>
                    <div className="flex justify-center">
                      <img
                        src={initialData?.logoUrl}
                        alt="Club logo"
                        className="w-64 h-48 object-cover rounded-2xl shadow-md"
                      />
                    </div>
                  </Grid2>

                  {/* Club Name */}
                  <Grid2 size={{ xs: 12 }}>
                    <FormField
                      control={form.control}
                      name="clubName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-base">Club Name</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly className="bg-gray-50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Grid2>

                  {/* Purpose */}
                  <Grid2 size={{ xs: 12 }}>
                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-base">Purpose</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              readOnly
                              className="w-full p-2 rounded-md border border-gray-300 text-sm focus:outline-none bg-gray-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Grid2>

                  {/* Description */}
                  <Grid2 size={{ xs: 12 }}>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-base">Description</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              readOnly
                              className="w-full p-2 rounded-md border border-gray-300 text-sm focus:outline-none bg-gray-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Grid2>

                </Grid2>

                <div className="mt-6 flex justify-between items-start gap-4 flex-wrap">
                  {/* Club Fields */}
                  <div>
                    <Typography
                      variant="subtitle1"
                      className="font-semibold text-gray-800 mb-2"
                    >
                      Type of Club
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {initialData?.clubFields?.map((field) => (
                        <span
                          key={field.fieldId}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                        >
                          {field.fieldName}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <Typography
                      variant="subtitle1"
                      className="font-semibold text-gray-800 mb-2"
                    >
                      Status
                    </Typography>
                    <div
                      className={`min-w-[180px] px-4 py-2 rounded-lg text-sm text-center font-semibold uppercase bg-yellow-100 text-yellow-700`}
                    >
                      {initialData?.status}
                    </div>
                  </div>
                </div>


                {/* Action Buttons */}
                <div className="flex w-full justify-end mt-10 space-x-3">
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