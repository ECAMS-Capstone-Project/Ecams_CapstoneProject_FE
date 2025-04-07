import { Box, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./arrow.css"
import RecentEventCard from "./recentEventCard";
import { Event } from "@/models/Event";
interface EventSliderProps {
    events: Event[];
    title: string;
}

const EventSlider2: React.FC<EventSliderProps> = ({ events, title }) => {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
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
            </Box>
            <Slider {...settings}>
                {events.map((event, index) => (
                    <Box key={index} display={'flex'} justifyContent={'center'} sx={{ padding: { xs: "0 5px", sm: "0 10px" } }}>
                        <RecentEventCard event={event} />
                    </Box>
                ))}
            </Slider>
        </div>
    );
};

export default EventSlider2;
