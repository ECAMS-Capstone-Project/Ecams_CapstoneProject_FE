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
import { UserCircleIcon, EyeIcon } from "lucide-react";
import LoadingAnimation from "@/components/ui/loading";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface RepresentativeReviewRequestDialogProps {
    request: ClubOwnerChangeResponseDTO;
    onClose: () => void;
    onSubmit: (
        decision: "approve" | "deny",
        options: { denyReason?: string; selectedMemberId?: string }
    ) => void;
    isSubmitting: boolean;
}

const RepresentativeReviewRequestDialog: React.FC<
    RepresentativeReviewRequestDialogProps
> = ({ request, onClose, onSubmit, isSubmitting }) => {
    const [decision, setDecision] = useState<"approve" | "deny" | "">("");
    const [denyReason, setDenyReason] = useState<string>("");
    const [viewingUser, setViewingUser] = useState<
        | {
            title: string;
            user: ClubOwnerChangeResponseDTO["owner"];
        }
        | null
    >(null);

    const handleSubmit = () => {
        if (decision === "deny") {
            onSubmit("deny", { denyReason });
        } else if (decision === "approve") {
            onSubmit("approve", {
                selectedMemberId: request.requestedPerson?.clubMemberId,
            });
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
                        {/* Current Owner */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <UserCircleIcon className="h-8 w-8 text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Current Owner</p>
                                    <p className="font-medium">{request.owner?.fullname}</p>
                                    <p className="text-xs text-gray-500">{request.owner?.email}</p>
                                </div>
                            </div>
                            <EyeIcon
                                className="w-5 h-5 text-gray-500 cursor-pointer hover:text-black"
                                onClick={() =>
                                    setViewingUser({
                                        title: "Current Owner",
                                        user: request.owner,
                                    })
                                }
                            />
                        </div>

                        {/* Requested Candidate */}
                        <div className="flex items-center justify-between gap-4 bg-purple-50 p-3 rounded-lg">
                            <div className="flex items-center gap-4">
                                <UserCircleIcon className="h-8 w-8 text-purple-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Requested Candidate</p>
                                    <p className="font-medium text-purple-700">
                                        {request.requestedPerson?.fullname}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {request.requestedPerson?.email}
                                    </p>
                                </div>
                            </div>
                            <EyeIcon
                                className="w-5 h-5 text-purple-600 cursor-pointer hover:text-purple-800"
                                onClick={() =>
                                    setViewingUser({
                                        title: "Requested Candidate",
                                        user: request.requestedPerson,
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <p className="text-sm text-gray-500 mb-1 font-medium">Request Reason</p>
                        <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded-md leading-relaxed">
                            {request.owner?.leaveReason}
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
                            <label className="block text-sm font-medium mb-1">
                                Reason for Denial
                            </label>
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
                        <Button disabled={isSubmitting} onClick={handleSubmit}>
                            {isSubmitting ? <LoadingAnimation /> : "Submit Decision"}
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {/* View user info dialog */}
            {viewingUser && (
                <Dialog open={true} onOpenChange={() => setViewingUser(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader className="flex items-center gap-3">
                            <UserCircleIcon className="h-6 w-6 text-primary" />
                            <DialogTitle className="text-lg">{viewingUser.title} Info</DialogTitle>
                        </DialogHeader>

                        <div className="mt-4 flex flex-col sm:flex-row gap-4">
                            {/* Left column: Avatar */}
                            <div className="flex flex-col items-center w-full sm:w-1/3">
                                <img
                                    src={viewingUser.user.avatar || `https://api.dicebear.com/6.x/initials/svg?seed=${viewingUser.user.fullname}`}
                                    alt={viewingUser.user.fullname}
                                    className="w-16 h-16 rounded-full object-cover border"
                                />
                                <p className="text-sm font-medium mt-2 text-center">{viewingUser.user.fullname}</p>
                            </div>

                            {/* Right column: Info */}
                            <div className="text-sm space-y-2 text-gray-700 w-full sm:w-2/3">
                                <div><span className="font-medium">Email:</span> {viewingUser.user.email}</div>
                                <div><span className="font-medium">Student ID:</span> {viewingUser.user.studentId}</div>
                                <div><span className="font-medium">Activity Point:</span> {viewingUser.user.clubActivityPoint}</div>
                                <div><span className="font-medium">Position:</span> {viewingUser.user.clubRoleName}</div>
                                {viewingUser.user.joinedAt && (
                                    <div><span className="font-medium">Joined At:</span> {format(new Date(viewingUser.user.joinedAt), "dd/MM/yyyy")}</div>
                                )}
                                {viewingUser.user.leftDate && (
                                    <div><span className="font-medium">Left At:</span> {format(new Date(viewingUser.user.leftDate), "dd/MM/yyyy")}</div>
                                )}
                                <div>
                                    <span className="font-medium">Status:</span>{" "}
                                    <span className={
                                        viewingUser.user.status === "ACTIVE"
                                            ? "text-green-600 font-semibold"
                                            : "text-orange-400 font-semibold"
                                    }>
                                        {viewingUser.user.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default RepresentativeReviewRequestDialog;