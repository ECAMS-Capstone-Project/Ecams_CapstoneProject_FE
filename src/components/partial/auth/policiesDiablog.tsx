import * as React from "react";
import { Policy } from "@/models/Policy";
import { getPolicyList } from "@/api/agent/PolicyAgent";
import StudentStaffPolicies from "./student-staff-Policy";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import {
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PolicyDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    handleAccept: () => void;
    handleDeny: () => void;
    type: string
}

export default function PoliciesDialog({
    open,
    setOpen,
    handleAccept,
    handleDeny,
    type
}: PolicyDialogProps) {
    const [listPolicies, setListPolicies] = React.useState<Policy[]>([]);

    const handleClose = () => setOpen(false);

    React.useEffect(() => {
        const loadPackage = async () => {
            try {
                const packageData = await getPolicyList(100, 1);
                setListPolicies(packageData.data?.data || []);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.log(error.message);
            }
        };
        if (open) loadPackage();
    }, [open]);

    return (
        <>
            {listPolicies && listPolicies.length > 0 && (
                <Dialog open={open} onOpenChange={handleClose}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Privacy Policies</DialogTitle>
                            <StudentStaffPolicies data={listPolicies} type={type} />
                        </DialogHeader>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={handleDeny}>
                                Disagree
                            </Button>
                            <Button onClick={handleAccept}>Agree</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
