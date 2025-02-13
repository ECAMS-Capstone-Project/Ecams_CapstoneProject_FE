import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { UniversityFormDialog } from "../../university/UniversitDetailDialog";
import { useState } from "react";

interface UniversityProps {
  data: University[];
}

export function RequestTable({ data }: UniversityProps) {
  const [, setIsDialogOpen] = useState(false);
  return (
    <Table className="text-center">
      <TableCaption>A list of your pending university.</TableCaption>
      <TableHeader className="text-center">
        <TableRow>
          <TableHead className="text-center">Logo</TableHead>
          <TableHead className="text-center">University Name</TableHead>
          <TableHead className="text-center">Contact Email</TableHead>
          <TableHead className="text-center">Staff</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((university) => (
          <TableRow key={university.universityId}>
            <TableCell>
              {" "}
              <div className="flex flex-wrap gap-2 justify-center">
                <img
                  src={university.logoLink}
                  alt={"Product Image"}
                  className="w-10 h-10 object-cover"
                />
              </div>
            </TableCell>
            <TableCell>{university.universityName}</TableCell>
            <TableCell>{university.contactEmail}</TableCell>
            <TableCell>{university.staffName}</TableCell>
            <TableCell>
              <div
                className={`flex items-center justify-center rounded-lg px-2 py-1 text-sm font-medium ${
                  university.status === "ACTIVE"
                    ? "bg-green-100 text-green-800 border border-green-200 py-1.5"
                    : university.status === "PENDING"
                    ? "bg-orange-100 text-orange-800 border border-orange-200 py-1.5"
                    : university.status === "INACTIVE"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200 py-1.5"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                } w-2/3`}
              >
                {university.status}
              </div>
            </TableCell>
            <div className="flex  justify-center items-center">
              <TableCell>
                <Dialog>
                  <DialogTrigger>
                    <EyeIcon size={24} className="text-center" />
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <UniversityFormDialog
                      initialData={university}
                      mode={
                        university.status === "PENDING" ? "pending" : "view"
                      }
                      onClose={() => setIsDialogOpen}
                    />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </div>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
