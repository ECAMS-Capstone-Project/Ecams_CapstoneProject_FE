import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { University } from "@/models/University";
import { EyeIcon } from "lucide-react";

interface UniversityProps {
  data: University[];
}

export function RequestTable({ data }: UniversityProps) {
  return (
    <Table>
      <TableCaption>A list of your pending university.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>University Name</TableHead>
          <TableHead>Contact Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Subcription Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((university) => (
          <TableRow key={university.UniversityId}>
            <TableCell className="font-medium">
              {university.UniversityId}
            </TableCell>
            <TableCell>{university.UniversityName}</TableCell>
            <TableCell>{university.ContactEmail}</TableCell>
            <TableCell>
              <div
                className={`flex items-center justify-center rounded-lg px-2 py-1 text-sm font-medium ${
                  university.Status === "Active"
                    ? "bg-green-100 text-green-800 border border-green-200 py-1.5"
                    : university.Status === "Pending"
                    ? "bg-orange-100 text-orange-800 border border-orange-200 py-1.5"
                    : university.Status === "Inactive"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200 py-1.5"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                {university.Status}
              </div>
            </TableCell>
            <TableCell>{university.SubscriptionStatus}</TableCell>
            <TableCell>
              <EyeIcon size={24} className="text-center" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
