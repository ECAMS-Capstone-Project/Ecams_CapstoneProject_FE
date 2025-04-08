import { Event } from "@/models/Event";
import { Card, CardContent, Typography, Box, Icon } from "@mui/material";
import { format } from "date-fns";

interface EventCardProps {
    event: Event;
}
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const RecentEventCard: React.FC<EventCardProps> = ({ event }: EventCardProps) => {
    // const handleClick = () => {
    //     console.log('Icon button clicked');
    // };

    return (
        <Card sx={{
            borderRadius: 4, height: "100%", position: "relative", boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', transition: "transform 0.3s ease-in-out",
            "&:hover": {
                transform: "scale(1.02)",
            },
        }} >
            <Box sx={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
                {event.imageUrl && (
                    <Box sx={{ position: "relative", width: "100%" }}>
                        <img src={event.imageUrl} alt="event" style={{ width: "100%", height: "200px", borderRadius: 8 }} />

                        {event.price <= 0 ? (
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
            <CardContent
                sx={{
                    padding: 3,
                    height: "100%",
                    paddingTop: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "linear-gradient(to bottom right, #f0f4ff, #ffffff)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "16px",
                        fontWeight: 700,
                        mt: 3,
                        color: "#1e3a8a",
                        height: "50px",
                    }}
                    textAlign="center"
                >
                    {event.eventName}
                </Typography>

                <Typography
                    sx={{
                        fontSize: "14.5px",
                        color: "#555",
                        mt: 2,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Icon component={CalendarTodayIcon} sx={{ color: "#3b82f6", mr: 1 }} />
                    <span className="font-medium text-gray-800">Start:</span>&nbsp;
                    {format(new Date(event.startDate), "dd/MM/yyyy")}
                </Typography>

                <Typography
                    sx={{
                        fontSize: "14.5px",
                        color: "#555",
                        mt: 1.5,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Icon component={CalendarTodayIcon} sx={{ color: "#3b82f6", mr: 1 }} />
                    <span className="font-medium text-gray-800">End:</span>&nbsp;
                    {format(new Date(event.endDate), "dd/MM/yyyy")}
                </Typography>

                <Typography
                    textAlign="center"
                    sx={{
                        fontSize: "15px",
                        color: "#1f2937",
                        mt: 3,
                        fontWeight: 500,
                        background: "#e0f2fe",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        display: "inline-block",
                    }}
                >
                    {event.representativeId != null
                        ? `University - ${event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1).toLowerCase()}`
                        : `Club - ${event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1).toLowerCase()}`}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default RecentEventCard;
