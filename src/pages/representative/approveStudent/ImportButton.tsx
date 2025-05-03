/* eslint-disable @typescript-eslint/no-unused-expressions */
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Download, AlertCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

// import fileUrl from "../../../../assets/template/Template_Import_Syllabus.xlsx";

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
  setFlag,
}: {
  visible: boolean;
  onClose: () => void;
  setIsLoading?: (isLoading: boolean) => void;
  setFlag?: (flag: boolean) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicatedRows, setDuplicatedRows] = useState<DuplicatedRow[]>([]);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (file && validTypes.some((type) => file.type.includes(type))) {
      setFileList([file]);
    } else {
      toast.error("Please select a valid Excel or CSV file");
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
          // setShowDuplicateDialog(true);
          toast.success(
            "Import successful but some rows were duplicated and not imported"
          );
        } else {
          toast.success("Import successful");
          setIsLoading?.(false);
          setFlag?.(true);
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
      const blob = await response.blob();
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
            <DialogTitle className="text-xl font-semibold">
              Import Students
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* File Upload Section */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <Input
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    {fileList.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <span>{fileList[0].name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFileList([]);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="font-medium text-blue-600">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                        <span className="text-xs text-gray-500">
                          .xlsx or .csv files only
                        </span>
                      </>
                    )}
                  </div>
                </Label>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Download className="h-4 w-4" />
                <span>Need a template?</span>
                <Button
                  variant="link"
                  className="text-blue-600 p-0 h-auto font-medium"
                  onClick={handleDownload}
                >
                  Download Template
                </Button>
              </div>
            </div>

            {/* Duplicate Warning */}
            {duplicatedRows.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Duplicate Students Found</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  {duplicatedRows.length} students were not imported due to
                  duplicates
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setShowDuplicateDialog(true)}
                >
                  View Details
                </Button>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!fileList.length || uploading}
                className="min-w-[100px]"
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <l-pinwheel
                      size="20"
                      stroke="3"
                      speed="0.9"
                      color="white"
                    ></l-pinwheel>
                    <span>Importing...</span>
                  </div>
                ) : (
                  "Import"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Duplicated Students
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Email</TableHead>
                  <TableHead className="font-medium">Student ID</TableHead>
                  <TableHead className="font-medium">Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {duplicatedRows.map((row) => (
                  <TableRow key={row.rowNumber}>
                    <TableCell className="font-medium">{row.email}</TableCell>
                    <TableCell>{row.studentDetailId}</TableCell>
                    <TableCell className="text-red-600">
                      {row.message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => setShowDuplicateDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
