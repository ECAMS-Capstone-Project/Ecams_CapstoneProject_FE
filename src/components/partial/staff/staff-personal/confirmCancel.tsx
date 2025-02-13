import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import {
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { Contract } from "@/models/Contract";
import { CancelContractStaff } from "@/api/staff/ContractAPI";

interface confirmDialog {
    open: boolean,
    setOpen: (open: boolean) => void
    contract: Contract | null
    setFlag: (flag: boolean | ((prevFlag: boolean) => boolean)) => void
}

export default function ConfirmCancelDialog({ open, setOpen, contract, setFlag }: confirmDialog) {
    const { user } = useAuth();
    const handleClose = () => setOpen(false);
    const handleClick = async () => {
        if (contract && user) {
            await CancelContractStaff(contract.contractId, user.staffId)
            setFlag((prevFlag: boolean) => !prevFlag)
        }
    };
    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Alert</DialogTitle>
                    </DialogHeader>
                    <div>
                        Do you want to cancel this contract
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button onClick={handleClose} variant="outline" >
                            No
                        </Button>
                        <Button onClick={handleClick}>Yes</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
