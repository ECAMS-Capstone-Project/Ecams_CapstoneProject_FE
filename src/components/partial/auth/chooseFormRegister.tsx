import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  styled,
  Grid2,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 1100,
  height: 550,
  margin: "auto",
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  marginTop: 60,
  padding: 20,
}));

const StyledGridItem = styled(Grid2)(({ theme }) => ({
  borderRadius: "8px",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  height: "200px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    "& .grid-image": {
      transform: "scale(1.1)",
    },
    "& .grid-text": {
      color: theme.palette.primary.main,
    },
  },
}));

interface TeamInviteFormProps {
  onClose?: () => void;
  onSubmit?: (data: { email: string; role: string }) => void;
}

const ChooseFormRegister: React.FC<TeamInviteFormProps> = () => {
  const navigate = useNavigate();
  const handleClick = (data: string) => {
    if (data == "student") {
      navigate("/register");
    } else {
      navigate("/register-university");
    }
  };

  return (
    <StyledCard>
      <CardContent>
        <Button
          onClick={() => navigate("/login")}
          variant="text"
          color="primary"
          sx={{
            width: "190px",
            textTransform: "none",
            color: "black",
            justifyContent: "start",
          }}
          startIcon={<ArrowBackIosNewIcon />} // Adding the back icon to the start of the button
        >
          Back to Login
        </Button>
        <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              className="mb-5"
              width={120}
              src="https://www.shutterstock.com/image-vector/make-choice-decision-concept-puzzled-600nw-2201623999.jpg"
            ></img>
            <Typography
              sx={{ fontWeight: "bold" }}
              variant="h5"
              ml={2}
              textAlign={"center"}
            >
              Please Choose Your Role To Register
            </Typography>
          </Box>
        </Box>

        <Grid2 container spacing={5} mt={10}>
          <StyledGridItem
            onClick={() => handleClick("student")}
            size={{ xs: 12, md: 6 }}
            sx={{
              borderRadius: "8px",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              height: "200px",
              cursor: "pointer",
            }}
          >
            <Typography
              variant="h6"
              mt={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                flexDirection: "column",
                fontWeight: "bold",
              }}
            >
              <img
                className="mb-5"
                width={100}
                src="https://cdn-icons-png.flaticon.com/512/1046/1046374.png"
              ></img>
              Student
            </Typography>
          </StyledGridItem>
          <StyledGridItem
            onClick={() => handleClick("staff")}
            size={{ xs: 12, md: 6 }}
            sx={{
              borderRadius: "8px",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              height: "200px",
            }}
          >
            <Typography
              variant="h6"
              mt={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                flexDirection: "column",
                fontWeight: "bold",
              }}
            >
              <img
                className="mb-5"
                width={90}
                src="https://cdn-icons-png.flaticon.com/512/12069/12069045.png"
              ></img>
              University Representative
            </Typography>
          </StyledGridItem>
          <Grid2
            size={{ xs: 12 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></Grid2>
        </Grid2>
      </CardContent>
    </StyledCard>
  );
};

export default ChooseFormRegister;
