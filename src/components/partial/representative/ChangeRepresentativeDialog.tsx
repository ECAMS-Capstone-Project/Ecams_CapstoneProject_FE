import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface ChangeRepresentativeDialogProps {
    onClose: () => void;
    onSubmit: (data: {
        candidateName: string;
        candidateEmail: string;
    }) => void;
}

const ChangeRepresentativeDialog: React.FC<ChangeRepresentativeDialogProps> = ({
    onClose,
    onSubmit,
}) => {
    const [candidateName, setCandidateName] = useState<string>("");
    const [candidateEmail, setCandidateEmail] = useState<string>("");

    const handleSubmit = () => {
        onSubmit({ candidateName, candidateEmail });
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Request to Change Representative</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Please enter the basic information of the candidate for the new representative, including their name and email, along with your reason for requesting this change.
                    </p>
                    <div>
                        <label className="block text-sm font-medium mb-1">Candidate Name</label>
                        <Input
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            placeholder="Enter candidate name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Candidate Email</label>
                        <Input
                            type="email"
                            value={candidateEmail}
                            onChange={(e) => setCandidateEmail(e.target.value)}
                            placeholder="Enter candidate email"
                        />
                    </div>
                </div>
                <DialogFooter className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Submit Request</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeRepresentativeDialog;
