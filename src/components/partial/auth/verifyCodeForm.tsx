import React from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid2,
    Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import CountdownTimer from "@/components/ui/CountdownTimer";

// Validation schema using Zod
const schema = z.object({
    email: z.string().email("Invalid email address"),
});

type SignUpFormValues = z.infer<typeof schema>;


const VerifyCodeForm: React.FC = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: SignUpFormValues) => {
        console.log(data);
        alert("Send OTP successfully!");
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <Grid2 container spacing={6} maxWidth="xl" mb={4}>
                {/* Left Side */}
                <Grid2 padding={8} size={{ xs: 12, md: 6 }} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "14px" }}>
                    <Typography color="#313131" sx={{ fontWeight: "bold" }} variant="h4" gutterBottom>
                        Verify OTP
                    </Typography>
                    <Typography color="#313131" sx={{ mb: 2 }} variant="subtitle1" gutterBottom>
                        Enter your OTP was sent in your email and renew your password
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid2 container spacing={4}>
                            <Grid2 size={{ xs: 12 }}>
                                <TextField
                                    {...register('email')}
                                    label="OTP Code"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12 }}>
                                <TextField
                                    {...register('email')}
                                    label="New Password"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12 }}>
                                <TextField
                                    {...register('email')}
                                    label="Confirm Password"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <CountdownTimer />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Button sx={{ background: 'linear-gradient(to right, #136CB5, #49BBBD)', textTransform: "none" }} type="submit" variant="contained" fullWidth>
                                    Submit
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
                                    <Button variant="text" className="w-32 h-12" sx={{ textTransform: "none", textDecoration: "underline", fontSize: "18px", color: "black" }}>
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
                        <img src="public/image/verifyOTP_img.png"></img>
                    </Stack>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default VerifyCodeForm;
