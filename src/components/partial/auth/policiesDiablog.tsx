import * as React from "react";
import { Policy } from "@/models/Policy";
import { getPolicyList } from "@/api/agent/PolicyAgent";
import StudentStaffPolicies from "./student-staff-Policy";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PolicyDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleAccept: () => void;
  handleDeny: () => void;
  type: string;
}

export default function PoliciesDialog({
  open,
  setOpen,
  handleAccept,
  handleDeny,
  type,
}: PolicyDialogProps) {
  const [listPolicies, setListPolicies] = React.useState<Policy[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    const loadPackage = async () => {
      try {
        setLoading(true);
        const packageData = await getPolicyList(100, 1);
        setListPolicies(packageData.data?.data.filter(a=>a.roleName.includes("REPRESENTATIVE")) || []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (open) loadPackage();
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Policies</DialogTitle>
            {loading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <l-pinwheel
                  size="35"
                  stroke="3.5"
                  speed="0.9"
                  color="#136CB5"
                ></l-pinwheel>
              </div>
            ) : (
              listPolicies &&
              listPolicies.length >= 0 && (
                <>
                  <StudentStaffPolicies data={listPolicies} type={type} />
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={handleDeny}>
                      Disagree
                    </Button>
                    <Button onClick={handleAccept}>Agree</Button>
                  </div>
                </>
              )
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
