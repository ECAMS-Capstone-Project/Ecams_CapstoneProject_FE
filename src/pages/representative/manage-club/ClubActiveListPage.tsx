/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { ClubResponseDTO, GetAllClubsAPI } from "@/api/club-owner/ClubByUser";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import ClubActiveListTable from "@/components/partial/representative/representative-club/ClubActiveListTable";

const ClubActiveListPage: React.FC = () => {
    const { user } = useAuth();

    // Luôn hiển thị clubs có status = "ACTIVE"
    const status = "ACTIVE";

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [flag, setFlag] = useState<boolean>(false);
    // Cache dữ liệu theo từng page
    const [clubsCache, setClubsCache] = useState<{ [page: number]: ClubResponseDTO[] }>({});

    const [loading, setLoading] = useState<boolean>(false);
    const [, setError] = useState<string | null>(null);

    // Gọi API lấy danh sách CLB ACTIVE
    useEffect(() => {
        if (!user) return;

        // Nếu dữ liệu trang này đã có trong cache thì không gọi API nữa
        if (clubsCache[page]) return;

        const loadClubs = async () => {
            setLoading(true);
            try {
                const response = await GetAllClubsAPI(user.userId, "ACTIVE", page);
                const newClubs = response.data?.data || [];

                // Lưu vào cache
                setClubsCache((prev) => ({
                    ...prev,
                    [page]: newClubs,
                }));

                setTotalPages(response.data?.totalPages || 1);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadClubs();
    }, [user, page, status, clubsCache, flag]);

    // Lấy danh sách CLB từ cache
    const clubs = clubsCache[page] || [];

    return (
        <React.Suspense fallback={<LoadingAnimation />}>
            {loading ? (
                <LoadingAnimation />
            ) : (
                <>
                    <div className="flex items-center justify-between pt-4">
                        <Heading
                            title="View All Club"
                            description="All club in the system"
                        />
                    </div>
                    <Separator />
                    <ClubActiveListTable
                        data={clubs}
                        setFlag={setFlag}
                    />
                    <DataTablePagination
                        currentPage={page}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        setPageNo={setPage}
                        setPageSize={setPageSize}
                    />
                </>
            )}
        </React.Suspense>
    );
};

export default ClubActiveListPage;
