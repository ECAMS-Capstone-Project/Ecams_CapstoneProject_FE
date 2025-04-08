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
import useAuth from "@/hooks/useAuth";
import { CreateRequestChangeRepresentativeAPI } from "@/api/representative/RequestChangeRepresentative";
import toast from "react-hot-toast";

const ChangeRepresentativeDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { user } = useAuth();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEmailValid = (email: string) =>
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

    const handleSubmit = async () => {
        if (!email) {
            setError("Email is required.");
            return;
        } else if (!isEmailValid(email)) {
            setError("Invalid email format.");
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            if (!user?.universityId) return;

            const payload = {
                universityId: user.universityId,
                representativeInfo: { email },
            };

            await CreateRequestChangeRepresentativeAPI(user.universityId, payload);
            toast.success("Request submitted successfully.");
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-sm rounded-xl shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        Change Representative Request
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                        Enter the email of the new representative you wish to request.
                    </p>
                </DialogHeader>

                <div className="mt-4 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email address</label>
                    <Input
                        placeholder="e.g. john.doe@example.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        type="email"
                    />
                    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                </div>

                <DialogFooter className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeRepresentativeDialog;
