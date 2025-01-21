import React from "react";
import {
    Box,
    Button,
    Typography,
    Grid2,
    Stack,
} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from "react-router-dom";

const ChooseFormRegister: React.FC = () => {

    const handleBackClick = () => {
        navigate('/login')
    };

    const navigate = useNavigate();

    return (
        <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
            <Grid2 container spacing={6} maxWidth="xl" mb={4}>
                <Grid2 size={{ xs: 12, md: 6, sm: 0 }} sx={{ display: "flex", justifyContent: "center" }}>
                    <Stack
                        sx={{
                            display: "flex", alignContent: "center", justifyContent: "center",
                            width: "80%",
                            maxWidth: "50rem",
                        }}
                    >
                        <img src="public/image/forgot_password_img.png"></img>
                    </Stack>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }} sx={{ display: "flex", flexDirection: "column", justifyContent: "start", gap: "14px" }}>
                    <Button
                        variant="text"
                        color="primary"
                        sx={{ width: "190px", mb: 1, textTransform: "none", color: "black", justifyContent: "start" }}
                        startIcon={<ArrowBackIosNewIcon />} // Adding the back icon to the start of the button
                        onClick={handleBackClick}
                    >
                        Back to Login
                    </Button>

                    <Typography color="#313131" sx={{ fontWeight: "bold" }} variant="h4" gutterBottom>
                        Please choose what you are
                    </Typography>
                    <Typography color="#313131" sx={{ mb: 2 }} variant="subtitle1" gutterBottom>
                        Don't worry, happens to all of us.
                    </Typography>

                    <Grid2 container spacing={4}>
                        <Grid2 mt={4} size={{ xs: 12 }} display={"flex"} justifyContent={"center"}>
                            <Button onClick={() => navigate('/register')} sx={{ width: "180px", height: "40px" }} variant="outlined">Student</Button>
                        </Grid2>
                        <Grid2 mt={5} size={{ xs: 12 }} display={"flex"} justifyContent={"center"}>
                            <Button onClick={() => navigate('/register-university')} sx={{ width: "180px", height: "40px" }} variant="outlined">University</Button>
                        </Grid2>
                    </Grid2>
                </Grid2>

            </Grid2>
        </Box>
    );
};

export default ChooseFormRegister;
