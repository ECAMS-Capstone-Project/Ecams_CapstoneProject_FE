import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Report } from "@/models/Report";
import { EyeIcon } from "lucide-react";
import { ReportDetailDialog } from "./ReportDetailDialog";

interface ReportProps {
  data: Report[];
}

export function ReportTable({ data }: ReportProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setSelectedReport] = useState<Report | null>(null);

  const handleViewDetail = (report: Report) => {
    setSelectedReport(report);
  };

  return (
    <>
      <Table>
        <TableCaption>A list of your pending university.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Report Title</TableHead>
            <TableHead>Report Type</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((report) => (
            <TableRow key={report.ReportId}>
              <TableCell className="font-medium">
                {report.ReportTitle}
              </TableCell>
              <TableCell>{report.ReportType}</TableCell>
              <TableCell className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                {report.Content}
              </TableCell>
              <TableCell>{report.UserId}</TableCell>
              <TableCell className=" flex justify-center items-center">
                <ReportDetailDialog
                  report={report}
                  trigger={
                    <EyeIcon
                      size={24}
                      className="cursor-pointer"
                      onClick={() => handleViewDetail(report)}
                    />
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
