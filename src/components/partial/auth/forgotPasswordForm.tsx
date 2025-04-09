import React from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid2,
    Stack,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from "react-router-dom";
import { ForgotPasswordAPI } from "@/api/auth/OtpAPI";
import toast from "react-hot-toast";
import { ring2 } from 'ldrs'

// Validation schema using Zod
const schema = z.object({
    email: z.string().email("Invalid email address"),
});

type SignUpFormValues = z.infer<typeof schema>;


const ForgotPasswordForm: React.FC = () => {
    ring2.register()
    const navigate = useNavigate();
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
        try {
            const response = await ForgotPasswordAPI({ email: data.email });
            if (response.statusCode === 201) {
                toast.success("OTP sent successfully!");
                const encodedEmail = btoa(data.email);
                navigate(`/verify-code/${encodedEmail}`)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleBackClick = () => {
        navigate('/login')
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <Grid2 container spacing={6} maxWidth="xl" mb={4}>
                {/* Left Side */}
                <Grid2 paddingLeft={6} paddingRight={6} size={{ xs: 12, md: 6 }} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "14px" }}>
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
                        Forgot your password
                    </Typography>
                    <Typography color="#313131" sx={{ mb: 2 }} variant="subtitle1" gutterBottom>
                        Don't worry, happens to all of us. Enter your email below to recover your password
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid2 container spacing={4}>
                            <Grid2 size={{ xs: 12 }}>
                                <TextField
                                    {...register('email')}
                                    label="Email"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Button
                                    sx={{
                                        background:
                                            "linear-gradient(to right, #136CB5, #49BBBD)",
                                        textTransform: "none",
                                    }}
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={isSubmitting}
                                    startIcon={
                                        isSubmitting && (
                                            <l-ring-2
                                                size="40"
                                                stroke="5"
                                                stroke-length="0.25"
                                                bg-opacity="0.1"
                                                speed="0.8"
                                                color="black"
                                            ></l-ring-2>
                                        )
                                    }
                                >
                                    {(isSubmitting) ? "Loading" : "Submit"}
                                </Button>
                            </Grid2>
                        </Grid2>
                    </form>
                </Grid2>

                {/* Right Side */}
                <Grid2 size={{ xs: 12, md: 6, sm: 0 }} sx={{ display: "flex", justifyContent: "center" }}>
                    <Stack
                        sx={{
                            display: "flex", alignContent: "center", justifyContent: "center",
                            width: "80%",
                            maxWidth: "50rem",
                        }}
                    >
                        <img src="https://res.cloudinary.com/ecams/image/upload/v1738675298/forgot_password"></img>
                    </Stack>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default ForgotPasswordForm;
