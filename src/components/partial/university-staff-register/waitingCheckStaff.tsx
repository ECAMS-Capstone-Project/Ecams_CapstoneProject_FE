import React from "react";
import { Box, Typography, Grid2 } from "@mui/material";

const WaitingCheckStaff: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
      alignItems="center"
    >
      <Grid2 container spacing={6} maxWidth="lg" mb={6}>
        <Typography
          textAlign={"center"}
          color="#313131"
          sx={{ fontWeight: "bold" }}
          variant="h4"
          gutterBottom
        >
          Your information has been submitted. Please check your email for
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
    </Box>
  );
};

export default WaitingCheckStaff;
