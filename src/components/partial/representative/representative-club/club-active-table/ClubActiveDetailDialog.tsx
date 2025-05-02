/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Box,
} from "@mui/material";
import { ClubResponseDTO } from "@/api/club-owner/ClubByUser";
import { formatDate } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { MemberDetailDialog } from "../MemberDetailDialog";
import { useState } from "react";

interface ClubDetailDialogProps {
  initialData: ClubResponseDTO | null;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClubActiveDetailDialog: React.FC<ClubDetailDialogProps> = ({
  initialData,
}) => {
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleViewMember = (memberId: string) => {
    setSelectedMember(memberId);
    setOpenMemberDialog(true);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredMembers =
    initialData?.clubMembers?.filter((a) => a.status === "ACTIVE") || [];
  const paginatedMembers = filteredMembers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="p-5 mt-2 max-h-[900px] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Club Detail</h2>
      {/* Avatar */}
      <Box className="mb-6">
        <Avatar className="w-72 h-52 rounded-lg mx-auto shadow-lg">
          <AvatarImage
            src={initialData?.logoUrl || "https://github.com/shadcn.png"}
            alt="club-logo"
            className="object-cover w-full h-full"
          />
        </Avatar>
      </Box>

      <Grid2 container spacing={0}>
        <Grid2 size={6}>
          <div className="p-4 bg-gray-50 rounded-lg">
            <Typography
              variant="h6"
              fontWeight="bold"
              className="text-gray-800"
            >
              Club Name
            </Typography>
            <Typography className="text-gray-800 mt-1 text-lg">
              {initialData?.clubName}
            </Typography>
          </div>
        </Grid2>
        <Grid2 size={6}>
          <div className="p-4 bg-gray-50 rounded-lg">
            <Typography
              variant="h6"
              fontWeight="bold"
              className="text-gray-800"
            >
              Founding Date
            </Typography>
            <Typography className="text-gray-800 mt-1 text-lg">
              {formatDate(
                initialData?.foundingDate || new Date(),
                "dd/MM/yyyy"
              )}
            </Typography>
          </div>
        </Grid2>
        <Grid2 size={12}>
          <div className="p-4 bg-gray-50 rounded-lg">
            <Typography
              variant="h6"
              fontWeight="bold"
              className="text-gray-800"
            >
              Purpose
            </Typography>
            <Typography className="text-gray-800 mt-1 text-lg">
              {initialData?.purpose}
            </Typography>
          </div>
        </Grid2>
        <Grid2 size={12}>
          <div className="p-4 bg-gray-50 rounded-lg">
            <Typography
              variant="h6"
              fontWeight="bold"
              className="text-gray-800"
            >
              Club Description
            </Typography>
            <Typography className="text-gray-800 mt-1 text-lg">
              {initialData?.description || "N/A"}
            </Typography>
          </div>
        </Grid2>
        <Grid2 size={6}>
          <div className="p-4 bg-gray-50 rounded-lg">
            <Typography
              variant="h6"
              fontWeight="bold"
              className="text-gray-800"
            >
              Contact Information
            </Typography>
            <div className="mt-2">
              <Typography className="text-gray-700 text-lg mb-2">
                Email: {initialData?.contactEmail || "N/A"}
              </Typography>
              <Typography variant="body2" className="text-gray-700 text-lg">
                Phone: {initialData?.contactPhone || "N/A"}
              </Typography>
            </div>
          </div>
        </Grid2>
        <Grid2 size={6}>
          <div className="p-4 bg-gray-50 rounded-lg">
            <Typography
              variant="h6"
              fontWeight="bold"
              className="text-gray-800"
            >
              Additional Information
            </Typography>
            <div className="mt-2">
              <Typography className="text-gray-700 text-lg mb-1">
                Website: {initialData?.websiteUrl || "N/A"}
              </Typography>
              <Typography variant="body2" className="mt-1 text-lg">
                <span className="text-[#2F4F4F]">Status: </span>
                <span className="bg-[#CBF2DA] text-[#2F4F4F] px-2 py-1 rounded-md text-sm">
                  {initialData?.status}
                </span>
              </Typography>
            </div>
          </div>
        </Grid2>
        <Grid2 size={12}>
          <div className="p-4 bg-gray-50 rounded-lg">
            <Typography
              variant="h6"
              fontWeight="bold"
              className="text-gray-800 mb-3"
            >
              Fields
            </Typography>
            <div className="mt-2">
              {initialData?.clubFields && initialData?.clubFields.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {initialData.clubFields.map((data, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 px-4 py-2 rounded-lg text-base font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      {data.fieldName}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-16 bg-gray-100 rounded-lg">
                  <Typography className="text-gray-500 italic">
                    No fields specified
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </Grid2>
      </Grid2>

      <div className="mt-8">
        <Typography
          variant="h6"
          fontWeight="bold"
          className="text-gray-800 mb-4"
        >
          Club Members
        </Typography>
        <TableContainer component={Paper} className="shadow-md">
          <Table size="medium">
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell className="font-semibold">Avatar</TableCell>
                <TableCell className="font-semibold">Student ID</TableCell>
                <TableCell className="font-semibold">Name</TableCell>
                <TableCell className="font-semibold">Position</TableCell>
                <TableCell align="center" className="font-semibold">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMembers.map((member, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex justify-center">
                      <img
                        src={
                          member.avatar ||
                          "https://inthenhua.net.vn/wp-content/uploads/2017/01/the-sinh-vien-2.jpg"
                        }
                        alt="member-avatar"
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{member.studentId}</TableCell>
                  <TableCell>{member.fullname}</TableCell>
                  <TableCell>{member.clubRoleName}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewMember(member.userId)}
                      className="hover:bg-gray-100"
                    >
                      <Eye size={16} className="text-gray-800" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5]}
            component="div"
            count={filteredMembers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="border-t"
          />
        </TableContainer>
      </div>

      <MemberDetailDialog
        open={openMemberDialog}
        onClose={() => setOpenMemberDialog(false)}
        memberId={selectedMember}
      />
    </div>
  );
};

export default ClubActiveDetailDialog;
