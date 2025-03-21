/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Crown, Star } from "lucide-react";
import {
  ClubRankingDTO,
  GetClubRankingAPI,
} from "@/api/club-owner/ClubByUser";
import ClubRankingDetail from "./ClubRankingDetail";
import useAuth from "@/hooks/useAuth";

const rankFilters: string[] = ["All", "EXCELENT", "GOOD", "AVERAGE", "NEED_IMPROVEMENT"];

export default function FancyClubRankingPage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<string>("1");

  const [allClubs, setAllClubs] = useState<ClubRankingDTO[]>([]);
  const [displayedClubs, setDisplayedClubs] = useState<ClubRankingDTO[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedRankFilter, setSelectedRankFilter] = useState<string>("All");
  const [selectedClubDetail, setSelectedClubDetail] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClubRanking() {
      try {
        if (!user?.universityId) return;
        const month = selectedTab;
        const response = await GetClubRankingAPI(user.universityId, month);
        const data: ClubRankingDTO[] = response.data ?? []
        setAllClubs(response.data ?? []);
        const filteredData =
          selectedRankFilter === "All"
            ? data
            : data.filter((club) => club.rank === selectedRankFilter);
        setDisplayedClubs(filteredData.slice(0, 10));
        setVisibleCount(10);
      } catch (error) {
        console.error("Error fetching club ranking", error);
      }
    }
    fetchClubRanking();
  }, [selectedTab, selectedRankFilter, user?.universityId]);

  const handleLoadMore = () => {
    const filteredData =
      selectedRankFilter === "All"
        ? allClubs
        : allClubs.filter((club) => club.rank === selectedRankFilter);
    const nextCount = visibleCount + 10;
    setDisplayedClubs(filteredData.slice(0, nextCount));
    setVisibleCount(nextCount);
  };

  const handleViewDetail = async (clubId: string) => {
    try {
      setSelectedClubDetail(clubId);
    } catch (error) {
      console.error("Error fetching club detail", error);
    }
  };

  const handleCloseDetail = () => {
    setSelectedClubDetail(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-slate-50 to-blue-50 text-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Clubs Ranking</h1>

        {/* Rank Filter Section */}
        <div className="mb-6 flex justify-center space-x-2">
          {rankFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedRankFilter(filter)}
              className={`rounded-full px-4 py-2 border transition-colors duration-200 ${selectedRankFilter === filter
                ? "bg-blue-500 text-white border-blue-500 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
                }`}
            >
              {filter === "All" ? "All" : filter}
            </button>
          ))}
        </div>

        {/* Tabs now represent Month intervals */}
        <Tabs value={selectedTab} onValueChange={(val) => setSelectedTab(val as any)}>
          <TabsList className="flex justify-center mb-6">
            <TabsTrigger value="1">1 Month</TabsTrigger>
            <TabsTrigger value="3">3 Months</TabsTrigger>
            <TabsTrigger value="6">6 Months</TabsTrigger>
          </TabsList>
          <TabsContent value="1" />
          <TabsContent value="3" />
          <TabsContent value="6" />

          {/* Club Ranking List */}
          <div className="space-y-4">
            {displayedClubs.map((club, index) => {
              const rankIndex = index + 1;
              const isTop1 = rankIndex === 1;
              const isTop2 = rankIndex === 2;
              const isTop3 = rankIndex === 3;
              return (
                <Card
                  key={club.clubId}
                  className="hover:shadow-xl transition-all border border-gray-200"
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-xl font-bold">#{rankIndex}</div>
                      {isTop1 && <Crown className="text-yellow-500" size={24} />}
                      {isTop2 && <Star className="text-gray-500" size={24} />}
                      {isTop3 && <Star className="text-amber-600" size={24} />}
                      <CardTitle>{club.clubName}</CardTitle>
                    </div>
                    <img
                      src={club.logoUrl}
                      alt={club.clubName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </CardHeader>
                  <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <p className="text-sm text-gray-500">Total Score: {club.totalScore}</p>
                      <p className="text-sm text-gray-500">Rank: {club.rank}</p>
                    </div>
                    <div>
                      <Button variant="outline" className="mt-2 sm:mt-0 mr-2">
                        Alert Club
                      </Button>
                      <Button
                        variant="outline"
                        className="mt-2 sm:mt-0"
                        onClick={() => handleViewDetail(club.clubId)}
                      >
                        View detail
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Load More Button */}
          {displayedClubs.length <
            (selectedRankFilter === "All"
              ? allClubs.length
              : allClubs.filter((club) => club.rank === selectedRankFilter).length) && (
              <div className="flex justify-center mt-6">
                <Button onClick={handleLoadMore}>Load More</Button>
              </div>
            )}
        </Tabs>
      </div>

      {/* Detail Modal */}
      {selectedClubDetail && (
        <ClubRankingDetail clubId={selectedClubDetail} month={selectedTab} onClose={handleCloseDetail} />
      )}
    </div>
  );
}
