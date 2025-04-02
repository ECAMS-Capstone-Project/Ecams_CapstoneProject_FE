/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RepresentativeReviewRequestDialog from "@/components/partial/representative/representative-owner/RepresentativeReviewRequestDialog";
import useAuth from "@/hooks/useAuth";
import { AcceptOrDenyOwnerRequestAPI, ClubOwnerChangeResponseDTO, GetRequestChangeClubOwnerAPI } from "@/api/representative/RequestChangeOwner";
import { ArrowLeftIcon, ArrowRightIcon, ChevronRightIcon, UserCircleIcon } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

const ITEMS_PER_PAGE = 4;

const RepresentativeRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<ClubOwnerChangeResponseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<ClubOwnerChangeResponseDTO | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { user } = useAuth();

    useEffect(() => {
        async function fetchRequests() {
            try {
                if (!user?.universityId) return;
                setLoading(true);
                const response = await GetRequestChangeClubOwnerAPI(user.universityId);
                console.log("Response:", response);
                setRequests(response.data || []);
                // const fakeData: ClubOwnerChangeResponseDTO[] = Array.from({ length: 10 }, (_, i) => ({
                //     clubId: `club-${i + 1}`,
                //     clubName: `CLB Số ${i + 1}`,
                //     owner: {
                //         userId: `user-owner-${i}`,
                //         studentId: `S${1000 + i}`,
                //         clubMemberId: `cm-owner-${i}`,
                //         clubRoleName: ClubRoleEnum.CLUB_MEMBER,
                //         fullname: `Nguyễn Văn A${i}`,
                //         email: `owner${i}@university.edu.vn`,
                //         avatar: "",
                //         phoneNumber: "0900000000",
                //         dateOfBirth: "2000-01-01",
                //         reason: "Lý do đảm nhiệm vị trí trước đó",
                //         clubActivityPoint: 85,
                //         status: ClubMemberStatusEnum.ACTIVE,
                //     },
                //     requestedPerson: {
                //         userId: `user-requested-${i}`,
                //         studentId: `S${2000 + i}`,
                //         clubMemberId: `cm-request-${i}`,
                //         clubRoleName: ClubRoleEnum.CLUB_MEMBER,
                //         fullname: `Trần Thị B${i}`,
                //         email: `requested${i}@university.edu.vn`,
                //         avatar: "",
                //         phoneNumber: "0900111222",
                //         dateOfBirth: "2001-02-02",
                //         reason: `Tôi muốn tiếp quản câu lạc bộ vì tôi đã có nhiều kinh nghiệm trong ban điều hành.`,
                //         clubActivityPoint: 92,
                //         status: ClubMemberStatusEnum.ACTIVE,
                //     },
                // }));
                // setRequests(fakeData);
            } catch (err: any) {
                setError(err.message || "Error fetching requests");
            } finally {
                setLoading(false);
            }
        }
        fetchRequests();
    }, [user]);

    const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
    const currentRequests = requests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleReview = (req: ClubOwnerChangeResponseDTO) => setSelectedRequest(req);
    const handleCloseDialog = () => setSelectedRequest(null);
    const handleSubmitDecision = async (decision: "approve" | "deny", options: { denyReason?: string; selectedMemberId?: string }) => {
        console.log("Decision:", decision, options, "for request", selectedRequest?.clubId);
        await AcceptOrDenyOwnerRequestAPI(selectedRequest!.clubId, { isAccepted: decision === "approve", rejectReason: options.denyReason || "" });
        setRequests((prev) => prev.filter((req) => req.clubId !== selectedRequest?.clubId));
        setSelectedRequest(null);
    };
    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className="p-6">
            <div className="flex items-center justify-between bg-white rounded-lg shadow-lg w-full p-3 mb-5">
                <Heading
                    title={`Representative Change Requests`}
                    description={`View list request of representative.`}
                />
            </div>
            <Separator className="mt-2 mb-4" />
            {loading ? (
                <p className="text-center">Loading requests...</p>
            ) : error ? (
                <p className="text-center text-red-500">Error: {error}</p>
            ) : requests.length === 0 ? (
                <p className="text-center">No change requests available.</p>
            ) : (
                <div>
                    <div className="grid gap-6 sm:grid-cols-2">
                        {currentRequests.map((req) => (
                            <Card
                                key={req.clubId}
                                className="border shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 rounded-xl hover:scale-[1.02]"
                            >
                                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                                    <div className="flex items-center gap-3 text-white">
                                        <img src="https://cdn-icons-png.flaticon.com/512/3990/3990804.png" className="h-6 w-6" alt="Club" />
                                        <CardTitle className="text-lg font-semibold">{req.clubName}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <UserCircleIcon className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Current Owner</p>
                                            <p className="font-medium">{req.owner?.fullname}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <UserCircleIcon className="h-5 w-5 text-purple-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Requested Candidate</p>
                                            <p className="font-medium text-purple-700">{req.requestedPerson?.fullname}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <UserCircleIcon className="h-5 w-5 text-gray-400 mt-1" />
                                        <p className="text-sm text-gray-600">
                                            <strong>Reason:</strong> {req.owner?.reason}
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end bg-gray-50 p-4">
                                    <Button onClick={() => handleReview(req)} className="flex items-center space-x-1 hover:bg-purple-600 hover:text-white">
                                        <span>Review</span>
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    <div className="flex justify-center items-center space-x-4 mt-6">
                        <Button variant="ghost" onClick={handlePrevPage} disabled={currentPage === 1} className="hover:bg-gray-100">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                        <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                        <Button variant="ghost" onClick={handleNextPage} disabled={currentPage === totalPages} className="hover:bg-gray-100">
                            <ArrowRightIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            )}
            {selectedRequest && (
                <RepresentativeReviewRequestDialog
                    request={selectedRequest}
                    onClose={handleCloseDialog}
                    onSubmit={handleSubmitDecision}
                />
            )}
        </div>
    );
};

export default RepresentativeRequestsPage;
