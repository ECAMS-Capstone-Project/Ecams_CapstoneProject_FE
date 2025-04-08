import React, { useState } from "react";
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
import CountdownTimer from "@/components/ui/CountdownTimer";
import { useNavigate, useParams } from "react-router-dom";
import { ring2 } from 'ldrs'
import useAuth from "@/hooks/useAuth";

// Validation schema using Zod
const schema = z.object({
    otp: z.string().min(1, "Please enter OTP"),
});

type SignUpFormValues = z.infer<typeof schema>;


const VerifyEmailForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { sendOtp } = useAuth()
    ring2.register()
    const { email } = useParams<{ email: string }>();
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
        console.log(data);
        if (email) {
            const decodedEmail = atob(email);
            await sendOtp(data.otp, decodedEmail)
        };
    }
    const navigate = useNavigate();

    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <Grid2 container spacing={6} maxWidth="xl" mb={4}>
                {/* Left Side */}
                <Grid2 padding={8} size={{ xs: 12, md: 6 }} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "14px" }}>
                    <Typography color="#313131" sx={{ fontWeight: "bold" }} variant="h4" gutterBottom>
                        Verify OTP
                    </Typography>
                    <Typography color="#313131" sx={{ mb: 2 }} variant="subtitle1" gutterBottom>
                        Enter your OTP has recent sent in your email
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid2 container spacing={4}>
                            <Grid2 size={{ xs: 12 }}>
                                <TextField
                                    {...register('otp')}
                                    label="OTP Code"
                                    fullWidth
                                    error={!!errors.otp}
                                    helperText={errors.otp?.message}
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <CountdownTimer email={email || ''} setIsLoading={setIsLoading} />
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
                                    disabled={isSubmitting || isLoading}
                                    startIcon={
                                        isSubmitting || isLoading && (
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
                                    {(isSubmitting || isLoading) ? "Waiting" : "Submit"}
                                </Button>
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <div className="relative my-2 flex items-center justify-center">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300 opacity-50"></div>
                                    </div>
                                </div>
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <div className="flex justify-center mt-4 gap-4">
                                    <Button onClick={() => navigate('/login')} variant="text" className="w-32 h-12" sx={{ textTransform: "none", textDecoration: "underline", fontSize: "18px", color: "black" }}>
                                        Back to login
                                    </Button>
                                </div>
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
                        <img src="https://res.cloudinary.com/ecams/image/upload/v1738675298/verify_OTP"></img>
                    </Stack>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default VerifyEmailForm;
