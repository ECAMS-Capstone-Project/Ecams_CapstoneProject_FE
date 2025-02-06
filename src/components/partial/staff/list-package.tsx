import React, { useState, useEffect } from 'react';
import {
    Box, Button, Card, CardContent, Container, Typography, Stack, List,
    ListItem, ListItemIcon, ListItemText, IconButton, CircularProgress, Alert,
    Chip
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PackageList3 } from '@/api/agent/PackageAgent';
import { Package } from '@/models/Package';
import { formatPrice } from '@/lib/FormatPrice';

// Styled components
const StyledCard = styled(Card)<{ isPopular?: boolean }>(({ isPopular }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: isPopular ? '#231D4F' : '#f3eae9',
    color: isPopular ? '#fff' : 'inherit',
    transform: isPopular ? 'scale(1.05)' : 'scale(1)',
    borderRadius: "20px",
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: isPopular ? 'scale(1.07)' : 'scale(1.02)',
    },
}));

const StyledButton = styled(Button)<{ isPopular?: boolean }>(({ theme, isPopular }) => ({
    marginTop: 'auto',
    backgroundColor: isPopular ? '#BB6BD9' : '#979797',
    textTransform: 'none',
    fontSize: "16px",
    borderRadius: "20px",
    color: '#fff',
    '&:hover': {
        backgroundColor: theme.palette.primary.light,
    },
}));

const SliderArrow = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: '60%',
    transform: 'translateY(-50%)',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
    zIndex: 1,
}));

const GradientBackground = styled(Box)({
    background: 'linear-gradient(180deg, #f5f5f5 0%, #e0e7ff 100%)',
    minHeight: '99vh',
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: "20px"
});

const SliderContainer = styled(Box)({
    position: 'relative',
    width: '100%',
    padding: '0 60px',
});

const Pricing: React.FC = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [popularIndex, setPopularIndex] = useState<number | null>(null);

    useEffect(() => {
        const loadPackage = async () => {
            try {
                const packageData = await PackageList3(100, 1);
                const packageList = packageData.data?.data || [];
                setPackages(packageList);

                if (packageList.length > 0) {
                    // Chọn random một gói làm Popular
                    const randomIndex = Math.floor(Math.random() * packageList.length);
                    setPopularIndex(randomIndex);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        loadPackage();
    }, []);


    const handleClick = (plan: Package) => {
        navigate('/payment-confirm', {
            state: { selectedPlan: plan }
        });
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? packages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === packages.length - 1 ? 0 : prev + 1));
    };

    const visiblePlans = () => {
        if (packages.length === 0) return [];
        return Array.from({ length: 3 }, (_, i) => packages[(currentIndex + i) % packages.length]);
    };

    return (
        <GradientBackground>
            <Container maxWidth="lg">
                <Box textAlign="center" pt={2} mb={8}>
                    <Typography variant="h3" component="h1" gutterBottom color="#231D4F">
                        Plans & Pricing
                    </Typography>
                    <Typography variant="h6" color="#848199">
                        Whether your automation needs are large or small, we're here to help you scale.
                    </Typography>
                </Box>

                {loading && <CircularProgress />}
                {error && <Alert severity="error">{error}</Alert>}

                {!loading && !error && packages.length > 0 && (
                    <SliderContainer>
                        <SliderArrow onClick={handlePrevious} sx={{ left: 0 }} aria-label="previous plan">
                            <ArrowBackIcon />
                        </SliderArrow>

                        <SliderArrow onClick={handleNext} sx={{ right: 0 }} aria-label="next plan">
                            <ArrowForwardIcon />
                        </SliderArrow>

                        <AnimatePresence mode="wait">
                            <Stack
                                direction={{ xs: 'column', md: 'row' }}
                                spacing={4}
                                justifyContent="center"
                                alignItems="stretch"
                                sx={{ padding: "35px", borderRadius: "20px", background: "#fff" }}
                            >
                                {visiblePlans().map((plan, index) => {
                                    const isPopular = packages.indexOf(plan) === popularIndex;

                                    return (
                                        <motion.div
                                            key={`${plan.packageName}-${index}`}
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ duration: 0.5 }}
                                            style={{ flex: 1 }}
                                        >
                                            <StyledCard isPopular={isPopular}>
                                                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                    {isPopular && (
                                                        <Chip
                                                            label="MOST POPULAR"
                                                            color="secondary"
                                                            size="small"
                                                            sx={{ alignSelf: 'flex-end', mb: 2 }}
                                                        />
                                                    )}
                                                    <Typography variant="h6" fontWeight={'600'} component="h2" gutterBottom>
                                                        {formatPrice(plan.price)}
                                                        <Typography variant="subtitle1" component="span">
                                                            / {plan.duration} months
                                                        </Typography>
                                                    </Typography>
                                                    <Typography variant="h5" gutterBottom>
                                                        {plan.packageName}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {plan.description}
                                                    </Typography>
                                                    <List sx={{ flexGrow: 1 }}>
                                                        {plan.packageDetails.map((detail, i) => (
                                                            <ListItem key={detail.packageType + '-' + i} sx={{ padding: '4px 0' }}>
                                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                                    <CheckIcon sx={{ color: '#BB6BD9' }} />
                                                                </ListItemIcon>
                                                                <ListItemText primary={`${detail.packageType}: ${detail.value}`} />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                    <StyledButton onClick={() => handleClick(plan)} isPopular={isPopular} variant="contained" fullWidth>
                                                        Choose plan
                                                    </StyledButton>
                                                </CardContent>
                                            </StyledCard>
                                        </motion.div>
                                    );
                                })}
                            </Stack>
                        </AnimatePresence>
                    </SliderContainer>
                )}
                <div className='flex w-full justify-center'>
                    <Button
                        type="submit"
                        onClick={() => navigate('/staff/dashboard')}
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
                        Back To Home Page
                    </Button>
                </div>
            </Container>
        </GradientBackground>
    );
};

export default Pricing;
