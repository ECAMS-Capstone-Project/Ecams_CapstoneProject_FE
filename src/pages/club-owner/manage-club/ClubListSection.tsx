import { ClubResponseDTO, ClubStatusEnum } from "@/api/club-owner/ClubByUser";
import ClubCard from "@/components/partial/club_owner/manage_club/ClubCard";
import DialogLoading from "@/components/ui/dialog-loading";
import { Box, Grid2, Typography } from "@mui/material";

interface ClubListSectionProps {
    status: "ACTIVE" | "INACTIVE" | "PENDING";
    clubs: ClubResponseDTO[];
    loading: boolean;
    error: string | null;
    customTitle?: string;
}

export const ClubListSection: React.FC<ClubListSectionProps> = ({
    status,
    clubs,
    loading,
    error,
    customTitle,
}) => (
    <Box sx={{ padding: 4, paddingTop: 0 }}>
        <Typography variant="h6" fontWeight={600} mb={3}>
            <Box component="span" sx={{ color: "#136CB5", fontWeight: 700 }}>
                Clubs
            </Box>{" "}
            {customTitle ??
                (status === "ACTIVE"
                    ? "you’re participating in"
                    : "you’ve been part of")}
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
                        <ClubCard
                            image={club.logoUrl}
                            title={club.clubName}
                            field={club.clubFields}
                            clubId={club.clubId}
                            clubOwnerId={club.clubOwnerId}
                            status={status as unknown as ClubStatusEnum}
                        />
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
            >
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGPZuTNVvXmIRxRNnuPa5wAqQvyawEG-96fw&s"
                    alt="No clubs"
                    style={{ width: 100, height: 100, opacity: 0.85, marginBottom: 16 }}
                />
                <Typography variant="h6" fontWeight={600} color="textSecondary" gutterBottom>
                    No clubs found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Try adjusting your filters or come back later to explore more student clubs 💡
                </Typography>
            </Box>
        )}
    </Box>
);