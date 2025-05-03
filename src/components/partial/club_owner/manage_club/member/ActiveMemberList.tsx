/* eslint-disable react-hooks/exhaustive-deps */
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { useEffect, useState } from "react";
import {
  ClubMemberDTO,
  GetMemberInClubsAPI,
} from "@/api/club-owner/ClubByUser";
import ActiveMemberListTable from "./A_MemberListTable";
interface props {
  clubId: string;
  isClubOwner: boolean;
}

export default function ActiveMemberList({ clubId, isClubOwner }: props) {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [memberList, setMemberList] = useState<ClubMemberDTO[]>([]);
  const [, setIsLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const loadUniversity = async () => {
    setTotalPages(1);
    try {
      const clubData = await GetMemberInClubsAPI(
        clubId,
        pageSize,
        pageNo,
        "ACTIVE"
      );
      if (clubData) {
        setMemberList(clubData.data?.data || []);
        setTotalPages(clubData.data?.totalPages || 1);
      } else {
        console.warn("UniversityList returned no data");
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadUniversity();
  }, [clubId, pageNo, pageSize, flag]);

  return (
    <div className="space-y-2">
      <ActiveMemberListTable
        data={memberList
          .filter((a) => a.status == "ACTIVE")
          .sort((a, b) => {
            if (
              a.clubRoleName === "CLUB_OWNER" &&
              b.clubRoleName !== "CLUB_OWNER"
            )
              return -1;
            if (
              a.clubRoleName !== "CLUB_OWNER" &&
              b.clubRoleName === "CLUB_OWNER"
            )
              return 1;
            return 0;
          })}
        isClubOwner={isClubOwner}
        setFlag={setFlag}
      />
      <DataTablePagination
        currentPage={pageNo}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageNo={setPageNo}
        setPageSize={setPageSize}
      />
    </div>
  );
}
