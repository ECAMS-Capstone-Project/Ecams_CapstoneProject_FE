/* eslint-disable @typescript-eslint/no-unused-vars */
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
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Place } from "@mui/icons-material";
import { usePaymentEvent } from "@/hooks/student/useEventRegister";

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

const EventPaymentConfirmation: React.FC = () => {
  // const navigate = useNavigate();
  const location = useLocation();
  const { event, userInfo } = location.state || {};
  const [confirmationMethod, setConfirmationMethod] = useState<string>("");

  // Hook sử dụng để gọi API paymentEvent
  const { mutate: paymentEvent } = usePaymentEvent(); // Lấy hàm mutate từ usePaymentEvent hook

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationMethod(event.target.value);
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    if (!confirmationMethod) {
      toast.error("Please select a payment method");
      return;
    }

    try {
      // Gọi API paymentEvent thông qua mutate
      await paymentEvent(
        {
          studentId: userInfo.userId,
          eventId: event.eventId,
          paymentMethodId: confirmationMethod,
        },
        {
          onSuccess: (response) => {
            if (
              response &&
              response.data &&
              typeof response.data === "string"
            ) {
              toast.success("Event registration successful!");

              window.location.replace(response.data);
            } else {
              console.error("Payment failed. Please try again.");
            }
          },
        }
      );
    } catch (error) {
      toast.error("An error occurred while processing the payment.");
    }
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

        {/* Event Information */}
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
                      {userInfo.fullname}
                    </Typography>
                  </Grid2>
                </Grid2>
                {/* Other user info fields */}
              </Box>
            </FormContainer>
          </Grid2>

          {/* Payment Method */}
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
                  value="59b3cf1a-4ed7-469a-a551-5196755a12ad"
                  control={<Radio />}
                  label="VNPay"
                />
                <FormControlLabel
                  value="59b3cf1a-4ed7-469a-a551-5196755a12bb"
                  control={<Radio />}
                  label="PayOS"
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
