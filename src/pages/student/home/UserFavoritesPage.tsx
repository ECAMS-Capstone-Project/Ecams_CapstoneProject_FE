/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GetUserFavoriteAPI } from "@/api/student/UserPreference";
import useAuth from "@/hooks/useAuth";
import { FieldDTO } from "@/api/club-owner/RequestClubAPI";

const UserFavoritesPage: React.FC = () => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<FieldDTO[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-2 text-center">User Favorite Fields</h2>

            {user && (
                <div className="flex flex-col items-center mb-6">
                    <img
                        src={user.avatar || "https://api.dicebear.com/6.x/initials/svg?seed=" + user.fullname}
                        alt={user.fullname}
                        className="w-20 h-20 rounded-full mb-2"
                    />
                    <p className="text-lg font-semibold">{user.fullname}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                </div>
            )}

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : favorites.length === 0 ? (
                <p className="text-center">No favorite fields found.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((field) => (
                        <Card key={field.fieldId} className="transition hover:shadow-md">
                            <CardHeader>
                                <CardTitle>{field.fieldName}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">ID: {field.fieldId}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserFavoritesPage;
