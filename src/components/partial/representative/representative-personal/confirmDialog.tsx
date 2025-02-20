import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import {
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { Package } from "@/models/Package";
import { PackageCurrent } from "@/api/agent/PackageAgent";

interface confirmDialog {
    open: boolean,
    setOpen: (open: boolean) => void
}

export default function ConfirmDialog({ open, setOpen }: confirmDialog) {
    const { user } = useAuth();
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();
    const [plan, setPlan] = useState<Package>();
    const handleClick = async () => {
        navigate('/extend-checkout', {
            state: { selectedPlan: plan }
        });
    };
    useEffect(() => {
        async function fetchContractDetail() {
            if (user) {
                const response = await PackageCurrent(user.representativeId);
                setPlan(response.data);
            }
        }
        fetchContractDetail();
    }, [user]);
    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Alert</DialogTitle>
                    </DialogHeader>
                    <div>
                        Do you want to extend this package
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
