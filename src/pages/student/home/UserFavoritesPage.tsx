import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { GetUserFavoriteAPI, UpdateUserPreferenceAPI } from "@/api/student/UserPreference";
import useAuth from "@/hooks/useAuth";
import { FieldDTO, GetAllFields } from "@/api/club-owner/RequestClubAPI";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const UserFavoritesPage: React.FC = () => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<FieldDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [flag, setFlag] = useState(false);

    // Dialog logic
    const [openDialog, setOpenDialog] = useState(false);
    const [fields, setFields] = useState<FieldDTO[]>([]);
    const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([]);
    const [doNotShowAgain, setDoNotShowAgain] = useState<boolean>(false);

    const fetchFavorites = async () => {
        if (!user) return;
        try {
            const response = await GetUserFavoriteAPI(user.userId);
            setFavorites(response.data || []);
        } catch (error) {
            console.error("Failed to fetch user favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFields = async () => {
        try {
            const response = await GetAllFields();
            setFields(response.data || []);
        } catch (error) {
            console.error("Failed to fetch fields", error);
        }
    };

    const handleSave = async () => {
        try {
            if (!user?.userId) return;
            await UpdateUserPreferenceAPI(user.userId, {
                fieldIds: selectedFieldIds,
            });
            if (doNotShowAgain) {
                localStorage.setItem("suppressPreferencePopup", "true");
            }
            setOpenDialog(false);
            setFlag((prev) => !prev);
        } catch (error) {
            console.error("Failed to save preferences", error);
        }
    };

    useEffect(() => {
        fetchFavorites();
        fetchFields();
    }, [flag]);

    const toggleFieldSelection = (fieldId: string) => {
        setSelectedFieldIds((prev) =>
            prev.includes(fieldId)
                ? prev.filter((id) => id !== fieldId)
                : [...prev, fieldId]
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
            {/* Profile Info */}
            {user && (
                <div className="flex flex-col items-center justify-center mb-10 text-center">
                    <img
                        src={
                            user.avatar ||
                            "https://api.dicebear.com/6.x/initials/svg?seed=" + user.fullname
                        }
                        alt={user.fullname}
                        className="w-24 h-24 rounded-full shadow-md border-2 border-white mb-3"
                    />
                    <h2 className="text-2xl font-bold text-gray-800">{user.fullname}</h2>
                    <p className="text-sm text-gray-600">{user.email}</p>
                </div>
            )}

            {/* Edit/Create Preference Button */}
            <div className="flex justify-center my-6">
                <Button
                    onClick={() => {
                        setSelectedFieldIds(favorites.map((f) => f.fieldId));
                        setOpenDialog(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition"
                >
                    {favorites.length > 0 ? "Edit Preferences" : "Create Preferences"}
                </Button>
            </div>

            {/* Favorite Fields */}
            <div className="max-w-5xl mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-center text-blue-700 flex items-center justify-center gap-2">
                    <Heart className="text-red-500" size={20} />
                    Favorite Fields
                </h3>

                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-10">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                            alt="No favorites"
                            className="w-28 h-28 mb-4 opacity-80"
                        />
                        <h4 className="text-lg font-semibold">No favorites yet</h4>
                        <p className="text-sm max-w-sm">
                            You haven’t marked any fields as your favorite. Start exploring clubs and find what you love! ❤️
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((field) => (
                            <Card
                                key={field.fieldId}
                                className="transition-all hover:shadow-lg border border-blue-100 rounded-xl"
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                                        <Heart size={18} className="text-red-500" />
                                        Field: {field.fieldName}
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Preferences Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
                                    variant={
                                        selectedFieldIds.includes(field.fieldId)
                                            ? "default"
                                            : "outline"
                                    }
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
        </div>
    );
};

export default UserFavoritesPage;
