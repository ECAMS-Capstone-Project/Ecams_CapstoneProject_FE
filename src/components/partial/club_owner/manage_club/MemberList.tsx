import MemberListTable from "./member/MemberListTable";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { useEffect, useState } from "react";
import { ClubMemberDTO, GetMemberInClubsAPI } from "@/api/club-owner/ClubByUser";
interface props {
    clubId: string;
}

export default function MemberList({ clubId }: props) {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [memberList, setMemberList] = useState<ClubMemberDTO[]>([]);
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
            <MemberListTable data={memberList} />
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
