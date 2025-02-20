import React from "react";
import { Card, Typography, Chip } from "@mui/material";
import { MagicCard } from "@/components/magicui/magic-card";
import { FieldDTO } from "@/api/club-owner/RequestClubAPI";

interface ClubCardProps {
    image: string;
    title: string;
    field: FieldDTO[];
}

const InviteClubCard: React.FC<ClubCardProps> = ({ image, title, field }) => {

    return (
        <Card
            sx={{
                borderRadius: 3,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <MagicCard
                className="cursor-pointer flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
                gradientColor="#D1EAF0"
            >
                <div className="w-full p-5">
                    {/* 🖼 Image Responsive */}
                    <img
                        src={image}
                        alt={"test"}
                        style={{ height: "200px", width: "390px" }}
                        className="object-cover rounded-lg"
                    />

                    <div className="p-1 text-left">
                        <Typography className="font-bold" variant="h6" mt={1}>
                            {title}
                        </Typography>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
                                gap: "8px",
                                justifyContent: "center",
                                marginTop: "13px",
                            }}
                        >
                            {field && field.map((item, index) => (
                                <Chip
                                    key={index}
                                    label={item.fieldName}
                                    color="secondary"
                                    className="text-sm"
                                    size="medium"
                                    sx={{
                                        backgroundColor: "#4A90E2",
                                        color: "white",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </MagicCard>
        </Card>
    );
};

export default InviteClubCard;
