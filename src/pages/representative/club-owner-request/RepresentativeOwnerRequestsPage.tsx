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
import RepresentativeReviewRequestDialog, {
    ReviewRequest,
} from "@/components/partial/representative/representative-owner/RepresentativeReviewRequestDialog";

// Fake data request
const fakeRequests: ReviewRequest[] = [
    {
        requestId: "req1",
        clubId: "club1",
        clubName: "FPT Club",
        currentOwner: "Alice",
        requestedCandidate: { id: "rep1", name: "Bob" },
        requestReason:
            "Due to heavy workload, I would like to hand over the club ownership.",
    },
    {
        requestId: "req2",
        clubId: "club2",
        clubName: "Tech Club",
        currentOwner: "Charlie",
        requestedCandidate: { id: "rep2", name: "David" },
        requestReason: "I am stepping down to focus on my studies.",
    },
    {
        requestId: "req3",
        clubId: "club3",
        clubName: "Art Club",
        currentOwner: "Eva",
        requestedCandidate: { id: "rep3", name: "Frank" },
        requestReason: "I would like to pursue other projects.",
    },
    {
        requestId: "req4",
        clubId: "club4",
        clubName: "Music Club",
        currentOwner: "Grace",
        requestedCandidate: { id: "rep4", name: "Henry" },
        requestReason: "I want to explore new opportunities.",
    },
    {
        requestId: "req5",
        clubId: "club5",
        clubName: "Drama Club",
        currentOwner: "Ivy",
        requestedCandidate: { id: "rep5", name: "Jack" },
        requestReason: "I prefer to focus on academics.",
    },
];

const ITEMS_PER_PAGE = 4;

const RepresentativeRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<ReviewRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<ReviewRequest | null>(
        null
    );
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        async function fetchRequests() {
            try {
                // Giả lập delay API
                await new Promise((resolve) => setTimeout(resolve, 500));
                setRequests(fakeRequests);
            } catch (err: any) {
                setError(err.message || "Error fetching requests");
            } finally {
                setLoading(false);
            }
        }
        fetchRequests();
    }, []);

    const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);

    const currentRequests = requests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleReview = (req: ReviewRequest) => {
        setSelectedRequest(req);
    };

    const handleCloseDialog = () => {
        setSelectedRequest(null);
    };

    const handleSubmitDecision = (
        decision: "approve" | "deny",
        options: { denyReason?: string; selectedMemberId?: string }
    ) => {
        console.log("Decision:", decision, options, "for request", selectedRequest?.requestId);
        setRequests((prev) =>
            prev.filter((req) => req.requestId !== selectedRequest?.requestId)
        );
        setSelectedRequest(null);
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-center">
                Club Owner Change Requests
            </h2>
            {loading ? (
                <p className="text-center">Loading requests...</p>
            ) : error ? (
                <p className="text-center text-red-500">Error: {error}</p>
            ) : requests.length === 0 ? (
                <p className="text-center">No change requests available.</p>
            ) : (
                <div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {currentRequests.map((req) => (
                            <Card key={req.requestId} className="border shadow-md hover:shadow-lg cursor-pointer duration-200 overflow-hidden rounded-lg transition-transform hover:scale-105">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">
                                        {req.clubName}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        <strong>Current Owner:</strong> {req.currentOwner}
                                    </p>
                                    <p>
                                        <strong>Requested Candidate:</strong>{" "}
                                        {req.requestedCandidate.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Reason:</strong> {req.requestReason}
                                    </p>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button onClick={() => handleReview(req)}>
                                        Review Request
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center space-x-4 mt-6">
                        <Button
                            variant="outline"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </Button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
            {selectedRequest && (
                <RepresentativeReviewRequestDialog
                    request={selectedRequest}
                    // Fake member list; thay bằng dữ liệu thực khi cần.
                    memberList={[
                        { id: "m1", name: "Member 1" },
                        { id: "m2", name: "Member 2" },
                        { id: "m3", name: "Member 3" },
                    ]}
                    onClose={handleCloseDialog}
                    onSubmit={handleSubmitDecision}
                />
            )}
        </div>
    );
};

export default RepresentativeRequestsPage;
