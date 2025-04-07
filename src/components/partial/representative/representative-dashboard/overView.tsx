import { Grid, Paper, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { GetStatisticUniversity, StatisticResponse } from "@/api/admin/Statistic";
import useAuth from "@/hooks/useAuth";
import LoadingAnimation from "@/components/ui/loading";
import { formatPrice } from "@/lib/FormatPrice";
import { BarChart2, Users, CalendarCheck, Building2 } from "lucide-react";

const iconMap = {
    ER: <BarChart2 size={24} />,
    TE: <CalendarCheck size={24} />,
    TC: <Building2 size={24} />,
    TS: <Users size={24} />,
};

const iconColorMap = {
    ER: "#4caf50",
    TE: "#f44336",
    TC: "#ff9800",
    TS: "#3f51b5",
};

const Overview = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<StatisticResponse>();

    useEffect(() => {
        const loadStatistics = async () => {
            if (!user?.universityId) return;
            setLoading(true);
            try {
                const response = await GetStatisticUniversity(user.universityId);
                setData(response.data);
            } catch (error) {
                console.error("Error loading statistics:", error);
            } finally {
                setLoading(false);
            }
        };
        loadStatistics();
    }, [user]);

    const overviewData: { label: string; value: string; icon: keyof typeof iconColorMap }[] = [
        { label: "Event's Revenue", value: formatPrice(data?.revenue || 0), icon: "ER" },
        { label: "Total Events", value: `${data?.numOfEvents || 0} events`, icon: "TE" },
        { label: "Total Clubs", value: `${data?.numOfClubs || 0} clubs`, icon: "TC" },
        { label: "Total Students", value: `${data?.numOfStudents || 0} students`, icon: "TS" },
    ];

    if (loading) return <LoadingAnimation />;

    return (
        <Grid container spacing={2}>
            {overviewData.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper
                        sx={{
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            borderRadius: 3,
                            boxShadow: 3,
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                                boxShadow: 6,
                                transform: "scale(1.05)",
                                backgroundColor: "#f5f5f5",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "50%",
                                backgroundColor: iconColorMap[item.icon],
                                color: "#fff",
                            }}
                        >
                            {iconMap[item.icon]}
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                                {item.label}
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#555" }}>
                                {item.value}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

export default Overview;
