import { Card, CardContent, Icon, Typography } from "@mui/material";

import { Event } from "@/models/Event";
import { format } from "date-fns";
interface EventCardProps {
    event: Event;
}
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const EventCard: React.FC<EventCardProps> = ({ event }: EventCardProps) => {
    // const handleClick = () => {
    //     console.log('Icon button clicked');
    // };
    return (
        <Card
            sx={{
                borderRadius: 4,
                height: "100%",
                background: "linear-gradient(to bottom right, #f7faff, #ffffff)",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                    transform: "scale(1.02)",
                },
            }}
        >
            <CardContent sx={{ padding: 3, height: "100%" }}>
                <Typography
                    variant="body2"
                    sx={{
                        color: event.price === 0 ? "#6A0DAD" : "#ef4444",
                        fontWeight: "bold",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        mb: 1,
                    }}
                >
                    {event.price === 0 ? "FREE" : "PAID"}
                </Typography>

                <Typography
                    sx={{
                        fontSize: "17px",
                        fontWeight: 700,
                        textAlign: "center",
                        mt: 1,
                        mb: 2,
                        color: "#1e293b",
                        minHeight: "50px",
                    }}
                >
                    {event.eventName}
                </Typography>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#1d4ed8",
                            backgroundColor: "#e0f2fe",
                            border: "1px solid #cbd5e1",
                            borderRadius: "9999px",
                            paddingX: "20px",
                            paddingY: "5px",
                        }}
                    >
                        {event.representativeId != null
                            ? `University - ${event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1).toLowerCase()}`
                            : `Club - ${event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1).toLowerCase()}`}
                    </Typography>
                </div>

                <Typography sx={{ fontSize: "15px", color: "#334155", display: "flex", alignItems: "center", mt: 2 }}>
                    <Icon component={CalendarTodayIcon} sx={{ color: "#3b82f6", mr: 1 }} />
                    <span className="font-semibold mr-1">Start:</span> {format(new Date(event.startDate), "dd/MM/yyyy")}
                </Typography>

                <Typography sx={{ fontSize: "15px", color: "#334155", display: "flex", alignItems: "center", mt: 1.5 }}>
                    <Icon component={CalendarTodayIcon} sx={{ color: "#3b82f6", mr: 1 }} />
                    <span className="font-semibold mr-1">End:</span> {format(new Date(event.endDate), "dd/MM/yyyy")}
                </Typography>
            </CardContent>
        </Card>

    );
};

export default EventCard;
