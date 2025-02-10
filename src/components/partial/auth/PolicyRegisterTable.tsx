import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Policy } from "@/models/Policy";

interface PolicyProps {
  data: Policy[];
}

export function PolicyRegisterTable({ data }: PolicyProps) {
  return (
    <>
      <div className="w-full p-2">
        <Table className="mt-2">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Title</TableHead>
              <TableHead className="text-center">Description</TableHead>
              <TableHead className="text-center">Effective Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((report) => (
              <TableRow key={report.policyId} className="text-center">
                <TableCell className="text-center">{report.title}</TableCell>
                <TableCell>{report.description}</TableCell>
                <TableCell className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                  {report.effectiveAt.toString().split("T")[0]}
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
