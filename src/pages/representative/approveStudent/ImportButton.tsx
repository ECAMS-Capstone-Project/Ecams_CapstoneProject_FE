/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// import fileUrl from "../../../../assets/template/Template_Import_Syllabus.xlsx";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

interface DuplicatedRow {
  rowNumber: number;
  email: string;
  studentDetailId: string;
  message: string;
}

export default function ImportButton({
  visible,
  onClose,
  setIsLoading,
}: {
  visible: boolean;
  onClose: () => void;
  setIsLoading?: (isLoading: boolean) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicatedRows, setDuplicatedRows] = useState<DuplicatedRow[]>([]);
  const { user } = useAuth();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);

    const file = e.target.files?.[0];
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (file && validTypes.some((type) => file.type.includes(type))) {
      setFileList([file]);
    } else {
      toast.error("Invalid file type");
    }
  };

  const handleUpload = async () => {
    if (!fileList.length) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("ImportFile", fileList[0]);
    formData.append("HasHeader", "true");
    formData.append("UniversityId", user?.universityId ?? "");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_ECAMS_API_URL}/File/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
      } else {
        if (data.data.duplicatedRows && data.data.duplicatedRows.length > 0) {
          setDuplicatedRows(data.data.duplicatedRows);
          //   setShowDuplicateDialog(true);
          toast.error("Some rows were duplicated and not imported");
        } else {
          toast.success("Import successful");
          setIsLoading?.(false);
          onClose();
        }
      }
    } catch (err) {
      toast.error("Error during import");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ECAMS_API_URL}/File/dowload`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }
      const blob = await response.blob(); // Đảm bảo là phương thức blob() tồn tại
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Template_Import_Student.xlsx";
      link.click();
    } catch (error) {
      console.error("Download failed", error);
      toast.error("Download failed");
    }
  };

  return (
    <>
      <Dialog
        open={visible}
        onOpenChange={(open) => {
          if (!open && !showDuplicateDialog) {
            onClose();
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Import Student</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <Label htmlFor="file">Select File (.xlsx)</Label>
              <Input
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileChange}
              />
            </div>

            {/* Encoding Type */}
            <div>
              <Label>Encoding type</Label>
              <Select defaultValue="autodetect">
                <SelectTrigger>
                  <SelectValue placeholder="Encoding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="autodetect">Auto detect</SelectItem>
                  <SelectItem value="utf">UTF-8</SelectItem>
                  <SelectItem value="ansi">ANSI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Separator */}
            <div>
              <Label>Column Separator</Label>
              <Select defaultValue="comma">
                <SelectTrigger>
                  <SelectValue placeholder="Separator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comma">Comma</SelectItem>
                  <SelectItem value="semicolon">Semi-colon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label>Download Template:</Label>
              <Button
                variant="link"
                className="text-blue-600 p-0 h-auto"
                onClick={handleDownload}
              >
                Download
              </Button>
            </div>
            {duplicatedRows.length > 0 && (
              <div className="flex items-center gap-2">
                <Label className="text-red-500 text-base">
                  Duplicate Student:
                </Label>
                <Button
                  variant="outline"
                  className="text-red-400 text-sm"
                  onClick={() => setShowDuplicateDialog(true)}
                >
                  View
                </Button>
              </div>
            )}
            {/* Footer Actions */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!fileList.length || uploading}
              >
                Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Duplicated Students</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {duplicatedRows.map((row) => (
                  <TableRow key={row.rowNumber}>
                    <TableCell>{row.email}</TableCell>

                    <TableCell>{row.studentDetailId}</TableCell>
                    <TableCell>{row.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowDuplicateDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
