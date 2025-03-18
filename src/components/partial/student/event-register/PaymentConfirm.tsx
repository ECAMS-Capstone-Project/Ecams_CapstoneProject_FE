/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Box,
  Card,
  Container,
  Typography,
  IconButton,
  styled,
  Grid2,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Place } from "@mui/icons-material";

const BackgroundWrapper = styled(Box)({
  minHeight: "100vh",
  width: "100%",
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/public/image/test2.png')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  flexDirection: "column",
  position: "relative",
});

const TopBar = styled(Box)({
  padding: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const BackButton = styled(Button)({
  backgroundColor: "#0288d1",
  color: "white",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#0277bd",
  },
});

const EventCard = styled(Card)({
  backgroundColor: "#0288d1",
  color: "white",
  marginBottom: "20px",
  display: "flex",
  padding: "16px",
  gap: "16px",
  justifyContent: "space-between",
});

const FormContainer = styled(Card)({
  width: "100%",
  margin: "0 auto",
  marginTop: "20px",
  padding: "24px",
});

const generateRandomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const EventPaymentConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { event, userInfo } = location.state || {};
  const [userCaptchaInput, setUserCaptchaInput] = useState<string>("");
  const [captchaCode, setCaptchaCode] = useState(generateRandomCode());
  const [confirmationMethod, setConfirmationMethod] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationMethod(event.target.value);
  };

  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserCaptchaInput(e.target.value);
  };

  const handleSubmit = async () => {
    toast.dismiss();
    if (userCaptchaInput !== captchaCode) {
      toast.error("Invalid CAPTCHA code. Please try again!");
      setCaptchaCode(generateRandomCode());
      setUserCaptchaInput("");
      return;
    }
    if (!confirmationMethod) {
      toast.error("Please select a confirmation method");
      return;
    }
    toast.success("Event registration successful!");
    navigate("/events");
  };

  if (!event || !userInfo) {
    return (
      <div>
        No event or user information found. Please go back to the event page.
      </div>
    );
  }

  return (
    <BackgroundWrapper>
      <TopBar style={{ backgroundColor: "#FFF", marginBottom: "20px" }}>
        <BackButton
          startIcon={<ArrowBackIcon />}
          sx={{ background: "linear-gradient(to right, #136CB5, #49BBBD)" }}
          variant="contained"
          onClick={() => window.history.back()}
        >
          Back
        </BackButton>
        <IconButton>
          <AccountCircleIcon />
        </IconButton>
      </TopBar>

      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingTop: "80px",
          marginBottom: "20px",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: "white", textAlign: "center", mb: 2 }}
        >
          Confirm Event Registration
        </Typography>
        <Grid2 container spacing={2} sx={{ background: "white" }}>
          <Grid2 size={{ md: 6, xs: 12 }}>
            <FormContainer>
              <EventCard>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {event.eventName}
                  </Typography>
                  <Typography variant="body2" gutterBottom mb={1}>
                    <CalendarDays size={18} className="inline-block mr-1" />
                    {format(new Date(event.startDate), "iiii, PP")}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <Place className="inline-block mr-1" />
                    {event.eventAreas.map((area: any) => area.name).join(", ")}
                  </Typography>
                </Box>
                <div>
                  <Box
                    component="img"
                    src={event.imageUrl}
                    alt="Event"
                    sx={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                </div>
              </EventCard>

              <Box
                component="form"
                sx={{
                  "& .MuiTextField-root": {
                    mb: 2,
                    paddingBottom: 3,
                    boxShadow: "none",
                  },
                }}
              >
                <Grid2
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ height: "50px" }}
                >
                  <Grid2 size={{ sm: 5 }}>
                    <Typography variant="body1">Full Name:</Typography>
                  </Grid2>
                  <Grid2 size={{ sm: 6 }}>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary", fontWeight: "bold" }}
                    >
                      {userInfo.name}
                    </Typography>
                  </Grid2>
                </Grid2>
                <Grid2
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ height: "50px" }}
                >
                  <Grid2 size={{ sm: 5 }}>
                    <Typography variant="body1">Student Code:</Typography>
                  </Grid2>
                  <Grid2 size={{ sm: 6 }}>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary", fontWeight: "bold" }}
                    >
                      {userInfo.studentCode}
                    </Typography>
                  </Grid2>
                </Grid2>
                <Grid2
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ height: "50px" }}
                >
                  <Grid2 size={{ sm: 5 }}>
                    <Typography variant="body1">Email:</Typography>
                  </Grid2>
                  <Grid2 size={{ sm: 6 }}>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary", fontWeight: "bold" }}
                    >
                      {userInfo.email}
                    </Typography>
                  </Grid2>
                </Grid2>
                <Grid2
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ height: "50px" }}
                >
                  <Grid2 size={{ sm: 5 }}>
                    <Typography variant="body1">Phone Number:</Typography>
                  </Grid2>
                  <Grid2 size={{ sm: 6 }}>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary", fontWeight: "bold" }}
                    >
                      {userInfo.phone}
                    </Typography>
                  </Grid2>
                </Grid2>
                <Grid2
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  mt={5}
                  mb={3}
                >
                  <Grid2 size={{ sm: 5 }}>
                    <Box
                      sx={{
                        textAlign: "center",
                        padding: "10px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "5px",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {captchaCode}
                    </Box>
                  </Grid2>
                  <Grid2 size={{ sm: 5 }}>
                    <TextField
                      required
                      style={{ marginBottom: "0px", paddingBottom: "0px" }}
                      label="CAPTCHA Code"
                      variant="outlined"
                      onChange={handleCaptchaChange}
                      value={userCaptchaInput}
                    />
                  </Grid2>
                </Grid2>
              </Box>
            </FormContainer>
          </Grid2>
          <Grid2 size={{ md: 6, xs: 12 }}>
            <FormContainer>
              <Typography
                variant="h6"
                style={{ color: "black", marginBottom: "15px" }}
              >
                Registration Details
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography>Quantity:</Typography>
                <Typography>1 person</Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                marginTop={2}
                borderBottom="1px solid #e0e0e0"
                paddingBottom={3}
              >
                <Typography>Registration Fee:</Typography>
                <Typography>{event.price.toLocaleString()} VNĐ</Typography>
              </Box>
              <Typography
                className="mb-2"
                variant="h6"
                marginTop={2}
                style={{ color: "black" }}
              >
                Confirmation Method
              </Typography>
              <RadioGroup
                name="paymentMethod"
                onChange={handleChange}
                sx={{
                  marginBottom: "25px",
                  borderBottom: "1px solid #e0e0e0",
                  paddingBottom: "20px",
                }}
              >
                <FormControlLabel
                  value="VnPay"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <img
                        className="me-2"
                        width="30px"
                        style={{ height: "25px" }}
                        src="https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logos/cong-ty-cp-giai-phap-thanh-toan-viet-nam-vnpay-6194ba1fa3d66.jpg"
                        alt="VNPay logo"
                      />
                      VNPay
                    </Box>
                  }
                  style={{ color: "black", marginBottom: "25px" }}
                />
                <FormControlLabel
                  value="PayOS"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <img
                        className="me-2"
                        width="30px"
                        style={{ height: "25px" }}
                        src="https://payos.vn/docs/img/logo.svg"
                        alt="PayOS logo"
                      />
                      PayOS
                    </Box>
                  }
                  style={{ color: "black" }}
                />
              </RadioGroup>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                sx={{
                  background: "linear-gradient(to right, #136CB5, #49BBBD)",
                  "&:hover": {
                    background: "linear-gradient(to right, #0d4f8f, #3a9a9c)",
                  },
                }}
              >
                Confirm Registration
              </Button>
            </FormContainer>
          </Grid2>
        </Grid2>
      </Container>
    </BackgroundWrapper>
  );
};

export default EventPaymentConfirmation;
