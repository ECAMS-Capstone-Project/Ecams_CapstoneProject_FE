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

interface confirmDialog {
    open: boolean,
    setOpen: (open: boolean) => void
}
const plan = {
    packageId: "pkg_002",
    packageName: "Gói Nâng Cao",
    createdBy: "admin",
    updatedBy: "user_456",
    price: 20000,
    status: true,
    duration: 3,
    description: "Gói nâng cao dành cho người học chuyên sâu.",
    endOfSupportDate: "2027-06-30",
    packageDetails: [
        {
            packageServiceId: "svc_003",
            packageType: "Students",
            value: "Hỗ trợ học tập nâng cao",
        },
        {
            packageServiceId: "svc_004",
            packageType: "Events",
            value: "Vé tham gia sự kiện đặc biệt",
        },
    ],
}

export default function ConfirmDialog({ open, setOpen }: confirmDialog) {
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();
    const handleClick = async () => {
        navigate('/extend-checkout', {
            state: { selectedPlan: plan }
        });
    };
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
