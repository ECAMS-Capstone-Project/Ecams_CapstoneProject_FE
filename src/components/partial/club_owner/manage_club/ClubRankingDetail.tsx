import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClubRankingDetailDTO, GetClubRankingDetailAPI } from "@/api/club-owner/ClubByUser";
import useAuth from "@/hooks/useAuth";

interface ClubRankingDetailProps {
    clubId: string;
    month: string;
    onClose: () => void;
}

const getRankClass = (rank: string) => {
    switch (rank.toLowerCase()) {
        case "good":
            return "text-green-700 bg-green-100 px-2 py-1 rounded";
        case "excellent":
            return "text-blue-700 bg-blue-100 px-2 py-1 rounded";
        case "average":
            return "text-yellow-700 bg-yellow-100 px-2 py-1 rounded";
        case "need improve":
            return "text-red-700 bg-red-100 px-2 py-1 rounded";
        default:
            return "text-gray-700 bg-gray-100 px-2 py-1 rounded";
    }
};

const ClubRankingDetail: React.FC<ClubRankingDetailProps> = ({ clubId, month, onClose }) => {
    const [clubDetail, setClubDetail] = useState<ClubRankingDetailDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    useEffect(() => {
        async function fetchDetail() {
            try {
                if (!user?.universityId) return;
                const response = await GetClubRankingDetailAPI(clubId, user.universityId, month);
                setClubDetail(response.data ?? null);
            } catch (err) {
                console.error(err);
                setError("Failed to load club details.");
            } finally {
                setLoading(false);
            }
        }
        fetchDetail();
    }, [clubId, month, user]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                <div className="p-4 bg-white rounded-lg shadow-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                <div className="p-4 bg-white rounded-lg shadow-xl">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        );
    }

    if (!clubDetail) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                >
                    <X size={24} />
                </button>
                <div className="flex flex-col items-center">
                    <div className="mb-6 flex items-center space-x-4">
                        <img
                            src={clubDetail.logoUrl}
                            alt={clubDetail.clubName}
                            className="h-20 w-20 rounded-full object-cover border-2 border-blue-500"
                        />
                        <h2 className="text-3xl font-bold">{clubDetail.clubName}</h2>
                    </div>
                    <div className="w-full space-y-4">
                        {/* New Members */}
                        <div className="border p-4 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">New Members</h3>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Number of Members:</span>
                                <span className="text-gray-900">{clubDetail.numOfNewMembers}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Score:</span>
                                <span className="text-gray-900">{clubDetail.newMemberScore}</span>
                            </div>
                        </div>
                        {/* Events */}
                        <div className="border p-4 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">Events</h3>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Number of Events:</span>
                                <span className="text-gray-900">{clubDetail.numOfEvents}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Score:</span>
                                <span className="text-gray-900">{clubDetail.eventScore}</span>
                            </div>
                        </div>
                        {/* Event Ratings */}
                        <div className="border p-4 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">Event Ratings</h3>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Average Rating:</span>
                                <span className="text-gray-900">{clubDetail.averageEventRating}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Score:</span>
                                <span className="text-gray-900">{clubDetail.eventRatingScore}</span>
                            </div>
                        </div>
                        {/* Activities */}
                        <div className="border p-4 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">Activities</h3>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Average Points:</span>
                                <span className="text-gray-900">{clubDetail.averageActivityPoint}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Score:</span>
                                <span className="text-gray-900">{clubDetail.activityScore}</span>
                            </div>
                        </div>
                    </div>
                    {/* Total Score & Rank */}
                    <div className="mt-6 w-full border-t pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-gray-800">Total Score:</span>
                            <span className="text-2xl font-bold text-blue-600">{clubDetail.totalScore}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-xl text-gray-700">Rank:</span>
                            <span className={`text-xl font-semibold ${getRankClass(clubDetail.rank)}`}>{clubDetail.rank}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubRankingDetail;
