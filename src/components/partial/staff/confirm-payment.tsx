import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    Container,
    Typography,
    IconButton,
    styled,
    Grid2,
    TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

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

const ConfirmButton = styled(Button)({
    backgroundColor: 'linear-gradient(to right, #136CB5, #49BBBD)',
    fontWeight: "bold",
    fontSize: '15px',
    '&:hover': {
        backgroundColor: '#0277bd',
    },
});

const CancelButton = styled(Button)({
    fontSize: '15px',
    fontWeight: "bold",
    color: '#d32f2f',
});

const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const PaymentConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedPlan } = location.state || {};
    console.log(selectedPlan);
    const [userCaptchaInput, setUserCaptchaInput] = useState<string>("");
    const [captchaCode, setCaptchaCode] = useState(generateRandomCode());

    const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCaptchaInput(e.target.value);
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.dismiss()
        if (userCaptchaInput !== captchaCode) {
            toast.error("Mã Captcha không được trùng khớp. Hãy thử lại!");
            setCaptchaCode(generateRandomCode());
            setUserCaptchaInput("");
            return;
        }
        navigate('/package-contract')
        // const formBuyCoin = {
        //   userId: user?.id,
        //   paymentMethod: methodPayment,
        //   memberShipId: memberShipBuy?.memberShipId,
        // };
        // try {
        //   const response = await CreatePayment(formBuyCoin);
        //   if (response.status == StatusCode.CREATED) {
        //     const responseData = await response.json();
        //     if (responseData.statusCode == StatusCode.CREATED && methodPayment == "PAYOS") {
        //       window.location.replace(responseData.metaData.checkoutUrl);
        //     }else if (responseData.statusCode == StatusCode.CREATED && methodPayment == "Vnpay"){
        //       window.location.replace(responseData.metaData);
        //     } else {
        //       toast.error(responseData.message);
        //     }
        //   } else {
        //     toast.error("Bạn hiện đang sở hữu một gói trong tài khoản");
        //   }
        // } catch (error) {
        //   console.log("Network error" + error);
        // }
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

            <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: "80px", marginBottom: "20px" }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ color: 'white', textAlign: 'center', mb: 2 }}
                >
                    Confirm your payment
                </Typography>

                <FormContainer>
                    <EventCard>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Premium Plus Package
                            </Typography>
                            <Typography variant="body2" gutterBottom mb={1}>
                                <b>Quantity:</b> 1 package
                            </Typography>
                            <Typography variant="body2" gutterBottom mb={1}>
                                <b>Duration:</b> 1 month
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                <b>Total:</b> 15.00$
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

                    <Box onSubmit={handleSubmit} component="form" sx={{ '& .MuiTextField-root': { mb: 2, paddingBottom: 3 } }}>
                        <Grid2 container justifyContent="space-between" alignItems="center" sx={{ height: "50px" }}>
                            <Grid2 size={{ sm: 5 }}>
                                <Typography variant="body1">Name:</Typography>
                            </Grid2>
                            <Grid2 size={{ sm: 5 }}>
                                <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                    Thanh Van
                                </Typography>
                            </Grid2>
                        </Grid2>
                        <Grid2 container justifyContent="space-between" alignItems="center" sx={{ height: "50px" }}>
                            <Grid2 size={{ sm: 5 }}>
                                <Typography variant="body1">University:</Typography>
                            </Grid2>
                            <Grid2 size={{ sm: 5 }}>
                                <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                    FPT University
                                </Typography>
                            </Grid2>
                        </Grid2>
                        <Grid2 container justifyContent="space-between" alignItems="center" sx={{ height: "50px" }}>
                            <Grid2 size={{ sm: 5 }}>
                                <Typography variant="body1">Email</Typography>
                            </Grid2>
                            <Grid2 size={{ sm: 5 }}>
                                <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                    contact@gmail.com
                                </Typography>
                            </Grid2>
                        </Grid2>
                        <Grid2 container justifyContent="space-between" alignItems="center" sx={{ height: "50px" }}>
                            <Grid2 size={{ sm: 5 }}>
                                <Typography variant="body1">Phone Number:</Typography>
                            </Grid2>
                            <Grid2 size={{ sm: 5 }}>
                                <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                    0922998321
                                </Typography>
                            </Grid2>
                        </Grid2>
                        <Grid2 container justifyContent="space-between" alignItems="center" mt={1} mb={3}>
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
                        <Grid2 container justifyContent="space-between" alignItems="center">
                            <Grid2 size={{ sm: 5 }}>
                                <CancelButton
                                    fullWidth
                                    variant="text"
                                    sx={{ color: "#842029", textTransform: "none" }}
                                    startIcon={<HighlightOffIcon />}
                                >
                                    Cancel
                                </CancelButton>
                            </Grid2>
                            <Grid2 size={{ sm: 5 }}>
                                <ConfirmButton
                                    type='submit'
                                    fullWidth
                                    sx={{ background: 'linear-gradient(to right, #136CB5, #49BBBD)', textTransform: "none", color: "white" }}
                                    startIcon={<CheckCircleOutlineIcon />}
                                >
                                    Confirm
                                </ConfirmButton>
                            </Grid2>
                        </Grid2>
                        {/* <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 1 }}>
                            <CancelButton
                                fullWidth
                                variant="text"
                                sx={{ color: "#842029", textTransform: "none" }}
                                startIcon={<HighlightOffIcon />}
                            >
                                Cancel
                            </CancelButton>
                            <ConfirmButton
                                type='submit'
                                fullWidth
                                sx={{ background: 'linear-gradient(to right, #136CB5, #49BBBD)', textTransform: "none", color: "white" }}
                                startIcon={<CheckCircleOutlineIcon />}
                            >
                                Confirm
                            </ConfirmButton>
                        </Box> */}
                    </Box>
                </FormContainer>
            </Container>
        </BackgroundWrapper>
    );
};

export default PaymentConfirmation;