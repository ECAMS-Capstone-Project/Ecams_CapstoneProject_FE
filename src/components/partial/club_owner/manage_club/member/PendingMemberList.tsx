import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { useEffect, useState } from "react";
import { ClubMemberDTO, GetMemberRequestInClubsAPI } from "@/api/club-owner/ClubByUser";
import PendingMemberListTable from "./P_MemberListTable copy";
interface props {
  clubId: string;
}

export default function PendingMemberList({ clubId }: props) {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [memberList, setMemberList] = useState<ClubMemberDTO[]>([]);
  const [, setIsLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const loadUniversity = async () => {
    setTotalPages(1);
    try {
      const clubData = await GetMemberRequestInClubsAPI(clubId, pageSize, pageNo);
      if (clubData) {
        setMemberList(clubData.data?.data || []); // Đảm bảo `data.data` tồn tại
        setTotalPages(clubData.data?.totalPages || 1); // Đặt số trang
      } else {
        console.warn("Member list returned no data");
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
      <PendingMemberListTable data={memberList} clubId={clubId} setFlag={setFlag} />
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
