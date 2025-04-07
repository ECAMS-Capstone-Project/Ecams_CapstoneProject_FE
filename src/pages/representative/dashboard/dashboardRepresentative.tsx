import { GetStudentInUniversityAPI } from "@/api/representative/StudentAPI";
import Overview from "@/components/partial/representative/representative-dashboard/overView";
import EventSlider from "@/components/partial/representative/representative-dashboard/Slider";
import EventSlider2 from "@/components/partial/representative/representative-dashboard/Slider2";
import EventSlider3 from "@/components/partial/representative/representative-dashboard/Slider3";
import CommitSlider from "@/components/partial/representative/representative-dashboard/CommitSlider"; // Component hiển thị commit
import LoadingAnimation from "@/components/ui/loading";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import useAuth from "@/hooks/useAuth";
import StudentRequest from "@/models/StudentRequest";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const DashboardRepresentative = () => {
    const { user } = useAuth();
    const [pageNo] = useState(1);
    const [pageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const { events, isLoading } = useEvents(user?.universityId, pageNo, pageSize);
    const [stuList, setStuList] = useState<StudentRequest[]>([]);
    const [commitList, setCommitList] = useState<any[]>([]); // Có thể định nghĩa kiểu dữ liệu cụ thể cho commit nếu cần

    // Lấy danh sách student request
    useEffect(() => {
        const loadRequestStudent = async () => {
            try {
                if (!user?.universityId) {
                    throw new Error("University ID is undefined");
                }
                setLoading(true);
                const status = "CHECKING";
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
                console.error("Error loading student data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadRequestStudent();
    }, [pageNo, pageSize, user]);

    // Lấy commit từ GitHub
    useEffect(() => {
        const loadCommitsFromGithub = async () => {
            try {
                // Thay đổi thông tin repoOwner và repoName theo dự án của bạn
                const repoOwner = "your-github-username";
                const repoName = "your-repository-name";
                const per_page = 10;
                const page = 1;

                const response = await axios.get(
                    `https://api.github.com/repos/${repoOwner}/${repoName}/commits?per_page=${per_page}&page=${page}`
                );

                if (response.data) {
                    setCommitList(response.data);
                } else {
                    console.warn("No commits found on GitHub.");
                }
            } catch (error) {
                console.error("Error loading commits from GitHub:", error);
            }
        };

        loadCommitsFromGithub();
    }, []);

    return (
        <div className="p-4 pt-1">
            <Typography variant="h4" fontWeight="bold" mb={2}>
                Overview
            </Typography>
            <Overview />
            <EventSlider2 events={events} title="Recent Event" />
            {(isLoading || loading) ? (
                <div>
                    <LoadingAnimation />
                </div>
            ) : (
                <EventSlider
                    events={events.filter((a) => a.status.toLowerCase() === "pending")}
                    title="Pending Event"
                />
            )}
            <EventSlider3 students={stuList} title="Student Request" />
            <CommitSlider commits={commitList} title="Recent GitHub Commits" />
        </div>
    );
};

export default DashboardRepresentative;
