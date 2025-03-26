import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export interface ReviewRequest {
    requestId: string;
    clubId: string;
    clubName: string;
    currentOwner: string;
    requestedCandidate: { id: string; name: string };
    requestReason: string;
}

interface RepresentativeReviewRequestDialogProps {
    request: ReviewRequest;
    // Danh sách thành viên hiện có trong club (để chọn khi approve)
    memberList: { id: string; name: string }[];
    onClose: () => void;
    // Khi representative ra quyết định:
    // - "approve" kèm id thành viên được chọn để làm club-owner mới.
    // - "deny" kèm lý do từ chối.
    onSubmit: (
        decision: "approve" | "deny",
        options: { denyReason?: string; selectedMemberId?: string }
    ) => void;
}

const RepresentativeReviewRequestDialog: React.FC<RepresentativeReviewRequestDialogProps> = ({
    request,
    memberList,
    onClose,
    onSubmit,
}) => {
    const [decision, setDecision] = useState<"approve" | "deny" | "">("");
    const [denyReason, setDenyReason] = useState<string>("");
    const [selectedMember, setSelectedMember] = useState<string>(
        memberList[0]?.id || ""
    );

    const handleSubmit = () => {
        if (decision === "deny") {
            onSubmit("deny", { denyReason });
        } else if (decision === "approve") {
            onSubmit("approve", { selectedMemberId: selectedMember });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Card className="max-w-xl w-full">
                <CardHeader>
                    <CardTitle>Review Change Request</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-2">
                        <strong>Club:</strong> {request.clubName}
                    </div>
                    <div className="mb-2">
                        <strong>Current Owner:</strong> {request.currentOwner}
                    </div>
                    <div className="mb-2">
                        <strong>Requested Candidate:</strong> {request.requestedCandidate.name}
                    </div>
                    <div className="mb-4">
                        <strong>Request Reason:</strong> {request.requestReason}
                    </div>
                    {/* Decision Buttons - hiển thị luôn */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Decision</label>
                        <div className="flex space-x-4">
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
                    {/* Các trường nhập liệu xuất hiện khi có quyết định */}
                    {decision === "deny" && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Deny Reason
                            </label>
                            <textarea
                                placeholder="Enter reason for denial"
                                value={denyReason}
                                onChange={(e) => setDenyReason(e.target.value)}
                            />
                        </div>
                    )}
                    {decision === "approve" && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Select Member to Promote
                            </label>
                            <Select
                                value={selectedMember}
                                onValueChange={(val) => setSelectedMember(val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {memberList.map((member) => (
                                        <SelectItem key={member.id} value={member.id}>
                                            {member.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </CardContent>
                {/* Chỉ hiển thị CardFooter nếu đã có quyết định */}
                {decision !== "" && (
                    <CardFooter className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>Submit Decision</Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};

export default RepresentativeReviewRequestDialog;
