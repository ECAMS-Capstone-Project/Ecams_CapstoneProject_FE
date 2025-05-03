import React from "react";
import { Card, Typography, Chip } from "@mui/material";
import { MagicCard } from "@/components/magicui/magic-card";
import { Button } from "@/components/ui/button";
import { FieldDTO } from "@/api/club-owner/RequestClubAPI";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

interface ClubCardProps {
  image: string;
  title: string;
  field: FieldDTO[];
  clubId: string;
  clubOwnerId?: string;
  status: "PARTICIPATED" | "HISTORY" | "PENDING" | "PROCESSING";
}

const ClubCard: React.FC<ClubCardProps> = ({
  image,
  title,
  field,
  clubId,
  clubOwnerId,
  status,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
            <div className="flex justify-between items-center mt-2">
              <Typography className="font-bold" variant="h6">
                {title}
              </Typography>
              <Chip
                label={clubOwnerId == user?.userId ? "Club Owner" : "Member"}
                color="primary"
                size="small"
                sx={{ justifyContent: "end", fontWeight: "bold" }}
              />
            </div>
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
            {status == "PARTICIPATED" && (
              <div className="flex w-full justify-center align-middle mt-7">
                <Button
                  variant="custom"
                  className="rounded-xl"
                  style={{
                    borderRadius: "30px",
                    height: "35px",
                    textTransform: "none",
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                  }}
                  onClick={() => navigate(`/club/detail/${clubId}`)}
                >
                  View more
                </Button>
              </div>
            )}
          </div>
        </div>
      </MagicCard>
    </Card>
  );
};

export default ClubCard;
