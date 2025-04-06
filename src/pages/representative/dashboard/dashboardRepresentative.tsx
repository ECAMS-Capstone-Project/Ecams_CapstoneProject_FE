import { GetStudentInUniversityAPI } from "@/api/representative/StudentAPI";
import Overview from "@/components/partial/representative/representative-dashboard/overView";
import EventSlider from "@/components/partial/representative/representative-dashboard/Slider";
import EventSlider2 from "@/components/partial/representative/representative-dashboard/Slider2";
import EventSlider3 from "@/components/partial/representative/representative-dashboard/Slider3";
import LoadingAnimation from "@/components/ui/loading";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import useAuth from "@/hooks/useAuth";
import StudentRequest from "@/models/StudentRequest";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

const DashboardRepresentative = () => {
    const { user } = useAuth();
    const [pageNo] = useState(1);
    const [pageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const { events, isLoading } = useEvents(
        user?.universityId,
        pageNo,
        pageSize
    );
    const [stuList, setStuList] = useState<StudentRequest[]>([]);
    useEffect(() => {
        const loadRequestStudent = async () => {
            try {
                if (!user?.universityId) {
                    throw new Error("University ID is undefined");
                }

                setLoading(true);

                // Xác định status theo tab
                const status = "CHECKING";

                // Gọi API với status tương ứng
                const uniData = await GetStudentInUniversityAPI(
                    user.universityId,
                    pageSize,
                    pageNo,
                    status
                );

                if (uniData) {
                    setStuList(uniData.data?.data || []);
                } else {
                    console.warn("Student returned no data");
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadRequestStudent();
    }, [pageNo, pageSize, user]);
    return (
        <div className="p-4 pt-1">
            <Typography variant="h4" fontWeight="bold" mb={2}>Overview</Typography>
            <Overview />
            <EventSlider2 events={events} title="Recent Event" />
            {(isLoading || loading) ? <div><LoadingAnimation /></div> : (
                <EventSlider events={events.filter(a => a.status.toLowerCase() == "pending")} title="Pending Event" />
            )}
            <EventSlider3 students={stuList} title="Student Request" />
        </div>

    );
};

export default DashboardRepresentative;
