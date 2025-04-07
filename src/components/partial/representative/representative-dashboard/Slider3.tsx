import { Box, Button, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./arrow.css"
import { ArrowRight } from "lucide-react";
import StudentRequest from "@/models/StudentRequest";
import RequestStudentCard from "./requestStudentCard";
import { useNavigate } from "react-router-dom";
interface EventSliderProps {
    students: StudentRequest[];
    title: string;
}

const EventSlider3: React.FC<EventSliderProps> = ({ students, title }) => {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
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
    const navigate = useNavigate();
    return (
        <div className="mt-16 mb-7" >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">{title}</Typography>
                <Button variant="contained" onClick={() => navigate('/representative/request-student')} sx={{ gap: 1, textTransform: "none", background: 'linear-gradient(to right, #136CB5, #49BBBD)', fontWeight: "600" }}>
                    View More <ArrowRight size={18} />
                </Button>
            </Box>
            <Slider {...settings}>
                {students.map((student, index) => (
                    <Box key={index} display={'flex'} justifyContent={'center'} sx={{ padding: { xs: "0 5px", sm: "0 10px" } }}>
                        <RequestStudentCard student={student} />
                    </Box>
                ))}
            </Slider>
        </div>
    );
};

export default EventSlider3;
