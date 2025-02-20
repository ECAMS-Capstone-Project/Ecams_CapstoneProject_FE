import React from "react";
import { Box, Typography, Grid2, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";

const WaitingStudentPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleClick = async () => {
    await logout();
    navigate('/login');
    toast.success("Logout successfully")
  }
  return (
    <Box
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
      alignItems="center"
    >
      <Grid2 container spacing={6} maxWidth="lg" mb={6} mt={5}>
        <Typography
          textAlign={"center"}
          color="#313131"
          sx={{ fontWeight: "bold" }}
          variant="h4"
          gutterBottom
        >
          Your information has been sent. Please wait and check your email for
          updates on the approval process. Thank you!
        </Typography>
      </Grid2>
      <Grid2 container spacing={6} maxWidth="md" mb={4}>
        <Grid2 paddingLeft={6} paddingRight={6} size={{ xs: 12 }}>
          <img
            width={900}
            src="https://i.pinimg.com/originals/3a/d6/15/3ad615655e2d5ddc9530e3380bb2ccb5.png"
          ></img>
        </Grid2>
      </Grid2>
      <div className='flex w-full justify-center'>
        <Button
          type="submit"
          onClick={handleClick}
          variant="contained"
          color="primary"
          sx={{
            mt: 4,
            background: 'linear-gradient(to right, #136CB5, #49BBBD)',
            textTransform: "none",
            fontWeight: "bold",
            width: 250
          }}
        >
          Back To Login
        </Button>
      </div>
    </Box>
  );
};

export default WaitingStudentPage;
