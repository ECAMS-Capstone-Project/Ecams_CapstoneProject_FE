import React from 'react';
import {
    Box,
    Button,
    Card,
    Container,
    TextField,
    Typography,
    IconButton,
    styled,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const BackgroundWrapper = styled(Box)({
    minHeight: '100vh',
    width: '100%',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/crowd-background.jpg')`,
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
});

const FormContainer = styled(Card)({
    maxWidth: 500,
    margin: '0 auto',
    marginTop: '20px',
    padding: '24px',
});

const ConfirmButton = styled(Button)({
    backgroundColor: '#0288d1',
    '&:hover': {
        backgroundColor: '#0277bd',
    },
});

const CancelButton = styled(Button)({
    color: '#d32f2f',
});

const PaymentConfirmation: React.FC = () => {
    return (
        <BackgroundWrapper>
            <TopBar style={{ backgroundColor: '#FFF', marginBottom: "20px" }}>
                <BackButton
                    startIcon={<ArrowBackIcon />}
                    variant="contained"
                    size="small"
                >
                    Back
                </BackButton>
                <IconButton>
                    <AccountCircleIcon />
                </IconButton>
            </TopBar>

            <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{ color: 'white', textAlign: 'center', mb: 3 }}
                >
                    Confirm your payment
                </Typography>

                <FormContainer>
                    <EventCard>
                        <Box
                            component="img"
                            src="/event-image.jpg"
                            alt="Event"
                            sx={{
                                width: 100,
                                height: 100,
                                objectFit: 'cover',
                                borderRadius: 1,
                            }}
                        />
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                BestSeller Book BootCamp - write, Market & Publish Your Book -Lucknow
                            </Typography>
                            <Typography variant="body2">
                                Saturday, March 6, 5:30PM
                            </Typography>
                            <Typography variant="body2">
                                FPT University
                            </Typography>
                        </Box>
                    </EventCard>

                    <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
                        <TextField
                            fullWidth
                            label="Name"
                            defaultValue="Thanh Van"
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="University"
                            defaultValue="FPT University"
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            defaultValue="contact@gmail.com"
                            variant="outlined"
                            type="email"
                        />
                        <TextField
                            fullWidth
                            label="Phone Number"
                            defaultValue="0123456789"
                            variant="outlined"
                        />

                        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                            <CancelButton
                                fullWidth
                                variant="text"
                            >
                                Cancel
                            </CancelButton>
                            <ConfirmButton
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Confirm
                            </ConfirmButton>
                        </Box>
                    </Box>
                </FormContainer>
            </Container>
        </BackgroundWrapper>
    );
};

export default PaymentConfirmation;