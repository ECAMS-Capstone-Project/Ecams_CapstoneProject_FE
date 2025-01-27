import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Typography,
    Stack,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';

interface PricingPlan {
    title: string;
    price: number;
    description: string;
    features: string[];
    isPopular?: boolean;
}

const StyledCard = styled(Card)<{ isPopular?: boolean }>(({ isPopular }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: isPopular ? '#231D4F' : '#f3eae9',
    color: isPopular ? '#fff' : 'inherit',
    transform: isPopular ? 'scale(1.05)' : 'scale(1)',
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
});

const SliderContainer = styled(Box)({
    position: 'relative',
    width: '100%',
    padding: '0 60px',
});

const BackButton = styled(Button)({
    backgroundColor: '#B666D2',
    borderRadius: "20px",
    width: "100px",
    color: 'white',
    textTransform: 'none',
    padding: '6px 16px',
    '&:hover': {
        backgroundColor: '#9b4bbd',
    },
});

const Pricing: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const pricingPlans: PricingPlan[] = [
        {
            title: 'Starter',
            price: 19,
            description: 'Unleash the power of automation',
            features: [
                'Multi-step Zaps',
                '3 Premium Apps',
                '2 Users team',
            ],
        },
        {
            title: 'Professional',
            price: 54,
            description: 'Advanced tools to take your work to the next level',
            features: [
                'Multi-step Zaps',
                'Unlimited Premium',
                '50 Users team',
                'Shared Workspace',
            ],
        },
        {
            title: 'Company',
            price: 89,
            description: 'Automation plus enterprise-grade features',
            features: [
                'Multi-step Zaps',
                'Unlimited Premium',
                'Unlimited Users Team',
                'Advanced Admin',
                'Custom Data Retention',
            ],
            isPopular: true,
        },
        {
            title: 'Enterprise',
            price: 149,
            description: 'Custom solutions for large organizations',
            features: [
                'All Company features',
                'Custom Integration',
                'Dedicated Support',
                'SLA Guarantee',
                'Custom Training',
                'Advanced Security',
            ],
        },
    ];

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? pricingPlans.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === pricingPlans.length - 1 ? 0 : prev + 1));
    };

    const visiblePlans = () => {
        const plans = [];
        for (let i = 0; i < 3; i++) {
            const index = (currentIndex + i) % pricingPlans.length;
            plans.push(pricingPlans[index]);
        }
        return plans;
    };

    return (
        <GradientBackground>
            <Container maxWidth="lg">
                <Box textAlign="center" pt={2} mb={8} display="flex" alignItems="center" justifyContent="space-between">
                    <IconButton
                        edge="start"
                        color="primary"
                        aria-label="menu"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography textAlign={'left'} variant="h5" component="h1" gutterBottom color="primary">
                        ECAMS
                    </Typography>
                    <BackButton variant="contained">
                        Back
                    </BackButton>
                </Box>
                <SliderContainer>
                    <Box textAlign="center" mb={8}>
                        <Typography textAlign={'left'} variant="h3" component="h1" gutterBottom color="#231D4F">
                            Plans & Pricing
                        </Typography>
                        <Typography textAlign={'left'} variant="h6" color="#848199">
                            Whether your time-saving automation needs are large or small,
                            we're here to help you scale.
                        </Typography>
                    </Box>
                    <SliderArrow
                        onClick={handlePrevious}
                        sx={{ left: 0 }}
                        aria-label="previous plan"
                    >
                        <ArrowBackIcon />
                    </SliderArrow>

                    <SliderArrow
                        onClick={handleNext}
                        sx={{ right: 0 }}
                        aria-label="next plan"
                    >
                        <ArrowForwardIcon />
                    </SliderArrow>

                    <AnimatePresence mode="wait">
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={4}
                            justifyContent="center"
                            alignItems="stretch"
                            sx={{ padding: "35px", borderRadius: "20px", background: "#f7eeed" }}
                        >
                            {visiblePlans().map((plan, index) => (
                                <motion.div
                                    key={`${plan.title}-${index}`}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ flex: 1 }}
                                >
                                    <StyledCard isPopular={plan.isPopular}>
                                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                            {plan.isPopular && (
                                                <Chip
                                                    label="MOST POPULAR"
                                                    color="secondary"
                                                    size="small"
                                                    sx={{ alignSelf: 'flex-end', mb: 2 }}
                                                />
                                            )}
                                            <Typography color={plan.isPopular ? '#FFF' : '#231D4F'} variant="h4" component="h2" gutterBottom>
                                                ${plan.price}
                                                <Typography variant="subtitle1" component="span">
                                                    /month
                                                </Typography>
                                            </Typography>
                                            <Typography color={plan.isPopular ? '#FFF' : '#231D4F'} variant="h5" gutterBottom>
                                                {plan.title}
                                            </Typography>
                                            <Typography color={plan.isPopular ? '#FFF' : '#848199'} variant="body1">
                                                {plan.description}
                                            </Typography>
                                            <List sx={{ flexGrow: 1 }}>
                                                {plan.features.map((feature) => (
                                                    <ListItem key={feature} sx={{ padding: '4px 0' }}>
                                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                                            <CheckIcon sx={{ color: plan.isPopular ? '#FFFFFF' : '#BB6BD9' }} />
                                                        </ListItemIcon>
                                                        <ListItemText sx={{ color: plan.isPopular ? '#FFFFFF' : '#848199' }} primary={feature} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                            <StyledButton
                                                variant="contained"
                                                fullWidth
                                                isPopular={plan.isPopular}
                                            >
                                                Choose plan
                                            </StyledButton>
                                        </CardContent>
                                    </StyledCard>
                                </motion.div>
                            ))}
                        </Stack>
                    </AnimatePresence>
                </SliderContainer>
            </Container>
        </GradientBackground>
    );
};

export default Pricing;