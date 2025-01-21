import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Report } from "@/models/Report";
import { DialogClose } from "@radix-ui/react-dialog";

interface ReportDetailDialogProps {
  report: Report | null;
  trigger: React.ReactNode;
}

export const ReportDetailDialog: React.FC<ReportDetailDialogProps> = ({
  report,
  trigger,
}) => {
  if (!report) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">View Report</DialogTitle>
          <DialogDescription>View your system report here.</DialogDescription>
        </DialogHeader>
        {/* <div className="space-y-4">
          <div className="grid grid-cols-2 gap-x-6 px-3">
            <div>
              <strong>Title:</strong>
              <input
                type="text"
                readOnly
                value={report.ReportTitle}
                className="border p-1 rounded w-full py-2"
              />
            </div>
            <div>
              <strong>Type:</strong>
              <input
                type="text"
                readOnly
                value={report.ReportType}
                className="border p-1 rounded w-full py-2"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-6 px-3">
            <div>
              <strong>User:</strong>
              <input
                type="text"
                readOnly
                value={report.UserId}
                className="border p-1 rounded w-full py-2"
              />
            </div>
            <div>
              <strong>Created Date:</strong>
              <input
                type="text"
                readOnly
                value={report.CreatedAt}
                className="border p-1 rounded w-full py-2"
              />
            </div>
          </div>
          <div className="px-3">
            <strong>Content:</strong>
            <textarea
              readOnly
              value={report.Content}
              className="border p-2 rounded w-full h-40"
            />
          </div>
        </div> 
        */}
        <div className="space-y-4 px-4">
          <div>
            <strong>Title:</strong> {report.ReportTitle}
          </div>
          <div>
            <strong>Type:</strong> {report.ReportType}
          </div>
          <div>
            <strong>User:</strong> {report.UserId}
          </div>
          <div>
            <strong>Created Date:</strong> {report.CreatedAt}
          </div>
          <div>
            <strong>Content:</strong>
            <div className="p-4 bg-gray-100 rounded mt-2">{report.Content}</div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="default">Quit</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
