import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Avatar, Stack, Chip } from "@mui/material";

interface ClubCardProps {
    image: string;
    title: string;
    members: string[];
}

const ClubCard: React.FC<ClubCardProps> = ({ image, title, members }) => {
    return (
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardMedia component="img" height="140" image={image} alt={title} />
            <CardContent>
                <Chip
                    label={title}
                    color="secondary"
                    size="medium"
                    sx={{ alignSelf: 'flex-end', mb: 2, fontSize: "large" }}
                />
                <Typography variant="h6"></Typography>
                <Stack direction="row" spacing={1} sx={{ display: "flex", justifyContent: "end" }}>
                    {members.map((member, index) => (
                        <Avatar key={index} src={member} sx={{ width: 30, height: 30 }} />
                    ))}
                    <Typography variant="body2">+{members.length}</Typography>
                </Stack>
                <div className="flex w-full justify-center align-middle mt-7">
                    <Button variant="contained" sx={{ backgroundColor: "#000080", color: "white" }}>
                        View more
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ClubCard;
