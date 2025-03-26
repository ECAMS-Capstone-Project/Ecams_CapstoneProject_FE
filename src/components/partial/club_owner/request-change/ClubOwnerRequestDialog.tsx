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

interface ClubOwnerRequestDialogProps {
    onClose: () => void;
    onSubmit: (data: { candidateId: string; reason: string }) => void;
    // Danh sách ứng viên (các club‑owner khác có thể nhận nhiệm vụ)
    candidateList: { id: string; name: string }[];
}

const ClubOwnerRequestDialog: React.FC<ClubOwnerRequestDialogProps> = ({
    onClose,
    onSubmit,
    candidateList,
}) => {
    const [selectedCandidate, setSelectedCandidate] = useState<string>(
        candidateList[0]?.id || ""
    );
    const [reason, setReason] = useState<string>("");

    const handleSubmit = () => {
        onSubmit({ candidateId: selectedCandidate, reason });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle>Request Change Club Owner</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-sm text-gray-600">
                        Please select a new club owner candidate for your club.
                    </p>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Club Owner Candidate
                        </label>
                        <Select
                            value={selectedCandidate}
                            onValueChange={(val) => setSelectedCandidate(val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select candidate" />
                            </SelectTrigger>
                            <SelectContent>
                                {candidateList.map((candidate) => (
                                    <SelectItem key={candidate.id} value={candidate.id}>
                                        {candidate.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reason
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your reason for the request"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Submit Request</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ClubOwnerRequestDialog;
