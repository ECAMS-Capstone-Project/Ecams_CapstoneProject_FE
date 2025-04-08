/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid2,
} from "@mui/material";
import { CheckCircle2, XCircle, Eye } from "lucide-react";
import DialogLoading from "@/components/ui/dialog-loading";
import WaitingModal from "@/components/global/WaitingModal";
import { ApproveClubCheckingAPI, ClubResponseDTO } from "@/api/club-owner/ClubByUser";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import { MemberDetailDialog } from "./MemberDetailDialog";
import { DenyCheckingClubRequest } from "./DenialDialog";
import { format } from "date-fns";
import { DescriptionWithToggle } from "@/lib/DescriptionWithToggle";

// Dữ liệu props cho Dialog Club
type FormMode = "view" | "pending" | "edit";

interface PendingClubDialogProps {
  initialData: ClubResponseDTO | null;
  mode: FormMode;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

// 🔥 Component chính: PendingClubDialog
export const CheckingClubDialog: React.FC<PendingClubDialogProps> = ({
  initialData,
  mode,
  setFlag,
  setOpenDialog,
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 State cho dialog Member Detail
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [diablogOpen, setIsDialogOpen] = useState(false);

  // Approve
  const handleApprove = async () => {
    if (!initialData || !user) return;
    try {
      setIsLoading(true);
      await ApproveClubCheckingAPI(initialData.clubId);
      toast.success("Club approved successfully.");
      setFlag?.((prev) => !prev);
      setOpenDialog(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Reject
  const handleReject = async () => {
    setIsDialogOpen(true);
  };

  // Mở dialog xem chi tiết member
  const handleViewMember = (memberId: string) => {
    setSelectedMember(memberId);
    setOpenMemberDialog(true);
  };
  const formattedDate = initialData?.foundingDate
    ? format(new Date(initialData.foundingDate), 'dd-MM-yyyy')
    : '';
  return (
    <Dialog open={true} onOpenChange={setOpenDialog}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        {isLoading && (
          <div className="flex justify-center items-center h-full w-full">
            <DialogLoading />
          </div>
        )}

        {!isLoading && (
          <>
            <DialogHeader>
              <DialogTitle>Pending Club Detail</DialogTitle>
            </DialogHeader>

            <div className="p-4 mt-2">
              {/* Khối trên: Thông tin cơ bản */}
              <Grid2 container spacing={2}>
                {/* Logo + Tên + Trạng thái */}
                <Grid2 size={{ xs: 12, sm: 4 }} className="flex flex-col items-center">
                  <Avatar
                    src={initialData?.logoUrl}
                    alt="Club Logo"
                    sx={{ width: 120, height: 120, mb: 2 }}
                  />
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    Name: {initialData?.clubName}
                  </Typography>
                </Grid2>

                {/* Description + Purpose */}
                <Grid2 container size={{ xs: 12, sm: 8 }} >
                  <Grid2 size={6}>
                    <div className="mb-3">
                      <Typography variant="subtitle1" fontWeight="bold">
                        Description
                      </Typography>
                      <Typography variant="body2" style={{ textAlign: "justify" }} className="text-gray-700 text-ba">
                        <DescriptionWithToggle text={initialData?.description || ""} />
                      </Typography>
                    </div>
                    <div className="mb-3">
                      <Typography variant="subtitle1" fontWeight="bold">
                        Created date
                      </Typography>
                      <Typography variant="body2" className="text-gray-700">
                        {formattedDate}
                      </Typography>
                    </div>
                  </Grid2>
                  <Grid2 size={6}>
                    <div className="mb-3">
                      <Typography variant="subtitle1" fontWeight="bold">
                        Purpose
                      </Typography>
                      <Typography variant="body2" className="text-gray-700">
                        {initialData?.purpose}
                      </Typography>
                    </div>
                    <div className="mb-3">
                      <Typography variant="subtitle1" fontWeight="bold">
                        Status
                      </Typography>
                      <Chip
                        label={initialData?.status.toString().toLocaleLowerCase() == "processing" ? "PROCESSING" : "Active"}
                        color={initialData?.status.toString().toLocaleLowerCase() == "processing" ? "info" : "success"}
                      />
                    </div>

                  </Grid2>

                </Grid2>
              </Grid2>

              {/* Fields */}
              <div className="mt-2">
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Club Fields
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {initialData?.clubFields?.map((field) => (
                    <Chip
                      key={field.fieldId}
                      label={field.fieldName}
                      color="secondary"
                    />
                  ))}
                </div>
              </div>

              {/* Danh sách Members */}
              <div className="mt-6">
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Club Members
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell>Avatar</TableCell>
                        <TableCell>Student ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {initialData?.clubMembers?.map((member, index) => (
                        <TableRow key={index + 1}>
                          <TableCell>
                            <div className="flex flex-wrap gap-2 justify-center">
                              <img
                                src={member.avatar || "https://github.com/shadcn.png"}
                                alt={"Product Image"}
                                className="w-12 h-12 object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell>{member.studentId}</TableCell>
                          <TableCell>{member.fullname}</TableCell>
                          <TableCell>{member.clubRoleName}</TableCell>
                          <TableCell align="center">
                            <Button
                              variant="link"
                              onClick={() => handleViewMember(member.userId)}
                            >
                              <Eye size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-2 mt-6">
                {mode === "pending" ? (
                  <>
                    <Button
                      className="bg-green-100 text-green-700 hover:bg-green-200"
                      onClick={handleApprove}
                    >
                      <CheckCircle2 size={18} className="mr-2" />
                      Approve
                    </Button>
                    <Button
                      className="bg-red-100 text-red-700 hover:bg-red-200"
                      onClick={handleReject}
                    >
                      <XCircle size={18} className="mr-2" />
                      Reject
                    </Button>
                  </>
                ) : (
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                )}
              </div>
            </div>
          </>
        )
        }
      </DialogContent >

      <WaitingModal open={isLoading} />

      {/* Dialog Member Detail */}
      <MemberDetailDialog
        open={openMemberDialog}
        onClose={() => setOpenMemberDialog(false)}
        memberId={selectedMember}
      />
      <DenyCheckingClubRequest
        userId={initialData?.clubId || ""}
        open={diablogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setOpenDialog(false)
        }}
        setFlag={setFlag} />
    </Dialog >
  )
}
