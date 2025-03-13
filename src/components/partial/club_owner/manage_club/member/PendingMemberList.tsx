import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { useEffect, useState } from "react";
import {
  ClubMemberDTO,
  GetMemberInClubsAPI,
} from "@/api/club-owner/ClubByUser";
import PendingMemberListTable from "./P_MemberListTable copy";
interface props {
  clubId: string;
}
const clubMembers: ClubMemberDTO[] = [
  {
    avatar: "https://randomuser.me/api/portraits/men/99.jpg",
    clubRoleName: "CLUB_MEMBER",
    email: "nguyenvanan@example.com",
    fullname: "Nguyễn Văn An",
    studentId: "SV825157",
    userId: "3a22be9b-84af-4029-b6d3-b34aeb8780c3",
  },
  {
    avatar: "https://randomuser.me/api/portraits/women/83.jpg",
    clubRoleName: "CLUB_MEMBER",
    email: "phamthuha@example.com",
    fullname: "Phạm Thu Hà",
    studentId: "SV485081",
    userId: "1efd05c5-19f2-4625-907b-c6417b2e6ff8",
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    clubRoleName: "CLUB_OWNER",
    email: "tranthibich@example.com",
    fullname: "Trần Thị Bích",
    studentId: "SV760960",
    userId: "35dee868-319a-436c-b3de-08810ad4225c",
  },
  {
    avatar: "https://randomuser.me/api/portraits/women/14.jpg",
    clubRoleName: "CLUB_MEMBER",
    email: "leminhtuan@example.com",
    fullname: "CLUB_MEMBER",
    studentId: "SV104220",
    userId: "be12a7a2-4941-4679-abe3-2c1d652ec043",
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/18.jpg",
    clubRoleName: "CLUB_MEMBER",
    email: "ngobaochau@example.com",
    fullname: "Ngô Bảo Châu",
    studentId: "SV404769",
    userId: "12621bb0-7c8e-422b-9842-820f86fca633",
  },
];
export default function PendingMemberList({ clubId }: props) {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [, setMemberList] = useState<ClubMemberDTO[]>([]);
  const [, setIsLoading] = useState(true);
  const loadUniversity = async () => {
    setTotalPages(1);
    try {
      const clubData = await GetMemberInClubsAPI(clubId, pageSize, pageNo);
      if (clubData) {
        setMemberList(clubData.data?.data || []); // Đảm bảo `data.data` tồn tại
        setTotalPages(clubData.data?.totalPages || 1); // Đặt số trang
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
  }, [clubId, pageNo, pageSize]);

  return (
    <div className="space-y-2">
      <PendingMemberListTable data={clubMembers} />
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
