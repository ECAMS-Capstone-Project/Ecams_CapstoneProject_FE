import { Card, CardContent, Typography, Box, Divider, Chip } from "@mui/material";
import { format } from "date-fns";
import StudentRequest from "@/models/StudentRequest";

interface RequestStudentCardProps {
    student: StudentRequest;
}

const RequestStudentCard: React.FC<RequestStudentCardProps> = ({ student }) => {
    return (
        <Card
            sx={{
                borderRadius: 3,
                height: "100%",
                position: "relative",
                boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                },
            }}
        >
            {student.imageUrl && (
                <Box sx={{ position: "relative", width: "100%" }}>
                    <img
                        src={student.imageUrl}
                        alt={student.fullname}
                        style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                        }}
                    />
                </Box>
            )}
            <CardContent sx={{ flex: 1, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e3a8a" }}>
                    {student.fullname}
                </Typography>

                <Typography sx={{ fontSize: 14, color: "#555", mt: 0.5 }}>
                    🎓 {student.universityName}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#777", mb: 1 }}>
                    📘 Major: {student.major} · Year: {student.yearOfStudy}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                    {/* <Typography sx={{ fontSize: 13, color: "#444" }}>
                        🆔 ID: {student.studentId}
                    </Typography> */}
                    <Typography sx={{ fontSize: 13, color: "#444" }}>
                        📅 Start: {format(new Date(student.startDate), "dd/MM/yyyy")}
                    </Typography>
                    {student.endDate && (
                        <Typography sx={{ fontSize: 13, color: "#444" }}>
                            📅 End: {format(new Date(student.endDate), "dd/MM/yyyy")}
                        </Typography>
                    )}
                    <Typography sx={{ fontSize: 13, color: "#444" }}>
                        📧 {student.email}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "#444" }}>
                        📞 {student.phonenumber}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "#444" }}>
                        🏠 {student.address}
                    </Typography>
                </Box>

                <Box sx={{ mt: 2, display: "flex", justifyContent: "end" }}>
                    <Chip
                        label={student.status}
                        color={"warning"}
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default RequestStudentCard;
