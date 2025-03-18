import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { useEffect, useState } from "react";
import { ClubMemberDTO, GetMemberRequestInClubsAPI } from "@/api/club-owner/ClubByUser";
import PendingMemberListTable from "./P_MemberListTable copy";
interface props {
    clubId: string;
}
const clubMembers: ClubMemberDTO[] = [
    {
        userId: "a1234567-89ab-cdef-0123-456789abcdef",
        studentId: "a1234567-89ab-cdef-0123-456789abcdef",
        clubMemberId: "1",
        clubRoleName: "CLUB_MEMBER",
        joinedAt: "2025-03-15T00:00:00",
        requestedDate: "2025-02-12T00:00:00",
        clubActivityPoint: 10,
        leftDate: null,
        avatar: "https://example.com/avatar1.png",
        fullname: "John Doe",
        email: "john.doe@example.com"
    },
    {
        userId: "b2345678-90ab-cdef-0123-456789abcdef",
        studentId: "b2345678-90ab-cdef-0123-456789abcdef",
        clubMemberId: "2",
        clubRoleName: "CLUB_MEMBER",
        joinedAt: "2025-03-16T00:00:00",
        requestedDate: "2025-02-13T00:00:00",
        clubActivityPoint: 20,
        leftDate: null,
        avatar: "https://example.com/avatar2.png",
        fullname: "Jane Smith",
        email: "jane.smith@example.com"
    },
    {
        userId: "c3456789-01ab-cdef-0123-456789abcdef",
        studentId: "c3456789-01ab-cdef-0123-456789abcdef",
        clubMemberId: "3",
        clubRoleName: "CLUB_MEMBER",
        joinedAt: "2025-03-17T00:00:00",
        requestedDate: "2025-02-14T00:00:00",
        clubActivityPoint: 30,
        leftDate: null,
        avatar: "https://example.com/avatar3.png",
        fullname: "Alice Johnson",
        email: "alice.johnson@example.com"
    },
    {
        userId: "d4567890-12ab-cdef-0123-456789abcdef",
        studentId: "d4567890-12ab-cdef-0123-456789abcdef",
        clubMemberId: "4",
        clubRoleName: "CLUB_MEMBER",
        joinedAt: "2025-03-18T00:00:00",
        requestedDate: "2025-02-15T00:00:00",
        clubActivityPoint: 40,
        leftDate: null,
        avatar: "https://example.com/avatar4.png",
        fullname: "Bob Brown",
        email: "bob.brown@example.com"
    },
    {
        userId: "e5678901-23ab-cdef-0123-456789abcdef",
        studentId: "e5678901-23ab-cdef-0123-456789abcdef",
        clubMemberId: "5",
        clubRoleName: "CLUB_MEMBER",
        joinedAt: "2025-03-19T00:00:00",
        requestedDate: "2025-02-16T00:00:00",
        clubActivityPoint: 50,
        leftDate: null,
        avatar: "https://example.com/avatar5.png",
        fullname: "Charlie Davis",
        email: "charlie.davis@example.com"
    },
];
export default function PendingMemberList({ clubId }: props) {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [memberList, setMemberList] = useState<ClubMemberDTO[]>([]);
    const [, setIsLoading] = useState(true);
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
