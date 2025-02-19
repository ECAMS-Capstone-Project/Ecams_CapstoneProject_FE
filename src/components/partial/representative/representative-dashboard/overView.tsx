import { Grid2, Paper, Typography } from "@mui/material";

type IconType = "EC" | "TC" | "TR" | "TT";

const overviewData: { label: string; value: string; icon: IconType }[] = [
    { label: "Total Events", value: "40 Events", icon: "EC" },
    { label: "Total Clubs", value: "20 Clubs", icon: "TC" },
    { label: "Total Request", value: "10 Request", icon: "TR" },
    { label: "Total Transaction", value: "50 Transaction", icon: "TT" }
];

const iconColorMap: Record<"EC" | "TC" | "TR" | "TT", string> = {
    EC: "#4caf50",
    TC: "#ff9800",
    TR: "#f44336",
    TT: "#3f51b5",
};

const Overview = () => {
    return (
        <Grid2 container spacing={2}>
            {overviewData.map((item, index) => (
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <Paper sx={{ p: 2, textAlign: "center", borderRadius: 3, display: "flex", gap: "30px", alignItems: "center", boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
                        <div>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{
                                    borderRadius: "25px",
                                    padding: 1.5,
                                    backgroundColor: iconColorMap[item.icon],
                                    color: "#fff"
                                }}
                            >
                                {item.icon}
                            </Typography>
                        </div>
                        <div>
                            <Typography fontWeight={'600'} variant="h6" sx={{ color: "#464255" }}>{item.label}</Typography>
                            <Typography textAlign={'start'} variant="h6" sx={{ color: "#464255" }}>{item.value}</Typography>
                        </div>
                    </Paper>
                </Grid2>
            ))}
        </Grid2>
    );
};

export default Overview;
