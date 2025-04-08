/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Box, Grid2, Typography } from "@mui/material";
import { ClubResponseDTO, GetProcessClubsAPI } from "@/api/club-owner/ClubByUser";
import useAuth from "@/hooks/useAuth";
import DialogLoading from "@/components/ui/dialog-loading";
import PageNavigation from "@/components/global/PageNavigation";
import InviteClubCard from "@/components/partial/club_owner/manage_club/InviteClubCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckingClubDialog } from "@/components/partial/representative/representative-club/CheckingClubDialog";

const CheckingClubPage: React.FC = () => {
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [inviteClub, setInviteClub] = useState<ClubResponseDTO[]>();
    const [flag, setFlag] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [clubDetail, setClubDetail] = useState<ClubResponseDTO>();

    useEffect(() => {
        const loadClubs = async () => {
            if (!user) return;

            setLoading(true);
            try {
                const response = await GetProcessClubsAPI(user.universityId || "", page);
                console.log(response);

                setInviteClub(response.data?.data || []);
                setTotalPages(response.data?.totalPages || 1);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadClubs();
    }, [user, page, flag]);

    const handleClick = (club: ClubResponseDTO) => {
        setClubDetail(club);
        setOpenDialog(true);
    }

    return (
        <>
            <Box sx={{ padding: 4, paddingTop: 0 }}>
                <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                        textAlign: "left",
                        mb: 4,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Box
                        component="span"
                        sx={{
                            color: "#136CB5",
                            fontWeight: 800,
                            fontSize: "1.6rem",
                        }}
                    >
                        Clubs
                    </Box>
                    <Box component="span" sx={{ color: "#444", fontWeight: 500 }}>
                        Request
                    </Box>
                </Typography>

                {loading ? (
                    <DialogLoading />
                ) : error ? (
                    <Typography color="error" align="center">
                        {error}
                    </Typography>
                ) : inviteClub && inviteClub.length > 0 ? (
                    <Grid2 container spacing={3}>
                        {inviteClub.map((club, index) => (
                            <Grid2
                                key={index}
                                size={{ xs: 12, sm: 6, md: 3 }}
                                display="flex"
                                justifyContent="center"
                                onClick={() => handleClick(club)}
                            >
                                <InviteClubCard image={club.logoUrl} title={club.clubName} field={club.clubFields} />
                            </Grid2>
                        ))}
                    </Grid2>
                ) : (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        py={6}
                        px={2}
                        sx={{ opacity: 0.9 }}
                    >
                        <img
                            src="https://cdn-icons-png.freepik.com/512/3085/3085313.png"
                            alt="All clear"
                            style={{ width: 110, height: 110, marginBottom: 16 }}
                        />

                        <Typography variant="h6" fontWeight={700} color="#2E7D32" gutterBottom>
                            No pending club requests
                        </Typography>

                        <Typography
                            variant="body2"
                            color="textSecondary"
                            align="center"
                            maxWidth={320}
                        >
                            Once a new club requests approval, it will show up here for you to review.
                        </Typography>
                    </Box>
                )}
            </Box>

            {inviteClub && inviteClub.length > 0 && (
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
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl">
                    <CheckingClubDialog
                        initialData={clubDetail as any}
                        mode={"pending"}
                        setFlag={setFlag}
                        setOpenDialog={setOpenDialog}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CheckingClubPage;
