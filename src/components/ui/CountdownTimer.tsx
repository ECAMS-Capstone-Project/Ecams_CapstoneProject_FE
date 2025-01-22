import React, { useEffect, useState, useRef } from "react";
import { Button, Box } from "@mui/material";
import { VerifyEmailAPI } from "@/api/auth/OtpAPI";
import toast from "react-hot-toast";
import { throttle } from "lodash";

interface RequestEmail {
    email: string;
    setIsLoading: (value: boolean) => void;
}

const CountdownTimer: React.FC<RequestEmail> = ({ email, setIsLoading }) => {
    const [minutes, setMinutes] = useState<number>(1);
    const [seconds, setSeconds] = useState<number>(59);
    const [isCounting, setIsCounting] = useState<boolean>(false);
    const hasMounted = useRef(false);

    const sendOtpRequest = throttle(async () => {
        console.log("Sending OTP request...");
        setIsLoading(true);
        try {
            if (email) {
                const decodedEmail = atob(email);
                const response = await VerifyEmailAPI({ email: decodedEmail });
                if (response.statusCode === 201) {
                    toast.success("OTP sent successfully!");
                } else {
                    toast.error("Failed to send OTP");
                }
            }
        } catch (error) {
            toast.error("An error occurred while sending OTP");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, 60000);

    const handleSentOTP = () => {
        sendOtpRequest();
        setMinutes(1);
        setSeconds(59);
        setIsCounting(true);
    };

    useEffect(() => {
        if (!hasMounted.current) {
            sendOtpRequest();
            setIsCounting(true);
            hasMounted.current = true;
        }

        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds((prev) => prev - 1);
            } else if (minutes > 0) {
                setSeconds(59);
                setMinutes((prev) => prev - 1);
            } else {
                clearInterval(interval);
                setIsCounting(false);
            }
        }, 1000);

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isCounting) {
                event.preventDefault();
                if (window.confirm("Are you sure you want to leave this page? You will be redirected to the login page.")) {
                    window.location.href = "/login";
                }
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            clearInterval(interval);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [seconds, minutes, isCounting]);

    return (
        <Box
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
            }}
        >
            <div className="text-base flex align-middle justify-center">
                Time Remaining:
                <span className="font-bold ml-1">
                    {minutes < 10 ? `0${minutes}` : minutes}:
                    {seconds < 10 ? `0${seconds}` : seconds}
                </span>
            </div>
            <Button
                disabled={isCounting}
                fullWidth
                onClick={handleSentOTP}
                variant="contained"
                sx={{ width: 150, fontSize: "0.8rem" }}
            >
                Resend OTP
            </Button>
        </Box>
    );
};

export default CountdownTimer;