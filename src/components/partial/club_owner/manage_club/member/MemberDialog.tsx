/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GetStudentByIdAPI } from "@/api/representative/StudentAPI";
import StudentRequest from "@/models/StudentRequest";
import { Grid2, Typography } from "@mui/material";
import LoadingAnimation from "@/components/ui/loading";
import { Dialog, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { DenyMemberJoinClub } from "./DenialDialog";

// Interface User
export interface User {
  userId: string;
  email: string;
  fullname: string;
  address: string;
  phonenumber: string;
  gender: string;
  avatar: string;
  status: string;
  isVerified: boolean;
}

interface UserDetailDialogProps {
  initialData: User | null;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
  mode: string
}

const MemberDetailDialog: React.FC<UserDetailDialogProps> = ({ initialData, mode, setFlag }) => {
  const [member, setMember] = useState<StudentRequest>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    const loadStudent = async () => {
      if (!initialData || initialData.userId === undefined) return;
      try {
        const response = await GetStudentByIdAPI(initialData.userId);
        setMember(response.data);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [initialData]);
  // const handleApprove = async () => {
  //   if (!initialData) return;
  //   try {
  //     setLoading(true);
  //     await approveStu(initialData.userId);
  //     toast.success("Student approved successfully.");
  //     if (setFlag) {
  //       setFlag(pre => !pre);
  //     }
  //   } catch (error: any) {
  //     const errorMessage = error.response.data.message || "An error occurred";
  //     toast.error(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  return (
    <div className="p-5 mt-2">
      {loading && <div><LoadingAnimation /></div>}
      {!loading && (
        <>
          <h2 className="text-lg font-semibold mb-4">User Detail</h2>
          {/* Avatar */}
          <Grid2 container>
            <Grid2 size={6}>
              <div className="mb-3">
                <Typography variant="subtitle1" fontWeight="bold">
                  Student ID
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  {member?.studentId}
                </Typography>
              </div>
              <div className="mb-3">
                <Typography variant="subtitle1" fontWeight="bold">
                  Gender
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  {member?.gender}
                </Typography>
              </div>
            </Grid2>
            <Grid2 size={6}>
              <div className="mb-3">
                <Typography variant="subtitle1" fontWeight="bold">
                  Full Name
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  {member?.fullname}
                </Typography>
              </div>
              <div className="mb-3">
                <Typography variant="subtitle1" fontWeight="bold">
                  Email
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  {member?.email}
                </Typography>
              </div>
            </Grid2>
            <Grid2 size={6}>
              <div className="mb-3">
                <Typography variant="subtitle1" fontWeight="bold">
                  Major
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  {member?.major}
                </Typography>
              </div>
              <div className="mb-3">
                <Typography variant="subtitle1" fontWeight="bold">
                  University
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  {member?.universityName}
                </Typography>
              </div>
            </Grid2>
            <Grid2 size={6}>
              <div className="mb-3">
                <Typography variant="subtitle1" fontWeight="bold">
                  Academic Year
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  {member?.yearOfStudy}
                </Typography>
              </div>
              <div className="mb-3">
                <Typography variant="subtitle1" fontWeight="bold">
                  Address
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  {member?.address}
                </Typography>
              </div>
            </Grid2>
          </Grid2>
          <div className="flex justify-center mt-6">
            <Avatar className="w-72 h-52 rounded-lg">
              <AvatarImage
                src={member?.imageUrl || "https://github.com/shadcn.png"}
                alt="empty"
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
                      className={`w-1/4 sm:w-1/4 p-3 transition duration-300 ease-in-out ${loading
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-[#D4F8E8] text-[#007B55] hover:bg-[#C2F2DC] hover:text-[#005B40]"
                        }`}
                    >
                      {loading ? (
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
                <DenyMemberJoinClub
                  userId={initialData.userId}
                  onClose={() => {
                    setIsDialogOpen(false);
                  }}
                  setFlag={setFlag}
                  open={isDialogOpen}
                />
              )}
            </Dialog>
          </div>
        </>
      )}
    </div>
  );
};

export default MemberDetailDialog;
