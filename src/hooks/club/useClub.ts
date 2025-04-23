import { GetMemberInClubsByStatusAPI } from "@/api/club-owner/ClubByUser";
import { GetAvailableClub } from "@/api/club-owner/ClubEvent";
import { useQuery } from "@tanstack/react-query";

export const useClub = (
  clubId?: string,
  uniId?: string,
  startDate?: string,
  endDate?: string
) => {
  const { data, isLoading } = useQuery({
    queryKey: ["clubMembers"],
    queryFn: () => GetMemberInClubsByStatusAPI(clubId || "", 100, 1, "ACTIVE"),
  });

  const { data: availableClubs } = useQuery({
    queryKey: ["availableClubs", uniId, startDate, endDate],
    queryFn: () =>
      GetAvailableClub(uniId || "", startDate || "", endDate || ""),
    enabled: !!uniId && !!startDate && !!endDate,
  });

  return {
    members: data?.data?.data || [],
    isLoading,
    availableClubs: availableClubs?.data || [],
  };
};
