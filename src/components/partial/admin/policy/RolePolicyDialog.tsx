import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Policy } from "@/models/Policy";

interface PolicyProps {
  data: Policy[];
}

export function RolePolicyTable({ data }: PolicyProps) {
  return (
    <>
      <div className="w-full p-3">
        <DialogHeader>
          <DialogTitle>{"View Policy Details"}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {"View the policy details below."}
        </DialogDescription>
        <Table className="mt-4">
          <TableCaption>A list of your policy.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>Created Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((report) => (
              <TableRow key={report.policyId}>
                <TableCell>{report.title}</TableCell>
                <TableCell>{report.description}</TableCell>
                <TableCell className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                  {report.effectiveAt.toString().split("T")[0]}
                </TableCell>
                <TableCell>
                  {report.createdDate.toString().split("T")[0]}
                </TableCell>
                <TableCell className=" flex justify-center items-center"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
