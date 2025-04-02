import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { ClubOwnerChangeResponseDTO } from "@/api/representative/RequestChangeOwner";
import { UserCircleIcon } from "lucide-react";

interface RepresentativeReviewRequestDialogProps {
    request: ClubOwnerChangeResponseDTO;
    onClose: () => void;
    onSubmit: (
        decision: "approve" | "deny",
        options: { denyReason?: string; selectedMemberId?: string }
    ) => void;
}

const RepresentativeReviewRequestDialog: React.FC<RepresentativeReviewRequestDialogProps> = ({
    request,
    onClose,
    onSubmit,
}) => {
    const [decision, setDecision] = useState<"approve" | "deny" | "">("");
    const [denyReason, setDenyReason] = useState<string>("");

    const handleSubmit = () => {
        if (decision === "deny") {
            onSubmit("deny", { denyReason });
        } else if (decision === "approve") {
            onSubmit("approve", { selectedMemberId: request.requestedPerson?.clubMemberId });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Card className="max-w-2xl w-full rounded-xl shadow-xl">
                <CardHeader className="border-b p-6">
                    <CardTitle className="text-xl font-bold">Review Change Request</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-center gap-4">
                            <UserCircleIcon className="h-8 w-8 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-500">Current Owner</p>
                                <p className="font-medium">{request.owner?.fullname}</p>
                                <p className="text-xs text-gray-500">{request.owner?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-purple-50 p-3 rounded-lg">
                            <UserCircleIcon className="h-8 w-8 text-purple-600" />
                            <div>
                                <p className="text-sm text-gray-500">Requested Candidate</p>
                                <p className="font-medium text-purple-700">{request.requestedPerson?.fullname}</p>
                                <p className="text-xs text-gray-500">{request.requestedPerson?.email}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1 font-medium">Request Reason</p>
                        <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded-md leading-relaxed">
                            {request.requestedPerson?.reason}
                        </p>
                    </div>

                    {/* Decision Selection */}
                    <div>
                        <p className="text-sm font-medium mb-2">Your Decision</p>
                        <div className="flex gap-4">
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
                    </div>

                    {decision === "deny" && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Reason for Denial</label>
                            <textarea
                                placeholder="Enter reason..."
                                value={denyReason}
                                onChange={(e) => setDenyReason(e.target.value)}
                                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                rows={3}
                            />
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-end gap-2 border-t p-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    {decision && (
                        <Button onClick={handleSubmit}>Submit Decision</Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default RepresentativeReviewRequestDialog;
