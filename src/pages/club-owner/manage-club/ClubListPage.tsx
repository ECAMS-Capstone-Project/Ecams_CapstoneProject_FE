import React from "react";
import { Box, Grid2, Typography } from "@mui/material";
import ClubCard from "@/components/partial/club_owner/manage_club/ClubCard";

const clubData = [
    {
        image: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
        title: "Art Club",
        members: ["https://via.placeholder.com/30", "https://via.placeholder.com/30", "https://via.placeholder.com/30"],
    },
    {
        image: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
        title: "Art Club",
        members: ["https://via.placeholder.com/30", "https://via.placeholder.com/30", "https://via.placeholder.com/30"],
    },
    {
        image: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
        title: "Art Club",
        members: ["https://via.placeholder.com/30", "https://via.placeholder.com/30", "https://via.placeholder.com/30"],
    },
    {
        image: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
        title: "Art Club",
        members: ["https://via.placeholder.com/30", "https://via.placeholder.com/30", "https://via.placeholder.com/30"],
    },
    {
        image: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
        title: "Art Club",
        members: ["https://via.placeholder.com/30", "https://via.placeholder.com/30", "https://via.placeholder.com/30"],
    },
];

const ClubListPage: React.FC = () => {
    return (
        <Box sx={{ padding: 4, paddingTop: 0 }}>
            <Typography variant="h5" sx={{ textAlign: "left", marginBottom: 4 }}>
                <Typography component="span" sx={{ color: "blue", fontWeight: "bold" }}>
                    Clubs
                </Typography>{" "}
                Participated
            </Typography>
            <Grid2 container spacing={3} >
                {clubData.map((club, index) => (
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index} display="flex" justifyContent="center">
                        <ClubCard image={club.image} title={club.title} members={club.members} />
                    </Grid2>
                ))}
            </Grid2>
        </Box>
    );
};

export default ClubListPage;
