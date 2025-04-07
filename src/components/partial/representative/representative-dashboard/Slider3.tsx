import { Box, Typography, Paper } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./arrow.css";
import RequestClubCard from "./requestStudentCard";
import { ClubResponseDTO } from "@/api/club-owner/ClubByUser";
import { HiOutlineUsers } from "react-icons/hi";

interface EventSliderProps {
    clubs: ClubResponseDTO[];
    title: string;
}

const EventSlider3: React.FC<EventSliderProps> = ({ clubs, title }) => {
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
        <div className="mt-16 mb-7">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography
                    variant="h5"
                    fontWeight={700}
                    mb={2}
                    sx={{
                        background: "linear-gradient(to right, #136CB5, #49BBBD)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        display: "inline-block"
                    }}
                >
                    {title}
                </Typography>
            </Box>

            <Slider {...settings}>
                {clubs.length > 0 ? (
                    clubs.map((club, index) => (
                        <Box
                            key={index}
                            display="flex"
                            justifyContent="center"
                            sx={{ padding: { xs: "0 5px", sm: "0 10px" } }}
                        >
                            <RequestClubCard club={club} />
                        </Box>
                    ))
                ) : (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ padding: { xs: "0 5px", sm: "0 10px" }, marginBottom: "10px" }}
                    >
                        <Paper
                            elevation={3}
                            sx={{
                                height: 250,
                                width: 250,
                                borderRadius: 4,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "#f5f5f5",
                                color: "#666",
                                textAlign: "center",
                                px: 2,
                            }}
                        >
                            <HiOutlineUsers size={48} style={{ marginBottom: 8 }} />
                            <Typography variant="subtitle1" fontWeight={600}>
                                No club requests found
                            </Typography>
                            <Typography variant="body2">
                                New club requests will appear here 👥
                            </Typography>
                        </Paper>
                    </Box>
                )}
            </Slider>
        </div>
    );
};

export default EventSlider3;
