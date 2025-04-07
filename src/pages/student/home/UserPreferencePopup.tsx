import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FieldDTO, GetAllFields } from "@/api/club-owner/RequestClubAPI";
import { UpdateUserPreferenceAPI } from "@/api/student/UserPreference";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
interface props{
    setFlag: React.Dispatch<React.SetStateAction<boolean>>;
    flag: boolean
    user: UserAuthDTO | undefined
}
const UserPreferencePopup: React.FC<props> = ({ setFlag, flag, user }) => {
    const [open, setOpen] = useState(false);
    const [fields, setFields] = useState<FieldDTO[]>([]);
    const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([]);
    const [doNotShowAgain, setDoNotShowAgain] = useState<boolean>(false);
    useEffect(() => {
        const suppressed = localStorage.getItem("suppressPreferencePopup");

        if (user?.isRecommended !== true && suppressed !== "true") {
            setOpen(true);
        }else{
            setOpen(false);
        }

        const fetchFields = async () => {
            try {
                const response = await GetAllFields();
                setFields(response.data || []);
            } catch (error) {
                console.error("Failed to fetch fields", error);
            }
        };

        fetchFields();
    }, [user?.isRecommended, flag]);

    const toggleFieldSelection = (fieldId: string) => {
        setSelectedFieldIds((prev) =>
            prev.includes(fieldId)
                ? prev.filter((id) => id !== fieldId)
                : [...prev, fieldId]
        );
    };

    const handleSave = async () => {
        try {
            if (!user?.userId) return;
            await UpdateUserPreferenceAPI(user.userId, { fieldIds: selectedFieldIds });
            if (doNotShowAgain) {
                localStorage.setItem("suppressPreferencePopup", "true");
            }
            setOpen(false);
            setFlag(pre => !pre);
        } catch (error) {
            console.error("Failed to save preferences", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Customize Your Interests</DialogTitle>
                    <DialogDescription>
                        Select the fields you're interested in to personalize your experience.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <p className="font-medium">Available Fields</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {fields.map((field) => (
                            <Button
                                key={field.fieldId}
                                variant={selectedFieldIds.includes(field.fieldId) ? "default" : "outline"}
                                onClick={() => toggleFieldSelection(field.fieldId)}
                            >
                                {field.fieldName}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="mt-4 flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="doNotShowAgain"
                        checked={doNotShowAgain}
                        onChange={(e) => setDoNotShowAgain(e.target.checked)}
                        className="w-4 h-4"
                    />
                    <label htmlFor="doNotShowAgain" className="text-sm text-gray-600">
                        Don't show this again
                    </label>
                </div>

                <DialogFooter>
                    <Button onClick={handleSave}>Save Preferences</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserPreferencePopup;
