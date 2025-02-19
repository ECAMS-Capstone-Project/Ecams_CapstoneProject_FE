/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Box, Grid2, Typography } from "@mui/material";
import ClubCard from "@/components/partial/club_owner/manage_club/ClubCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClubResponseDTO, GetAllClubsAPI } from "@/api/club-owner/ClubByUser";
import useAuth from "@/hooks/useAuth";
import DialogLoading from "@/components/ui/dialog-loading";

const ClubListPage: React.FC = () => {
    const { user } = useAuth();

    const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "PENDING">("ACTIVE"); // Trạng thái mặc định
    const [clubsCache, setClubsCache] = useState<{ [key: string]: ClubResponseDTO[] }>({
        ACTIVE: [],
        INACTIVE: [],
        PENDING: [],
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadClubs = async () => {
            if (user && !clubsCache[status]?.length) { // Chỉ gọi API nếu chưa có dữ liệu cache
                setLoading(true);
                try {
                    const response = await GetAllClubsAPI(user.userId, status);
                    setClubsCache((prev) => ({ ...prev, [status]: response.data || [] }));
                } catch (error: any) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadClubs();
    }, [user, status]); // Chạy lại khi user hoặc status thay đổi

    return (
        <>
            <Tabs
                defaultValue="ACTIVE"
                value={status}
                onValueChange={(val) => setStatus(val as "ACTIVE" | "INACTIVE" | "PENDING")}
                className="w-full p-2"
            >
                <TabsList style={{ marginBottom: "20px" }}>
                    <TabsTrigger value="ACTIVE">Clubs Participate</TabsTrigger>
                    <TabsTrigger value="INACTIVE">Clubs History</TabsTrigger>
                    <TabsTrigger value="PENDING">Clubs Pending</TabsTrigger>
                </TabsList>

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
                        ) : clubsCache[status]?.length > 0 ? (
                            <Grid2 container spacing={3}>
                                {clubsCache[status].map((club, index) => (
                                    <Grid2
                                        size={{ xs: 12, sm: 6, md: 3 }}
                                        key={index}
                                        display="flex"
                                        justifyContent="center"
                                    >
                                        <ClubCard image={club.logoUrl} title={club.clubName} />
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
            </Tabs>
        </>
    );
};

export default ClubListPage;
