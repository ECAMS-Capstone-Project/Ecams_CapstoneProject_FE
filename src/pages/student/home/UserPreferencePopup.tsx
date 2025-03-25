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

const UserPreferencePopup: React.FC = () => {
    // State để điều khiển mở/đóng popup
    const [open, setOpen] = useState(true);
    // State lưu các lựa chọn của người dùng
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

    // Danh sách các danh mục và phong cách mẫu
    const categories = ["Music", "Art", "Sports", "Tech", "Travel"];
    const styles = ["Casual", "Formal", "Trendy", "Vintage"];

    useEffect(() => {
        const submitted = localStorage.getItem("hasSubmittedPreferences");
        if (!submitted) {
            setOpen(true);
        }
    }, []);

    // Hàm toggle để thêm/bỏ lựa chọn
    const toggleSelection = (
        value: string,
        currentSelections: string[],
        setSelections: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        if (currentSelections.includes(value)) {
            setSelections(currentSelections.filter((item) => item !== value));
        } else {
            setSelections([...currentSelections, value]);
        }
    };

    // Xử lý lưu các lựa chọn (có thể gọi API lưu vào backend nếu cần)
    const handleSave = () => {
        console.log("Selected Categories:", selectedCategories);
        console.log("Selected Styles:", selectedStyles);
        localStorage.setItem("hasSubmittedPreferences", "true");

        // Sau khi lưu, đóng popup
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Customize Your Recommendations</DialogTitle>
                    <DialogDescription>
                        Choose your favorite categories and styles so we can recommend events and clips tailored for you.
                    </DialogDescription>
                </DialogHeader>

                {/* Favorite Categories */}
                <div className="mt-4">
                    <p className="font-medium">Favorite Categories</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategories.includes(category) ? "default" : "outline"}
                                onClick={() => toggleSelection(category, selectedCategories, setSelectedCategories)}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Preferred Styles */}
                <div className="mt-4">
                    <p className="font-medium">Preferred Styles</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {styles.map((style) => (
                            <Button
                                key={style}
                                variant={selectedStyles.includes(style) ? "default" : "outline"}
                                onClick={() => toggleSelection(style, selectedStyles, setSelectedStyles)}
                            >
                                {style}
                            </Button>
                        ))}
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSave}>Save Preferences</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserPreferencePopup;
