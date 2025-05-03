import React from "react";
import { Card, Typography } from "@mui/material";
import { MagicCard } from "@/components/magicui/magic-card";
import { FieldDTO } from "@/api/club-owner/RequestClubAPI";
import { Badge } from "@/components/ui/badge";

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
              className="space-x-1"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                justifyContent: field.length === 1 ? "start" : "start",
                marginTop: "13px",
              }}
            >
              {field &&
                field.map((item, index) => (
                  <Badge
                    key={index}
                    // color="secondary"
                    className="bg-[#78e1e33c] text-[#348687] text-center text-sm w-fit font-semibold px-2 py-1 rounded-full"
                  >
                    {item.fieldName}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </MagicCard>
    </Card>
  );
};

export default InviteClubCard;
