/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PackageList3 } from "@/api/agent/PackageAgent";
import { Package } from "@/models/Package";
import { formatPrice } from "@/lib/FormatPrice";
import { CheckBuyPackageAPI } from "@/api/representative/PaymentAPI";
import useAuth from "@/hooks/useAuth";

// Styled components
const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "isPopular",
})<{ isPopular?: boolean }>(({ isPopular }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: isPopular ? "#231D4F" : "#f3eae9",
  color: isPopular ? "#fff" : "inherit",
  transform: isPopular ? "scale(1.05)" : "scale(1)",
  borderRadius: "20px",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: isPopular ? "scale(1.07)" : "scale(1.02)",
  },
}));

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isPopular",
})<{ isPopular?: boolean }>(({ theme, isPopular }) => ({
  marginTop: "auto",
  backgroundColor: isPopular ? "#BB6BD9" : "#979797",
  textTransform: "none",
  fontSize: "16px",
  borderRadius: "20px",
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

const GradientBackground = styled(Box)({
  background: "linear-gradient(180deg, #f5f5f5 0%, #e0e7ff 100%)",
  minHeight: "99vh",
  position: "relative",
  overflow: "hidden",
  paddingTop: "50px",
  paddingBottom: "20px",
});

const SliderContainer = styled(Box)({
  position: "relative",
  width: "100%",
  padding: "0 60px",
});

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [popularIndex, setPopularIndex] = useState<number | null>(null);
  const { user } = useAuth();

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
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadPackage();
  }, []);

  const handleClick = async (plan: Package) => {
    if (user) {
      const response = await CheckBuyPackageAPI({
        packageId: plan.packageId,
        representativeId: user.universityId || "",
      });
      console.log(response);
      navigate("/payment-confirm", {
        state: { selectedPlan: plan },
      });
    }
  };

  // Cấu hình react-slick sử dụng các nút chuyển mặc định
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    // Không truyền custom prevArrow/nextArrow để dùng nút mặc định của slick
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <GradientBackground>
      <Container maxWidth="lg">
        <Box textAlign="center" pt={4} mb={10}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={800}
            gutterBottom
            sx={{
              background: "linear-gradient(to right, #136CB5, #49BBBD)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Choose Your Plan
          </Typography>

          <Typography variant="h6" color="#6C6A8A" maxWidth={600} mx="auto">
            Flexible pricing to match your needs. Pick a plan that fits your
            goals and start unlocking premium features today.
          </Typography>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && packages.length > 0 && (
          <SliderContainer>
            <Slider {...settings}>
              {packages
                .filter((pkg) => pkg.status == true)
                .map((plan, index) => {
                  const isPopular = index === popularIndex;
                  return (
                    <Box key={`${plan.packageName}-${index}`} p={2}>
                      <StyledCard isPopular={isPopular}>
                        <CardContent
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {isPopular && (
                            <Chip
                              label="MOST POPULAR"
                              color="secondary"
                              size="small"
                              sx={{ alignSelf: "flex-end", mb: 2 }}
                            />
                          )}
                          <Typography
                            variant="h6"
                            fontWeight={"600"}
                            component="h2"
                            gutterBottom
                          >
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
                              <ListItem
                                key={detail.packageType + "-" + i}
                                sx={{ padding: "4px 0" }}
                              >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  <CheckIcon sx={{ color: "#BB6BD9" }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={`${detail.packageType}: ${detail.value}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                          <StyledButton
                            onClick={() => handleClick(plan)}
                            isPopular={isPopular}
                            variant="contained"
                            fullWidth
                          >
                            Choose plan
                          </StyledButton>
                        </CardContent>
                      </StyledCard>
                    </Box>
                  );
                })}
            </Slider>
          </SliderContainer>
        )}
        <Box display="flex" justifyContent="center">
          <Button
            onClick={() => navigate("/representative")}
            variant="contained"
            color="primary"
            sx={{
              mt: 4,
              background: "linear-gradient(to right, #136CB5, #49BBBD)",
              textTransform: "none",
              fontWeight: "bold",
              width: 250,
            }}
          >
            Back To Home Page
          </Button>
        </Box>
      </Container>
    </GradientBackground>
  );
};

export default Pricing;
