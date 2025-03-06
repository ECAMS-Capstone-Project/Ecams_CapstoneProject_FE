/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GetStudentByIdAPI } from "@/api/representative/StudentAPI";
import StudentRequest from "@/models/StudentRequest";
import { Grid2, Typography } from "@mui/material";
import LoadingAnimation from "@/components/ui/loading";

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
}

const MemberDetailDialog: React.FC<UserDetailDialogProps> = ({ initialData }) => {
  const [member, setMember] = useState<StudentRequest>();
  const [loading, setLoading] = useState<boolean>();
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
        </>
      )}
    </div>
  );
};

export default MemberDetailDialog;
