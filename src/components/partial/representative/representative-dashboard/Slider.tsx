import { Box, Button, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EventCard from "./eventCard";
import Slider from "react-slick";
import "./arrow.css"
import RecentEventCard from "./recentEventCard";
import { ArrowRight } from "lucide-react";
interface EventSliderProps {
    events: { title: string; date: string; free: boolean, startTime: string, endTime: string, img?: string, status: string }[];
    title: string;
}

const EventSlider: React.FC<EventSliderProps> = ({ events, title }) => {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 3000,
        arrows: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: { slidesToShow: 4 },
            },
            {
                breakpoint: 900,
                settings: { slidesToShow: 3 },
            },
            {
                breakpoint: 600,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 400,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    return (
        <div className="mt-16 mb-7" >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">{title}</Typography>
                <Button variant="contained" sx={{ gap: 1, textTransform: "none", background: 'linear-gradient(to right, #136CB5, #49BBBD)', fontWeight: "600" }}>
                    View More <ArrowRight size={18} />
                </Button>
            </Box>
            <Slider {...settings}>
                {events.map((event, index) => (
                    (event.status.toLocaleLowerCase() == "pending") ?
                        <Box key={index} display={'flex'} justifyContent={'center'} sx={{ padding: { xs: "0 5px", sm: "0 10px" } }}>
                            <EventCard title={event.title} date={event.date} free={event.free} startTime={event.startTime} endTime={event.endTime} />
                        </Box>
                        :
                        <Box key={index} display={'flex'} justifyContent={'center'} sx={{ padding: { xs: "0 5px", sm: "0 10px" } }}>
                            <RecentEventCard title={event.title} date={event.date} free={event.free} startTime={event.startTime} endTime={event.endTime} img={event.img} />
                        </Box>
                ))}
            </Slider>
        </div>
    );
};

export default EventSlider;
