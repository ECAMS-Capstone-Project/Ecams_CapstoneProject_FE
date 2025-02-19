import React from "react";
import { Card, Typography, Stack, Chip } from "@mui/material";
import { MagicCard } from "@/components/magicui/magic-card";
import { Button } from "@/components/ui/button";

interface ClubCardProps {
    image: string;
    title: string;
    members?: string[];
}

const ClubCard: React.FC<ClubCardProps> = ({ image, title, members = [] }) => {
    members.push("hungvietle", "namlaconcho", "conchivila")
    return (
        <Card sx={{
            borderRadius: 3,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            height: "100%"
        }}>
            {/* Đặt objectFit để hình ảnh không bị méo và có kích thước cố định */}
            {/* <CardMedia
                component="img"
                height="180"   // Đặt chiều cao cố định
                image={image}
                alt={title}
                sx={{ objectFit: "cover" }} // Đảm bảo hình ảnh không bị méo
            /> */}
            {/* <img style={{ height: "180px", width: "390px", padding: "20px", borderImage: "20px" }} src={image} /> */}
            <MagicCard
                className="cursor-pointer flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 "
                gradientColor="#D1EAF0"
            >
                <div className="w-full p-5">
                    <img
                        src={image}
                        alt={"test"}
                        style={{ height: "200px", width: "390px" }}
                        className=" object-cover rounded-lg"
                    />
                    <div className="p-4 text-left">
                        {/* <Chip
                            label={title}
                            color="secondary"
                            size="medium"
                            sx={{ alignSelf: 'flex-end', mb: 2, fontSize: "large" }}
                        /> */}

                        <Typography className="font-bold" variant="h6">{title}</Typography>

                        <Stack direction="row" spacing={1} sx={{ display: "flex", justifyContent: "start", marginTop: "13px" }}>
                            {members.map((member, index) => (
                                <Chip
                                    key={index}
                                    label={member}
                                    color="secondary"
                                    className="text-sm"
                                    size="medium"
                                    sx={{ alignSelf: 'flex-end', mb: 1, backgroundColor: "#4A90E2", color: "white" }}
                                />
                            ))}
                        </Stack>

                        <div className="flex w-full justify-center align-middle mt-7">
                            <Button variant="custom" className="rounded-xl" style={{ borderRadius: "30px", height: "35px", textTransform: "none", boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
                                View more
                            </Button>
                        </div>
                    </div>
                </div>
            </MagicCard>
            {/* <CardContent sx={{ flexGrow: 1 }}>  Đảm bảo nội dung mở rộng đều */}

            {/* </CardContent> */}
        </Card>

    );
};

export default ClubCard;
