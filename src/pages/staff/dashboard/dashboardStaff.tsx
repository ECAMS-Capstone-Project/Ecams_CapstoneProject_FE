import { Typography } from "@mui/material";
import EventSlider from "../../../components/partial/staff/staff-dashboard/Slider";
import Overview from "../../../components/partial/staff/staff-dashboard/overView";
const events = [
    { title: "Marketing 101", date: "April 27 2024", free: true, startTime: "8:00 AM", endTime: "10:00 AM", img: "/public/image/test.png", status: "active" },
    { title: "Data Science Bootcamp", date: "May 10 2024", free: false, startTime: "8:00 AM", endTime: "10:00 AM", img: "/public/image/test.png", status: "active" },
    { title: "Data Science Bootcamp", date: "May 10 2024", free: false, startTime: "8:00 AM", endTime: "10:00 AM", img: "/public/image/test.png", status: "active" },
];
const events2 = [
    { title: "UX/UI Workshop", date: "June 15 2024", free: true, startTime: "8:00 AM", endTime: "10:00 AM", status: "pending" },
    { title: "Python for Beginners", date: "July 1 2024", free: false, startTime: "8:00 AM", endTime: "10:00 AM", status: "pending" },
    { title: "ReactJS Masterclass", date: "July 20 2024", free: true, startTime: "8:00 AM", endTime: "10:00 AM", status: "pending" },
    { title: "Startup Pitch Night", date: "August 5 2024", free: true, startTime: "8:00 AM", endTime: "10:00 AM", status: "pending" },
    { title: "Startup Pitch Night", date: "August 5 2024", free: true, startTime: "8:00 AM", endTime: "10:00 AM", status: "pending" },
    { title: "Startup Pitch Night", date: "August 5 2024", free: true, startTime: "8:00 AM", endTime: "10:00 AM", status: "pending" },

]
const DashboardStaff = () => {
    return (
        <div className="p-4 pt-1">
            <Typography variant="h4" fontWeight="bold" mb={2}>Overview</Typography>
            <Overview />
            <EventSlider events={events} title="Recent Event" />
            <EventSlider events={events2} title="Pending Event" />
            <EventSlider events={events2} title="Pending Request" />
        </div>

    );
};

export default DashboardStaff;
