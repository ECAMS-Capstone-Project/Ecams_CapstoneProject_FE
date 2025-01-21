import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';

const CountdownTimer: React.FC = () => {
    const [minutes, setMinutes] = useState<number>(1);
    const [seconds, setSeconds] = useState<number>(59);

    const handleSentOTP = () => {
        setMinutes(1)
        setSeconds(59)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1)
            }

            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(interval)
                } else {
                    setSeconds(59)
                    setMinutes(minutes - 1)
                }
            }
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [seconds, minutes])

    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px" }}>
            <div className='text-base flex align-middle justify-center'>
                Time Remaining:
                <span className='font-bold ml-1'>
                    {minutes < 10 ? `0${minutes}` : minutes}:
                    {seconds < 10 ? `0${seconds}` : seconds}
                </span>
            </div>
            <Button
                disabled={minutes > 0 || seconds > 0}
                fullWidth
                onClick={handleSentOTP}
                variant="contained"
                sx={{ width: 150, fontSize: "0.8rem" }}
            >
                Resend OTP
            </Button>
        </div>
    );
}
export default CountdownTimer;
