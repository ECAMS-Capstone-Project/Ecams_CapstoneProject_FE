/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Grid2, Typography } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { GetStudentByIdAPI } from "@/api/representative/StudentAPI";
import StudentRequest from "@/models/StudentRequest";
import LoadingAnimation from "@/components/ui/loading";

// 🔥 Dialog hiển thị chi tiết Member
interface MemberDetailDialogProps {
    open: boolean;
    onClose: () => void;
    memberId: string;
}

export const MemberDetailDialog: React.FC<MemberDetailDialogProps> = ({
    open,
    onClose,
    memberId,
}) => {
    const [member, setMember] = useState<StudentRequest>();
    const [loading, setLoading] = useState<boolean>();
    console.log(memberId);

    useEffect(() => {
        const loadStudent = async () => {
            try {
                const response = await GetStudentByIdAPI(memberId);
                setMember(response.data);
            } catch (error: any) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        loadStudent();
    }, [memberId]);
    if (!memberId) return null; // Nếu chưa có member thì không hiển thị gì
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Member Detail</DialogTitle>
                </DialogHeader>

                <div className="p-4 mt-2">
                    {loading && <div><LoadingAnimation /></div>}
                    {!loading && (
                        <>
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
                                        src={member?.imageUrl || "https://cdn.thuvienphapluat.vn/uploads/tintuc/2023/09/06/hinh-thuc-ky-luat-sinh-vien-dai-hoc.jpeg"}
                                        alt="dsa"
                                        className="object-cover w-full h-full"
                                    />
                                </Avatar>
                            </div>
                        </>
                    )}
                    {/* Nút Close */}
                    <div className="flex justify-end mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};