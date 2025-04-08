import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Avatar,
    Stack,
    Tooltip,
} from "@mui/material";
import { format } from "date-fns";
import { ClubResponseDTO, ClubStatusEnum } from "@/api/club-owner/ClubByUser";
import { DescriptionWithToggle } from "@/lib/DescriptionWithToggle";

interface RequestClubCardProps {
    club: ClubResponseDTO;
}

const RequestClubCard: React.FC<RequestClubCardProps> = ({ club }) => {
    return (
        <Card
            sx={{
                borderRadius: 3,
                height: "100%",
                position: "relative",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 6px",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
            }}
        >
            {club.logoUrl && (
                <Box sx={{ textAlign: "center", pt: 2 }}>
                    <Avatar
                        src={club.logoUrl}
                        alt={club.clubName}
                        sx={{
                            width: 64,
                            height: 64,
                            mx: "auto",
                            border: "2px solid white",
                            boxShadow: 1,
                        }}
                    />
                </Box>
            )}

            <CardContent sx={{ px: 3, pb: 2 }}>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#1e3a8a", textAlign: "center", mb: 0.5 }}
                >
                    {club.clubName}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        fontStyle: "italic",
                        color: "#666",
                        textAlign: "center",
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    <DescriptionWithToggle text={club.purpose} />
                </Typography>

                <Typography sx={{ fontSize: 13, color: "#444", textAlign: "center", mb: 1 }}>
                    📅 {format(new Date(club.foundingDate), "dd/MM/yyyy")}
                </Typography>

                <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    flexWrap="wrap"
                    sx={{ mb: 1 }}
                >
                    {club.clubFields.slice(0, 3).map((field, index) => (
                        <Chip
                            key={index}
                            label={field.fieldName}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    ))}
                    {club.clubFields.length > 3 && (
                        <Chip label={`+${club.clubFields.length - 3}`} size="small" variant="outlined" />
                    )}
                </Stack>

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Tooltip title="Current Club Status">
                        <Chip
                            label={club.status}
                            color={
                                club.status === ClubStatusEnum.Pending
                                    ? "warning"
                                    : club.status === ClubStatusEnum.Active
                                        ? "success"
                                        : "error"
                            }
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                        />
                    </Tooltip>
                </Box>
            </CardContent>
        </Card>
    );
};

export default RequestClubCard;
