/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, Container, Typography, Divider, Grid2 } from "@mui/material";
import { Button } from "@mui/material";  // Dùng Button từ MUI
import { PackageCurrent } from "@/api/agent/PackageAgent";
import { Package } from "@/models/Package";
import ContractRepresentativePage from "@/pages/representative/contract/ContractRepresentativePage";
import useAuth from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CircleAlertIcon } from "lucide-react";
import { GetContractCurrentAPI } from "@/api/representative/ContractAPI";
import { Contract } from "@/models/Contract";
import ConfirmDialog from "./confirmDialog";
import ConfirmCancelDialog from "./confirmCancel";
import DialogLoading from "@/components/ui/dialog-loading";
import { formatPrice } from "@/lib/FormatPrice";

const WalletRepresentative = () => {
  const { user } = useAuth();

  // State cho package và contract
  const [curPackage, setCurPackage] = useState<Package | null>(null);
  const [contractCurrent, setContractCurrent] = useState<Contract | null>(null);

  // State điều khiển loading, error, refetch
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);

  // State điều khiển Dialog
  const [open, setOpen] = useState<boolean>(false);
  const [openCancel, setOpenCancel] = useState<boolean>(false);

  // 🔥 Gọi API song song bằng Promise.all
  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [packData, contractData] = await Promise.all([
        PackageCurrent(user.representativeId),
        GetContractCurrentAPI(user.representativeId),
      ]);

      setCurPackage(packData.data || null);
      setContractCurrent(contractData.data || null);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Gọi lại khi user hoặc flag thay đổi
  useEffect(() => {
    loadData();
  }, [user]);

  if (loading) {
    return (
      <Container maxWidth="xl" className="p-6 rounded-lg shadow-lg">
        <DialogLoading />
      </Container>
    );
  }



  return (
    <Container maxWidth="xl" className="p-6 rounded-lg shadow-lg">
      {/* Header */}
      <Typography
        variant="h5"
        className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] bg-clip-text text-transparent font-bold text-center mb-6"
      >
        👤 My Contract
      </Typography>

      {/* Thông tin user và gói hiện tại */}
      <Card className="p-4 flex flex-col md:flex-row items-center shadow-lg mt-3">
        <Grid2 container spacing={2} sx={{ width: "100%" }}>
          {/* Avatar */}
          <Grid2 size={{ xs: 12, md: 3 }} className="flex justify-center align-middle">
            <img
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgKcotk6_jh_7Prj9CmeNtQeyNDIIs0NnRzA&s"
              }
              alt="Avatar"
              loading="lazy"
              style={{ height: "85%", width: "250px", borderRadius: "20px" }}
            />
          </Grid2>

          {/* Thông tin User */}
          <Grid2 size={{ xs: 12, md: 9 }}>
            <Grid2 container>
              <Grid2 size={{ xs: 12, md: 10 }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  className="text-center md:text-left mb-2"
                >
                  {user?.fullname}
                </Typography>
                <Typography
                  color="textSecondary"
                  className="text-center md:text-left mb-3"
                >
                  🔹 <b>Role:</b> {user?.roles[0] || "N/A"}
                </Typography>
                <Typography
                  color="textSecondary"
                  className="text-center md:text-left mt-1 mb-2"
                >
                  📧 <b>Email:</b> {user?.email}
                </Typography>
                <Typography
                  color="textSecondary"
                  className="text-center md:text-left mt-3 mb-2"
                >
                  📞 <b>Phone:</b> {user?.phonenumber || "N/A"}
                </Typography>
              </Grid2>

              <Grid2
                size={{ xs: 12, md: 2 }}
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
              >
                {/* Icon để mở modal chi tiết gói */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<CircleAlertIcon />}
                      size="small"
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full md:w-1/2 p-6 bg-gradient-to-r from-[#e0f7fa] to-[#80deea] rounded-lg shadow-lg">
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      📌 Package Details:
                    </Typography>
                    <ul className="list-disc list-inside space-y-4 mt-4">
                      {curPackage?.packageDetails?.map((detail, index) => (
                        <li
                          key={index}
                          className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-md hover:bg-blue-100 transition-all duration-300"
                        >
                          <span className="text-lg font-semibold text-blue-600">
                            {detail.value}
                          </span>
                          <span className="text-sm text-gray-500">
                            {detail.packageType}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </DialogContent>
                </Dialog>
              </Grid2>
            </Grid2>

            <Divider className="my-4" />

            {/* Gói hiện tại */}
            {curPackage ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="w-3/4">
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="primary"
                      className="mb-2"
                    >
                      🎟️ <b>Current Package:</b> {curPackage.packageName}
                    </Typography>
                    <Grid2 container spacing={4}>
                      <Grid2 size={{ xs: 12, md: 6 }} mt={2}>
                        <Typography mb={2}>
                          💰 <b>Price:</b> {formatPrice(curPackage.price)}
                        </Typography>
                        <Typography mb={2}>
                          📅 <b>Duration:</b> {curPackage.duration} months
                        </Typography>
                        <Typography mb={2}>
                          ⏳ <b>Expiry Date:</b>{" "}
                          {curPackage.endOfSupportDate || "Not Expired"}
                        </Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, md: 6 }} mt={2}>
                        <Typography mb={2}>
                          🔘 <b>Status:</b>{" "}
                          <span
                            className={
                              curPackage.status ? "text-green-500" : "text-red-500"
                            }
                          >
                            {curPackage.status ? "Active" : "Inactive"}
                          </span>
                        </Typography>
                        <Typography mb={2}>
                          📝 <b>Description:</b>{" "}
                          {curPackage.description || "No description"}
                        </Typography>
                      </Grid2>
                    </Grid2>
                  </div>
                </div>
                <div className="flex gap-7 mt-1 justify-end">
                  <Button
                    className="block mt-4 hover:scale-105"
                    variant="contained"
                    sx={{ background: "black", textTransform: "none" }}
                    onClick={() => setOpenCancel(true)}
                  >
                    📄 Cancel package
                  </Button>
                  <Button
                    className="block mt-4 hover:scale-105"
                    sx={{
                      background: "linear-gradient(to right, #136CB5, #49BBBD)",
                      textTransform: "none",
                    }}
                    variant="contained"
                    onClick={() => setOpen(true)}
                  >
                    📄 Extend package
                  </Button>
                </div>
              </>
            ) : (
              <Typography color="textSecondary">❌ No package assigned</Typography>
            )}
          </Grid2>
        </Grid2>
      </Card>

      {/* Lịch sử đăng ký */}
      <Card className="p-4 mt-6 shadow-lg">
        <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
          📜 Registration History
        </Typography>
        <ContractRepresentativePage />
      </Card>

      {/* Dialog Extend */}
      <ConfirmDialog open={open} setOpen={setOpen} />

      {/* Dialog Cancel */}
      <ConfirmCancelDialog
        open={openCancel}
        setOpen={setOpenCancel}
        contract={contractCurrent}
      />
    </Container>
  );
};

export default WalletRepresentative;
