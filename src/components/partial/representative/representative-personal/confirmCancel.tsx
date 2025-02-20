/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { Contract } from "@/models/Contract";
import { CancelContractRepresentative } from "@/api/representative/ContractAPI";
import { useState } from "react";

interface ConfirmDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    contract: Contract | null;
}

export default function ConfirmCancelDialog({
    open,
    setOpen,
    contract,
}: ConfirmDialogProps) {
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        if (!isLoading) {
            setOpen(false);
        }
    };

    const handleClick = async () => {
        if (!contract || !user) return;
        setIsLoading(true);
        try {
            await CancelContractRepresentative(contract.contractId, user.representativeId);
            setOpen(false);
            window.location.reload();
        } catch (error: any) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Alert</DialogTitle>
                </DialogHeader>

                {/* Nội dung */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-20">
                        <span className="loader" /> {/* Hoặc bạn có thể dùng spinner tuỳ thích */}
                        <span className="ml-2 text-gray-600">Processing...</span>
                    </div>
                ) : (
                    <>
                        <div>Do you want to cancel this contract?</div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button onClick={handleClose} variant="outline" disabled={isLoading}>
                                No
                            </Button>
                            <Button onClick={handleClick} disabled={isLoading}>
                                Yes
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
