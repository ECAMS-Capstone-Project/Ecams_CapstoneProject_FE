/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Box, Button, Grid2, Typography } from "@mui/material";
import ClubCard from "@/components/partial/club_owner/manage_club/ClubCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClubResponseDTO, GetAllClubsAPI } from "@/api/club-owner/ClubByUser";
import useAuth from "@/hooks/useAuth";
import DialogLoading from "@/components/ui/dialog-loading";
import PageNavigation from "@/components/global/PageNavigation";
import { useNavigate } from "react-router-dom";

const ClubListPage: React.FC = () => {
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "PENDING">("ACTIVE"); // Trạng thái mặc định

    const [clubsCache, setClubsCache] = useState<{
        [key: string]: { [page: number]: ClubResponseDTO[] };
    }>({
        ACTIVE: {},
        INACTIVE: {},
        PENDING: {},
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadClubs = async () => {
            if (!user) return;

            // Kiểm tra cache: Nếu đã có dữ liệu cho `status` + `page`, không gọi API nữa
            if (clubsCache[status][page]) return;

            setLoading(true);
            try {
                const response = await GetAllClubsAPI(user.userId, status, page);

                setClubsCache((prev) => ({
                    ...prev,
                    [status]: {
                        ...prev[status], // Giữ dữ liệu của các page khác
                        [page]: response.data?.data || [],
                    },
                }));
                setTotalPages(response.data?.totalPages || 1);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadClubs();
    }, [user, status, page]);

    const clubs = clubsCache[status][page] || []; // Lấy dữ liệu theo `status` + `page`
    const handleCreateClub = () => {
        navigate("/club/create-club");
    };
    return (
        <>
            <Tabs
                defaultValue="ACTIVE"
                value={status}
                onValueChange={(val) => {
                    setStatus(val as "ACTIVE" | "INACTIVE" | "PENDING");
                    setPage(1);
                }}
                className="w-full p-2"
            >
                <Box sx={{ marginBottom: "20px", padding: "0 16px" }}>
                    <Grid2 container alignItems="center" spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 8 }}>
                            <TabsList>
                                <TabsTrigger value="ACTIVE">Participated</TabsTrigger>
                                <TabsTrigger value="INACTIVE">History</TabsTrigger>
                                <TabsTrigger value="PENDING">Pending</TabsTrigger>
                            </TabsList>
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 4 }} sx={{ textAlign: "right" }}>
                            <Button
                                variant="contained"
                                sx={{
                                    background: "linear-gradient(to right, #136CB5, #49BBBD)",
                                    textTransform: "none"
                                    // ...
                                }}
                                onClick={handleCreateClub}
                            >
                                Create Club
                            </Button>
                        </Grid2>
                    </Grid2>
                </Box>

                {/* Danh sách Clubs */}
                <TabsContent value={status}>
                    <Box sx={{ padding: 4, paddingTop: 0 }}>
                        <Typography variant="h5" sx={{ textAlign: "left", marginBottom: 4 }}>
                            <Typography component="span" sx={{ color: "blue", fontWeight: "bold" }}>
                                Clubs
                            </Typography>{" "}
                            {status === "ACTIVE"
                                ? "Participated"
                                : status === "INACTIVE"
                                    ? "History"
                                    : "Pending"}
                        </Typography>

                        {loading ? (
                            <DialogLoading />
                        ) : error ? (
                            <Typography color="error" align="center">
                                {error}
                            </Typography>
                        ) : clubs.length > 0 ? (
                            <Grid2 container spacing={3}>
                                {clubs.map((club, index) => (
                                    <Grid2
                                        key={index}
                                        size={{ xs: 12, sm: 6, md: 3 }}
                                        display="flex"
                                        justifyContent="center"
                                    >
                                        <ClubCard image={club.logoUrl} title={club.clubName} field={club.clubFields} clubId={club.clubId} clubOwnerId={club.clubOwnerId} />
                                    </Grid2>
                                ))}
                            </Grid2>
                        ) : (
                            <Typography align="center" color="gray">
                                No clubs found.
                            </Typography>
                        )}
                    </Box>
                </TabsContent>

                {clubs.length > 0 && (
                    <div style={{ position: "relative", minHeight: "80px" }}>
                        <ul
                            style={{
                                marginTop: "28px",
                                marginBottom: "10px",
                                position: "absolute",
                                left: "50%",
                                transform: "translate(-50%)",
                            }}
                        >
                            <PageNavigation page={page} setPage={setPage} totalPages={totalPages} />
                        </ul>
                    </div>
                )}
            </Tabs>
        </>
    );
};

export default ClubListPage;
