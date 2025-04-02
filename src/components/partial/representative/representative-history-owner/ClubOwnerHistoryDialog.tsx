import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { UserCircleIcon, ArrowRightIcon } from "lucide-react";
import { ClubOwnerChangeResponseDTO } from "@/api/representative/RequestChangeOwner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Fake API - replace with real API call
const getClubOwnerChangeHistory = async (clubId: string): Promise<ClubOwnerChangeResponseDTO[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    clubId,
                    clubName: "CLB Kỹ Năng",
                    owner: {
                        userId: "u1",
                        studentId: "S001",
                        clubMemberId: "cm1",
                        clubRoleName: "President",
                        fullname: "Nguyễn Văn A",
                        email: "a@clb.edu",
                        avatar: "",
                        phoneNumber: "0900000001",
                        dateOfBirth: "2000-01-01",
                        reason: "",
                        clubActivityPoint: 90,
                        status: "Active",
                    },
                    requestedPerson: {
                        userId: "u2",
                        studentId: "S002",
                        clubMemberId: "cm2",
                        clubRoleName: "Member",
                        fullname: "Trần Thị B",
                        email: "b@clb.edu",
                        avatar: "",
                        phoneNumber: "0900000002",
                        dateOfBirth: "2001-01-01",
                        reason: "Muốn đóng góp nhiều hơn cho CLB",
                        clubActivityPoint: 95,
                        status: "Active",
                    },
                },
                {
                    clubId,
                    clubName: "CLB Kỹ Năng",
                    owner: {
                        userId: "u2",
                        studentId: "S002",
                        clubMemberId: "cm2",
                        clubRoleName: "President",
                        fullname: "Trần Thị B",
                        email: "b@clb.edu",
                        avatar: "",
                        phoneNumber: "0900000002",
                        dateOfBirth: "2001-01-01",
                        reason: "",
                        clubActivityPoint: 95,
                        status: "Active",
                    },
                    requestedPerson: {
                        userId: "u3",
                        studentId: "S003",
                        clubMemberId: "cm3",
                        clubRoleName: "Member",
                        fullname: "Lê Văn C",
                        email: "c@clb.edu",
                        avatar: "",
                        phoneNumber: "0900000003",
                        dateOfBirth: "2002-02-02",
                        reason: "Có kinh nghiệm lãnh đạo",
                        clubActivityPoint: 88,
                        status: "Active",
                    },
                },
            ]);
        }, 500);
    });
};

const ClubOwnerHistoryDialog: React.FC<{ clubId: string }> = ({ clubId }) => {
    const [history, setHistory] = useState<ClubOwnerChangeResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getClubOwnerChangeHistory(clubId);
            setHistory(data);
            setLoading(false);
        };
        fetchData();
    }, [clubId]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">View Owner Change History</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Club Owner Change History</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <p className="text-center py-4">Loading...</p>
                ) : history.length === 0 ? (
                    <p className="text-center py-4">No owner change history available.</p>
                ) : (
                    <div className="space-y-4 py-2">
                        {history.map((entry, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardHeader className="bg-gray-100 p-4">
                                    <CardTitle className="text-lg font-semibold"> {index + 1}. {entry.clubName}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <UserCircleIcon className="h-5 w-5 text-gray-500" />
                                        <p>
                                            <span className="text-gray-600 text-sm">From: </span>
                                            <span className="font-medium">{entry.owner.fullname}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ArrowRightIcon className="h-4 w-4 text-purple-600" />
                                        <p>
                                            <span className="text-gray-600 text-sm">To: </span>
                                            <span className="font-medium text-purple-700">{entry.requestedPerson.fullname}</span>
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                        <strong>Reason:</strong> {entry.requestedPerson.reason || "Không có lý do cụ thể."}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ClubOwnerHistoryDialog;
