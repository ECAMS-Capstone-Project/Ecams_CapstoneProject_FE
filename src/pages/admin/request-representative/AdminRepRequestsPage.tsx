/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { MagicCard } from "@/components/magicui/magic-card";
import { Edit3, MessageSquare, User, Users } from "lucide-react";

// Data structure for a representative change request
interface RepChangeRequest {
    requestId: string;
    clubName: string;
    currentRep: string;
    requestedRep: { id: string; name: string };
    reason: string;
}

// Fake data for demonstration (more than 4 for pagination)
const fakeRequests: RepChangeRequest[] = [
    {
        requestId: "req1",
        clubName: "FPT Club",
        currentRep: "Alice",
        requestedRep: { id: "rep1", name: "Bob" },
        reason: "We believe Bob is more suited to handle upcoming tasks.",
    },
    {
        requestId: "req2",
        clubName: "Tech Club",
        currentRep: "Charlie",
        requestedRep: { id: "rep2", name: "Diana" },
        reason: "Diana has more time to manage the club activities.",
    },
    {
        requestId: "req3",
        clubName: "Art Club",
        currentRep: "Eva",
        requestedRep: { id: "rep3", name: "Frank" },
        reason: "I would like to pursue other projects.",
    },
    {
        requestId: "req4",
        clubName: "Music Club",
        currentRep: "Grace",
        requestedRep: { id: "rep4", name: "Henry" },
        reason: "I want to explore new opportunities.",
    },
    {
        requestId: "req5",
        clubName: "Drama Club",
        currentRep: "Ivy",
        requestedRep: { id: "rep5", name: "Jack" },
        reason: "I prefer to focus on academics.",
    },
];

const ITEMS_PER_PAGE = 3;

const AdminRepRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<RepChangeRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<RepChangeRequest | null>(null);
    const [decision, setDecision] = useState<"approve" | "deny" | null>(null);
    const [denyReason, setDenyReason] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        async function fetchRequests() {
            try {
                // Simulate API delay
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

    const handleReview = (req: RepChangeRequest) => {
        setSelectedRequest(req);
        setDecision(null);
        setDenyReason("");
    };

    const handleCloseDialog = () => {
        setSelectedRequest(null);
        setDecision(null);
        setDenyReason("");
    };

    const handleSubmitDecision = () => {
        if (!selectedRequest || !decision) return;
        console.log("Admin decision:", { decision, denyReason }, "for request:", selectedRequest.requestId);
        // Remove the request from list after processing
        setRequests((prev) =>
            prev.filter((r) => r.requestId !== selectedRequest.requestId)
        );
        handleCloseDialog();
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="flex justify-center">
            <div className="p-4 w-2/3">
                <h2 className="text-2xl font-bold mb-6 text-center">Representative Change Requests</h2>
                {loading ? (
                    <p className="text-center">Loading requests...</p>
                ) : error ? (
                    <p className="text-center text-red-500">Error: {error}</p>
                ) : requests.length === 0 ? (
                    <p className="text-center">No change requests available.</p>
                ) : (
                    <>
                        <div className="space-y-4">
                            {currentRequests.map((req) => (
                                <MagicCard
                                    key={req.requestId}
                                    className="cursor-pointer flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
                                    gradientColor="#D1EAF0"
                                >
                                    <Card className="shadow">
                                        <CardHeader>
                                            <div className="flex items-center space-x-2">
                                                <Users size={24} className="text-blue-500" />
                                                <CardTitle>{req.clubName}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="flex items-center space-x-2">
                                                <User size={16} className="text-gray-500" />
                                                <span>
                                                    <strong>Current Representative:</strong> {req.currentRep}
                                                </span>
                                            </p>
                                            <p className="flex items-center space-x-2 mt-1">
                                                <User size={16} className="text-gray-500" />
                                                <span>
                                                    <strong>Requested Representative:</strong> {req.requestedRep.name}
                                                </span>
                                            </p>
                                            <p className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                                                <MessageSquare size={16} className="text-gray-500" />
                                                <span>
                                                    <strong>Reason:</strong> {req.reason}
                                                </span>
                                            </p>
                                        </CardContent>
                                        <CardFooter className="flex justify-end">
                                            <Button onClick={() => handleReview(req)}>
                                                <Edit3 size={16} className="mr-2" />
                                                View
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </MagicCard>
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
                    </>
                )}
                {selectedRequest && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-md shadow-lg w-full max-w-md p-4">
                            <h3 className="text-xl font-bold mb-4">Review Request</h3>
                            <p className="mb-2">
                                <strong>Club:</strong> {selectedRequest.clubName}
                            </p>
                            <p className="mb-2">
                                <strong>Current Rep:</strong> {selectedRequest.currentRep}
                            </p>
                            <p className="mb-2">
                                <strong>Requested Rep:</strong> {selectedRequest.requestedRep.name}
                            </p>
                            <p className="mb-4">
                                <strong>Reason:</strong> {selectedRequest.reason}
                            </p>
                            <label className="block text-sm font-medium mb-1">Decision</label>
                            <div className="flex space-x-2 mb-4">
                                <Button
                                    variant={decision === "approve" ? "default" : "outline"}
                                    onClick={() => setDecision("approve")}
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant={decision === "deny" ? "default" : "outline"}
                                    onClick={() => setDecision("deny")}
                                >
                                    Deny
                                </Button>
                            </div>
                            {decision === "deny" && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Deny Reason
                                    </label>
                                    <textarea
                                        placeholder="Enter reason for denial"
                                        value={denyReason}
                                        onChange={(e) => setDenyReason(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            )}
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={handleCloseDialog}>
                                    Cancel
                                </Button>
                                {decision !== null && (
                                    <Button onClick={handleSubmitDecision}>Submit Decision</Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminRepRequestsPage;
