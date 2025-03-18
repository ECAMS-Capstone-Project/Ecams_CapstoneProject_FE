import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClubCondition } from "@/api/club-owner/ClubByUser";

interface EditClubConditionDialogProps {
    open: boolean;
    condition: ClubCondition | null;
    onClose: () => void;
    onSave: (updatedCondition: ClubCondition) => void;
}

export function EditClubConditionDialog({
    open,
    condition,
    onClose,
    onSave,
}: EditClubConditionDialogProps) {
    const [conditionName, setConditionName] = useState("");
    const [conditionContent, setConditionContent] = useState("");
    const [description, setDescription] = useState("");

    // State lưu lỗi cho từng field
    const [errors, setErrors] = useState<{
        conditionName?: string;
        conditionContent?: string;
        description?: string;
    }>({});

    // Khi condition thay đổi (mở dialog mới) thì cập nhật giá trị ban đầu cho các field
    useEffect(() => {
        if (condition) {
            setConditionName(condition.conditionName);
            setConditionContent(condition.conditionContent);
            setDescription(condition.description);
            setErrors({});
        }
    }, [condition]);

    // Validate các field trước khi gọi onSave
    const validateFields = (): boolean => {
        const newErrors: {
            conditionName?: string;
            conditionContent?: string;
            description?: string;
        } = {};

        if (!conditionName.trim()) {
            newErrors.conditionName = "Condition Name is required";
        }
        if (!conditionContent.trim()) {
            newErrors.conditionContent = "Condition Content is required";
        }
        if (!description.trim()) {
            newErrors.description = "Description is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateFields()) {
            return;
        }
        if (condition) {
            // Nếu không có thay đổi so với giá trị ban đầu, chỉ đóng dialog mà không gọi API
            if (
                conditionName === condition.conditionName &&
                conditionContent === condition.conditionContent &&
                description === condition.description
            ) {
                onClose();
                return;
            }
            // Gọi onSave với thông tin đã cập nhật
            onSave({
                ...condition,
                conditionName,
                conditionContent,
                description,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="sm:max-w-lg sm:w-full">
                <DialogHeader>
                    <DialogTitle>Edit Club Condition</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="condition-name" className="block text-sm font-medium text-gray-700">
                            Condition Name
                        </Label>
                        <Input
                            id="condition-name"
                            value={conditionName}
                            onChange={(e) => setConditionName(e.target.value)}
                            placeholder="Condition Name"
                            className="w-full"
                        />
                        {errors.conditionName && (
                            <p className="text-red-500 text-sm">{errors.conditionName}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="condition-content" className="block text-sm font-medium text-gray-700">
                            Condition Content
                        </Label>
                        <Input
                            id="condition-content"
                            value={conditionContent}
                            onChange={(e) => setConditionContent(e.target.value)}
                            placeholder="Condition Content"
                            className="w-full"
                        />
                        {errors.conditionContent && (
                            <p className="text-red-500 text-sm">{errors.conditionContent}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </Label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            className="w-full p-2 border rounded-md"
                            rows={3}
                        ></textarea>
                        {errors.description && (
                            <p className="text-red-500 text-sm">{errors.description}</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
