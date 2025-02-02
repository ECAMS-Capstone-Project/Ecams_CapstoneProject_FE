import { Card, CardContent, Icon, IconButton, Typography } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
interface EventCardProps {
    title: string;
    date: string;
    free: boolean;
    startTime: string;
    endTime: string
}
import { ArrowRight } from "lucide-react";
const EventCard: React.FC<EventCardProps> = ({ title, date, free, startTime, endTime }) => {
    const handleClick = () => {
        console.log('Icon button clicked');
    };
    return (
        <Card sx={{ borderRadius: 4, height: "100%", boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
            <CardContent sx={{ padding: 2, height: "100%" }}>
                <Typography variant="body2" color={free ? "#6A0DAD" : "error"} fontWeight="bold">
                    {free ? "FREE" : "PAID"}
                </Typography>
                <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography style={{ alignItems: "center", color: "#4782D7" }} sx={{
                        fontSize: "14px", color: "#333", mt: 1, border: "1px solid #E3E3E3", borderRadius: "8px", width: "85%",
                        height: "30px", display: "flex", justifyContent: "center", background: "#F2F8FF"
                    }}>{date}</Typography>
                </div>
                <Typography sx={{ fontSize: "14px", fontWeight: 600, mt: 4, height: "50px" }} textAlign={"center"}>
                    {title}
                </Typography>
                <Typography style={{ alignItems: "center" }} sx={{ fontSize: "14px", color: "#7848F4", mt: 1, display: "flex" }}>
                    <Icon component={AccessTimeIcon} sx={{ color: "#71717A", mr: 1 }} />
                    {startTime + " - " + endTime}
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

export default EventCard;
