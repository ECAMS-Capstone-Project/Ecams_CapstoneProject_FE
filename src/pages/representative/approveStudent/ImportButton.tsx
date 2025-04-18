/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// import fileUrl from "../../../../assets/template/Template_Import_Syllabus.xlsx";
import toast from "react-hot-toast";

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
    const [errorMessage, setErrorMessage] = useState<string[] | null>(null);

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
            toast.error("Invalid file type");
        }
    };

    const handleUpload = async () => {
        if (!fileList.length) return;
        setUploading(true);

        const formData = new FormData();
        formData.append("file", fileList[0]);

        try {
            const response = await fetch("https://your-api/import/syllabus", {
                method: "POST",
                body: formData,
                headers: {
                    // 'Authorization': 'Bearer token', nếu cần
                },
            });

            if (!response.ok) {
                const data = await response.json();
                const errors: string[] = Object.values(data.errors || {});
                setErrorMessage(errors);
            } else {
                toast.success("Import successful");
                setErrorMessage(null);
                setIsLoading?.(true);
                onClose();
            }
        } catch (err) {
            toast.error("Error during import");
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async () => {
        const link = document.createElement("a");
        const response = await fetch("https://res.cloudinary.com/ecams/raw/upload/v1744990294/Template1.xlsx");
        if (!response.ok) return toast.error("Download failed");

        const blob = await response.blob();
        link.href = URL.createObjectURL(blob);
        link.download = "Template_Import_Student.xlsx";
        link.click();
    };

    return (
        <Dialog open={visible} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Import Syllabus</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* File Upload */}
                    <div>
                        <Label htmlFor="file">Select File (.xlsx)</Label>
                        <Input type="file" accept=".xlsx,.csv" onChange={handleFileChange} />
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

                    {/* Template Download */}
                    <div className="flex items-center gap-2">
                        <Label>Import Template:</Label>
                        <Button variant="link" className="text-blue-600 p-0 h-auto" onClick={handleDownload}>
                            Download
                        </Button>
                    </div>

                    {/* Error Log */}
                    {errorMessage && (
                        <div className="border p-3 rounded-md bg-red-50 max-h-[150px] overflow-auto">
                            <h4 className="font-bold text-red-500">Error Log:</h4>
                            <ul className="list-disc pl-5 text-sm text-red-700">
                                {errorMessage.map((msg, idx) => (
                                    <li key={idx}>{msg}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpload} disabled={!fileList.length || uploading}>
                            Import
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
