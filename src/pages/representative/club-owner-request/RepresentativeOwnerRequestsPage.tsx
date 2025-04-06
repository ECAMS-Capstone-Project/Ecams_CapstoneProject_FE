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
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import toast from "react-hot-toast";
import LoadingAnimation from "@/components/ui/loading";
const ITEMS_PER_PAGE = 4;

const RepresentativeRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<ClubOwnerChangeResponseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<ClubOwnerChangeResponseDTO | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { user } = useAuth();
    const [flag, setFlag] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        async function fetchRequests() {
            try {
                if (!user?.universityId) return;
                setLoading(true);
                const response = await GetRequestChangeClubOwnerAPI(user.universityId);
                setRequests(response.data || []);
            } catch (err: any) {
                setError(err.message || "Error fetching requests");
            } finally {
                setLoading(false);
            }
        }
        fetchRequests();
    }, [user, flag]);

    const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
    const currentRequests = requests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleReview = (req: ClubOwnerChangeResponseDTO) => setSelectedRequest(req);
    const handleCloseDialog = () => setSelectedRequest(null);
    const handleSubmitDecision = async (
        decision: "approve" | "deny",
        options: { denyReason?: string; selectedMemberId?: string }
    ) => {
        setIsSubmitting(true);

        try {
            await AcceptOrDenyOwnerRequestAPI(selectedRequest!.clubId, {
                isAccepted: decision === "approve",
                rejectReason: options.denyReason || "",
            });

            toast.success(
                decision === "approve"
                    ? "Approve request successfully"
                    : "Reject request successfully"
            );

            setFlag((pre) => !pre);
            setSelectedRequest(null);
        } catch (error: any) {
            console.error("Approval error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className="p-6">
            <div className="flex items-center justify-between bg-white rounded-lg shadow-lg w-full p-3 mb-5">
                <Heading
                    title={`Club Owner Change Requests`}
                    description={`View list request of club owner.`}
                />
            </div>
            <Separator className="mt-2 mb-4" />
            {loading ? (
                <LoadingAnimation />
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
                                <CardHeader className="p-4" style={{ background: "linear-gradient(to right, #136CB5, #49BBBD)" }}>
                                    <div className="flex items-center gap-3 text-white">
                                        <img src="https://cdn-icons-png.flaticon.com/512/3990/3990804.png" className="h-6 w-6" alt="Club" />
                                        <CardTitle className="text-lg font-semibold">{req.clubName}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <UserCircleIcon className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="text-xs text-black">Current Owner</p>
                                            <p className="font-medium">{req.owner?.fullname}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <UserCircleIcon className="h-5 w-5 text-[#136CB5]" />
                                        <div>
                                            <p className="text-xs text-[#136CB5]">Requested Candidate</p>
                                            <p className="font-medium text-[#136CB5]">{req.requestedPerson?.fullname}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <ContentPasteIcon className="h-5 w-5 text-gray-400" />
                                        <p className="text-sm text-gray-600">
                                            <strong>Reason:</strong> {req.owner?.leaveReason}
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
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
};

export default RepresentativeRequestsPage;
