import { Card, CardContent, IconButton, Typography, Box } from "@mui/material";
import { ArrowRight } from "lucide-react";

interface EventCardProps {
    title: string;
    date: string;
    free: boolean;
    startTime: string;
    endTime: string;
    img?: string;
}

const RecentEventCard: React.FC<EventCardProps> = ({ title, date, free, startTime, img }) => {
    const handleClick = () => {
        console.log('Icon button clicked');
    };

    return (
        <Card sx={{ borderRadius: 4, height: "100%", position: "relative", boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
            <Box sx={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
                {img && (
                    <Box sx={{ position: "relative", width: "100%" }}>
                        <img src={img} alt="event" style={{ width: "100%", borderRadius: 8 }} />

                        {free ? (
                            <Box sx={{
                                position: "absolute",
                                top: 10,
                                left: 10,
                                background: "#fff",
                                color: "#6A0DAD",
                                fontWeight: "bold",
                                borderRadius: "8px",
                                padding: "4px 8px",
                                boxShadow: "0px 2px 4px rgba(0,0,0,0.2)"
                            }}>
                                FREE
                            </Box>
                        ) :
                            <Box sx={{
                                position: "absolute",
                                top: 10,
                                left: 10,
                                background: "#fff",
                                color: "#D63B3B",
                                fontWeight: "bold",
                                borderRadius: "8px",
                                padding: "4px 8px",
                                boxShadow: "0px 2px 4px rgba(0,0,0,0.2)"
                            }}>
                                PAID
                            </Box>}
                    </Box>
                )}
            </Box>
            <CardContent sx={{ padding: 2, height: "100%", paddingTop: 0 }}>

                <Typography sx={{ fontSize: "14px", fontWeight: 600, mt: 3, height: "50px" }} textAlign={"center"}>
                    {title}
                </Typography>

                <Typography style={{ alignItems: "center" }} sx={{ fontSize: "14.5px", color: "#7848F4", mt: 0, display: "flex" }}>
                    {date + ", " + startTime}
                </Typography>

                <Typography textAlign={"justify"} style={{ alignItems: "center" }} sx={{ fontSize: "14.5px", color: "#7E7E7E", mt: 3, display: "flex", mb: 0 }}>
                    Online Event
                </Typography>

                <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
                    <IconButton onClick={handleClick} sx={{ mt: 1, pb: 0, color: "black" }}>
                        <ArrowRight size={18} />
                    </IconButton>
                </div>
            </CardContent>
        </Card>
    );
};

export default RecentEventCard;
