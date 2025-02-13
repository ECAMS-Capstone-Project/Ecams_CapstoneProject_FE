import { Avatar, Button, Card, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PackageCurrent, PackageList3 } from "@/api/agent/PackageAgent";
import { Package } from "@/models/Package";
import { formatPrice } from "@/lib/FormatPrice";
import ContractStaffPage from "@/pages/staff/contract/ContractStaffPage";
import useAuth from "@/hooks/useAuth";
import { CheckBuyPackageAPI } from "@/api/staff/PaymentAPI";
import { useNavigate } from "react-router-dom";

const WalletStaff = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [curPackage, setCurPackage] = useState<Package>();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  console.log(loading);
  useEffect(() => {
    const loadPackage = async () => {
      try {
        const packageData = await PackageList3(100, 1);
        const packageList = packageData.data?.data || [];
        setPackages(packageList);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    const loadCurrentPackage = async () => {
      if (user) {
        try {
          const contractData = await PackageCurrent(user.staffId);
          const packageList = contractData.data;
          setCurPackage(packageList);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.log(error.message);
        } finally {
          setLoading(false);
        }
      }
    };
    loadPackage();
    loadCurrentPackage();
  }, [user]);

  const handleClick = async (plan: Package) => {
    if (user) {
      const response = await CheckBuyPackageAPI({
        packageId: plan.packageId,
        staffId: user.staffId,
      });
      console.log(response);

      navigate("/payment-confirm", {
        state: { selectedPlan: plan },
      });
    }
  };

  return (
    <Container maxWidth="xl" className="p-6 rounded-lg shadow-lg">
      {/* Header */}
      <Typography
        variant="h5"
        className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] bg-clip-text text-transparent font-bold text-center mb-4  "
      >
        👤 My Contract
      </Typography>

      {/* Thông tin user */}
      <Card className="p-4 flex items-center space-x-4 shadow-lg mt-3">
        <Avatar
          src={user?.avatar || "./public/image/appLogo.png"}
          alt="User Avatar"
          sx={{ width: 60, height: 60 }}
        />
        <div>
          <Typography className="text-lg" fontWeight={"600"}>
            {user?.fullname}
          </Typography>
          <Typography color="textSecondary" mt={1}>
            <b>Package:</b> {curPackage?.packageName || "No package yet"}{" "}
          </Typography>
          <Typography color="textSecondary" mt={1}>
            📅 Duration: {curPackage?.duration} months
          </Typography>
          {/* <Typography color="textSecondary" mt={1}>📅 To: {" "} {curPackage?.}</Typography> */}
        </div>
      </Card>

      {/* Lịch sử đăng ký */}
      <Card className="p-4 mt-6 shadow-lg">
        <Typography className="font-bold mb-3 text-blue-500" mb={2}>
          📜 Registration History
        </Typography>
        <ContractStaffPage />
      </Card>

      {/* Gói đề xuất */}
      <Card className="p-4 mt-6 shadow-xl">
        <Typography className="font-bold mb-3 text-blue-500" mb={2}>
          📦 Recommend Package
        </Typography>

        {/* Khung scrollable */}
        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto overflow-x-hidden p-2">
          {packages &&
            packages.map((pkg, index) => (
              <motion.div
                key={index + 1}
                className="p-4 border rounded-lg shadow-lg bg-white hover:bg-blue-100 transition-all"
                whileHover={{ scale: 1.01 }}
              >
                <Typography className="font-bold text-lg" mb={1}>
                  Package Name: {pkg.packageName}
                </Typography>
                <Typography color="primary" mb={1}>
                  Duration: {pkg.duration} months
                </Typography>
                <Typography className="mt-1 text-sm text-gray-500">
                  Total 💰: {formatPrice(pkg.price)}{" "}
                </Typography>
                <div className="w-full flex justify-center align-middle">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleClick(pkg)}
                    sx={{
                      mt: 2,
                      justifyContent: "center",
                      textTransform: "none",
                      background: "linear-gradient(to right, #136CB5, #49BBBD)",
                      width: "40%",
                    }}
                  >
                    Buy now
                  </Button>
                </div>
              </motion.div>
            ))}
        </div>
      </Card>
    </Container>
  );
};

export default WalletStaff;
