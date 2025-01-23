/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export const DenyRequest = () => {
  async function handleReject() {
    try {
      console.log("Rejecting university...");
      // Call API để xử lý từ chối
      toast.success("University rejected successfully.");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  }

  return (
    <DialogContent className=" max-w-lg">
      <DialogHeader className="">
        <DialogTitle>Reject request</DialogTitle>
        <DialogDescription>
          Giving the reason for rejecting the request.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 p-4">
        <div className="grid grid-cols-1 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Reason:
          </Label>
          <textarea className="col-span-1 rounded border border-[#CBD5E1]" />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button onClick={handleReject} color="primary">
            Reject
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};
