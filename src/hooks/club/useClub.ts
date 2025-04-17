import { GetMemberInClubsByStatusAPI } from "@/api/club-owner/ClubByUser";
import { useQuery } from "@tanstack/react-query";

export const useClub = (clubId?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["clubMembers"],
    queryFn: () => GetMemberInClubsByStatusAPI(clubId || "", 100, 1, "ACTIVE"),
  });

  return {
    members: data?.data?.data || [],
    isLoading,
  };
};
