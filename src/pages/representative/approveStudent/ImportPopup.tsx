/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Trash } from "lucide-react";
import toast from "react-hot-toast";

const fileURL = "/assets/template/ImportUserTemplate.xlsx"; // hoặc thay bằng import nếu cần
const backend_api = `${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`;

interface ImportPopupProps {
    onCancel: () => void;
    onUpdateData: () => void;
}

const ImportPopup: React.FC<ImportPopupProps> = ({ onCancel, onUpdateData }) => {
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        const isExcel = selected.name.endsWith(".xlsx") || selected.name.endsWith(".xls");
        if (!isExcel) {
            toast.error("You can upload only Excel files");
            return;
        }

        setFile(selected);
        setErrorMessage(null);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setErrorMessage(null);
    };

    const handleDownload = async () => {
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = "ImportUserTemplate.xlsx";
        link.target = "_blank";

        try {
            const response = await fetch(fileURL);
            if (!response.ok) throw new Error("Failed to fetch file");
            const blob = await response.blob();
            link.href = URL.createObjectURL(blob);
            link.click();
        } catch (err) {
            console.log(err);
            toast.error("Getting template file failed");
        }
    };

    const handleImport = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post(`${backend_api}/api/import-user`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = res.data;
            if (data.isSuccess) {
                toast.success("Import new user success");
                onUpdateData();
                setFile(null);
            } else {
                const errorMessages = data.message?.split(",") || ["Import failed"];
                setErrorMessage(errorMessages.join(", "));
                toast.error("Import new user failed");
            }
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || "Import failed";
            setErrorMessage(errorMsg);
            toast.error("Import new user failed");
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
                {file && (
                    <Card className="p-4 flex items-center justify-between">
                        <span>{file.name}</span>
                        <Button variant="destructive" size="icon" onClick={handleRemoveFile}>
                            <Trash className="w-4 h-4" />
                        </Button>
                    </Card>
                )}
            </div>

            <div className="flex gap-3">
                <Button onClick={handleImport} disabled={!file}>
                    Import
                </Button>
                <Button variant="destructive" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="secondary" onClick={handleDownload}>
                    <Download className="mr-2 w-4 h-4" />
                    Download Template
                </Button>
            </div>

            {errorMessage && (
                <Card className="p-4 border border-red-400">
                    <h3 className="text-red-600 font-semibold mb-2">Error Log:</h3>
                    <ScrollArea className="h-40">
                        {errorMessage.split(",").map((msg, index) => (
                            <p key={index} className="text-sm">
                                {msg.trim()}
                            </p>
                        ))}
                    </ScrollArea>
                </Card>
            )}
        </div>
    );
};

export default ImportPopup;
