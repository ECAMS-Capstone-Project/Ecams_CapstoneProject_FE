import React, { useState } from 'react';
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
    CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { formatPrice } from '@/lib/FormatPrice';
import { exchangePackage } from '@/api/representative/PaymentAPI';
import { StatusCodeEnum } from '@/lib/statusCodeEnum';

const BackgroundWrapper = styled(Box)({
    minHeight: '100vh',
    width: '100%',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/public/image/test2.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
});

const TopBar = styled(Box)({
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

const BackButton = styled(Button)({
    backgroundColor: '#0288d1',
    color: 'white',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#0277bd',
    },
});

const EventCard = styled(Card)({
    backgroundColor: '#0288d1',
    color: 'white',
    marginBottom: '20px',
    display: 'flex',
    padding: '16px',
    gap: '16px',
    justifyContent: 'space-between',
});

const FormContainer = styled(Card)({
    width: '100%',
    margin: '0 auto',
    marginTop: '20px',
    padding: '24px',
});

const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const ExtendCheckOut: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();
    const { selectedPlan } = location.state || {};
    const [userCaptchaInput, setUserCaptchaInput] = useState<string>("");
    const [captchaCode, setCaptchaCode] = useState(generateRandomCode());
    const [methodPayment, setMethodPayment] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMethodPayment(event.target.value);
    };

    const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCaptchaInput(e.target.value);
    };
    const handleSubmit = async () => {
        toast.dismiss()
        if (userCaptchaInput !== captchaCode) {
            toast.error("Captcha code does not match. Try again!");
            setCaptchaCode(generateRandomCode());
            setUserCaptchaInput("");
            return;
        }
        if (methodPayment == "" || methodPayment == undefined) {
            toast.error("Please choose payment method");
            return;
        }
        if (user && selectedPlan) {
            setIsLoading(true);
            try {
                const formData = new FormData();
                formData.append("PackageId", selectedPlan.packageId);
                formData.append("PaymentMethodId", "59b3cf1a-4ed7-469a-a551-5196755a12ad");
                formData.append("RepresentativeId", user.representativeId);

                const response = await exchangePackage(formData);

                if (response.statusCode == StatusCodeEnum.CREATED && response.data) {
                    toast.success("Payment successful");
                    if (methodPayment == "VnPay") {
                        // For VNPAY: redirect using the data directly
                        if (typeof response.data === 'string') {
                            window.location.replace(response.data);
                        } else {
                            toast.error("Invalid response data");
                        }
                    } else if (methodPayment == "PayOS") {
                        // For PAYOS: redirect using the checkoutUrl
                        if (typeof response.data !== 'string' && response.data.checkoutUrl) {
                            window.location.replace(response.data.checkoutUrl);
                        } else {
                            toast.error("Invalid response data");
                        }
                    }
                } else {
                    toast.error("Payment failed");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };
    return (
        <BackgroundWrapper>
            <TopBar style={{ backgroundColor: '#FFF', marginBottom: "20px" }}>
                <BackButton
                    startIcon={<ArrowBackIcon />}
                    sx={{ background: 'linear-gradient(to right, #136CB5, #49BBBD)' }}
                    variant="contained"
                    onClick={() => window.history.back()}
                >
                    Back
                </BackButton>
                <IconButton>
                    <AccountCircleIcon />
                </IconButton>
            </TopBar>

            <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: "80px", marginBottom: "20px" }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ color: 'white', textAlign: 'center', mb: 2 }}
                >
                    Confirm your payment
                </Typography>
                <Grid2 container spacing={2} sx={{ background: "white" }}>
                    <Grid2 size={{ md: 6, xs: 12 }}>
                        <FormContainer>
                            <EventCard>
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        {selectedPlan?.packageName}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom mb={1}>
                                        <b>Quantity:</b> 1 package
                                    </Typography>
                                    <Typography variant="body2" gutterBottom mb={1}>
                                        <b>Duration:</b> {selectedPlan?.duration} month
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <b>Total:</b> {formatPrice(selectedPlan?.price)}
                                    </Typography>
                                </Box>
                                <div>
                                    <Box
                                        component="img"
                                        src="/public/image/memberShip.png"
                                        alt="Event"
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            objectFit: 'cover',
                                            borderRadius: 1,
                                        }}
                                    />
                                </div>
                            </EventCard>

                            <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2, paddingBottom: 3, boxShadow: "none" } }}>
                                <Grid2 container justifyContent="space-between" alignItems="center" sx={{ height: "50px" }}>
                                    <Grid2 size={{ sm: 5 }}>
                                        <Typography variant="body1">Name:</Typography>
                                    </Grid2>
                                    <Grid2 size={{ sm: 6 }}>
                                        <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                            {user?.fullname}
                                        </Typography>
                                    </Grid2>
                                </Grid2>
                                <Grid2 container justifyContent="space-between" alignItems="center" sx={{ height: "50px" }}>
                                    <Grid2 size={{ sm: 5 }}>
                                        <Typography variant="body1">University:</Typography>
                                    </Grid2>
                                    <Grid2 size={{ sm: 6 }}>
                                        <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                            {user?.universityName}
                                        </Typography>
                                    </Grid2>
                                </Grid2>
                                <Grid2 container justifyContent="space-between" alignItems="center" sx={{ height: "50px" }}>
                                    <Grid2 size={{ sm: 5 }}>
                                        <Typography variant="body1">Email</Typography>
                                    </Grid2>
                                    <Grid2 size={{ sm: 6 }}>
                                        <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                            {user?.email}
                                        </Typography>
                                    </Grid2>
                                </Grid2>
                                <Grid2 container justifyContent="space-between" alignItems="center" sx={{ height: "50px" }}>
                                    <Grid2 size={{ sm: 5 }}>
                                        <Typography variant="body1">Phone Number:</Typography>
                                    </Grid2>
                                    <Grid2 size={{ sm: 6 }}>
                                        <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                            {user?.phonenumber}
                                        </Typography>
                                    </Grid2>
                                </Grid2>
                                <Grid2 container justifyContent="space-between" alignItems="center" mt={5} mb={3}>
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
                                            label="Mã CAPTCHA"
                                            variant="outlined"
                                            onChange={handleCaptchaChange}
                                            value={userCaptchaInput}
                                        />
                                    </Grid2>
                                </Grid2>
                            </Box>
                        </FormContainer>
                    </Grid2>
                    <Grid2 size={{ md: 6, xs: 12 }} >
                        <FormContainer>
                            <Typography
                                variant="h6"
                                style={{ color: "black", marginBottom: "15px" }}
                            >
                                Cart Total
                            </Typography>
                            <Box display="flex" justifyContent="space-between">
                                <Typography>Quantity: </Typography>
                                <Typography>1 package</Typography>
                            </Box>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                marginTop={2}
                                borderBottom="1px solid #e0e0e0"
                                paddingBottom={3}
                            >
                                <Typography>Total (include VAT):</Typography>
                                <Typography>
                                    {formatPrice(selectedPlan?.price)}
                                </Typography>
                            </Box>
                            <Typography
                                className="mb-2"
                                variant="h6"
                                marginTop={2}
                                style={{ color: "black" }}
                            >
                                Payment Method
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
                                disabled={isLoading}
                                onClick={handleSubmit}
                                fullWidth
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
                            </Button>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid black",
                                    height: "35px",
                                    marginTop: "25px",
                                    borderRadius: "4px",
                                }}
                            >
                                <img
                                    className="me-2"
                                    width="90px"
                                    style={{ height: "25px" }}
                                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png"
                                    alt="PayPal acceptance mark"
                                />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid black",
                                    height: "35px",
                                    marginTop: "25px",
                                    borderRadius: "4px",
                                }}
                            >
                                <img
                                    className="me-2"
                                    width="90px"
                                    style={{ height: "24px" }}
                                    src="https://payos.vn/docs/img/logo.svg"
                                    alt="PayPal acceptance mark"
                                />
                            </div>
                        </FormContainer>
                    </Grid2>
                </Grid2>
            </Container>
        </BackgroundWrapper>
    );
};

export default ExtendCheckOut;