/* eslint-disable react-hooks/exhaustive-deps */
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { useEffect, useState } from "react";
import { ClubMemberDTO, GetMemberInClubsAPI } from "@/api/club-owner/ClubByUser";
import ActiveMemberListTable from "./A_MemberListTable";
interface props {
    clubId: string;
    isClubOwner: boolean
}

export default function ActiveMemberList({ clubId, isClubOwner }: props) {
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
    }, [clubId, pageNo, pageSize]);

    return (
        <div className="space-y-2">
            <ActiveMemberListTable data={isClubOwner ? memberList.filter(a => a.clubRoleName != "CLUB_OWNER" && a.status == "ACTIVE") : memberList.filter(a => a.status == "ACTIVE")} isClubOwner={isClubOwner} />
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
