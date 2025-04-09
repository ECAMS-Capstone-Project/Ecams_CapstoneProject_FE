/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, Container, Typography, Grid2 } from "@mui/material";
import { Button } from "@mui/material"; // Dùng Button từ MUI
import { PackageCurrent } from "@/api/agent/PackageAgent";
import { Package } from "@/models/Package";
import ContractRepresentativePage from "@/pages/representative/contract/ContractRepresentativePage";
import useAuth from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { GetContractCurrentAPI } from "@/api/representative/ContractAPI";
import { Contract } from "@/models/Contract";
import ConfirmDialog from "./confirmDialog";
import ConfirmCancelDialog from "./confirmCancel";
import DialogLoading from "@/components/ui/dialog-loading";
import { formatPrice } from "@/lib/FormatPrice";
import { format } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

const WalletRepresentative = () => {
  const { user } = useAuth();

  // State cho package và contract
  const [curPackage, setCurPackage] = useState<Package | null>(null);
  const [contractCurrent, setContractCurrent] = useState<Contract | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

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
        PackageCurrent(user.universityId || ""),
        GetContractCurrentAPI(user.universityId || ""),
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
        Contract Information
      </Typography>

      {/* Thông tin user và gói hiện tại */}
      <Card className="p-4 md:flex-row items-center shadow-lg mt-4">
        <Grid2 container spacing={3} sx={{ width: "100%" }}>
          {/* Thông tin User */}
          <Grid2 size={{ xs: 12, md: 6 }} boxShadow={1} p={2}>
            <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
              🔸 <b>Full Name:</b> {user?.fullname}
            </Typography>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 7.5 }}>
                <Typography mb={2}>
                  📧 <b>Email:</b> {user?.email}
                </Typography>
                <Typography mb={2}>
                  📞 <b>Phone:</b> {user?.phonenumber || "N/A"}
                </Typography>
                <Typography mb={2}>
                  🔹 <b>Role:</b> {user?.roles[0] || "N/A"}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4.5 }}>
                <Typography mb={2}>
                  🏫 <b>University:</b> {user?.universityName || "N/A"}
                </Typography>
              </Grid2>
            </Grid2>
          </Grid2>
          {/* Gói hiện tại */}
          <Grid2 size={{ xs: 12, md: 6 }} boxShadow={1} p={2}>
            {curPackage ? (
              <>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary"
                  mb={2}
                >
                  🎟️ <b>Current Package:</b> {curPackage.packageName}
                </Typography>
                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Typography mb={2}>
                      💰 <b>Price:</b> {formatPrice(curPackage.price)}
                    </Typography>
                    <Typography mb={2}>
                      📅 <b>Duration:</b> {curPackage.duration} months
                    </Typography>
                    <Typography mb={2}>
                      ⏳ <b>Expiry Date:</b>{" "}
                      {format(new Date(curPackage.endDate), "dd-MM-yyyy")}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Typography mb={2}>
                      📝 <b>Description:</b>{" "}
                      {curPackage.description || "No description"}
                    </Typography>
                    <Typography mb={2}>
                      🔘 <b>Package Status:</b>{" "}
                      <span
                        className={
                          curPackage.status ? "text-green-500" : "text-red-500"
                        }
                      >
                        {curPackage.status ? "Active" : "Inactive"}
                      </span>
                    </Typography>
                  </Grid2>
                </Grid2>
              </>
            ) : (
              <div className="flex justify-center">
                <Typography color="textSecondary" variant="h6">
                  ❌ No package assigned
                </Typography>
              </div>
            )}
          </Grid2>
        </Grid2>
        {curPackage && (
          <div className="flex gap-7 mt-1 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="block mt-4 hover:scale-105"
                  sx={{
                    background: "black",
                    textTransform: "none",
                  }}
                  variant="contained"
                >
                  View detail
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full md:w-1/2 p-6 bg-gradient-to-r from-[#e0f7fa] to-[#80deea] rounded-lg shadow-lg">
                <Typography variant="h6" fontWeight="bold" color="primary">
                  📌 Package Details:
                </Typography>
                {curPackage?.packageDetails?.map((detail, index) => (
                  <ul key={index} className="flex gap-2">
                    <div className="flex justify-center w-full">
                      <li
                        key={index + 1}
                        className="flex  w-3/5 items-center space-x-2 p-2 bg-white rounded-lg shadow-md hover:bg-blue-100 transition-all duration-300"
                      >
                        <span className="text-lg font-semibold text-blue-600">
                          Max {detail.packageType}:{" "}
                        </span>
                        <span className="text-sm text-gray-500 mt-0.5">
                          {detail.value} {detail.packageType}{" "}
                        </span>
                      </li>
                    </div>
                  </ul>
                ))}
              </DialogContent>
            </Dialog>

            <Button
              className="block mt-4 hover:scale-105"
              variant="contained"
              sx={{ background: "#f24141", textTransform: "none" }}
              onClick={() => setOpenCancel(true)}
            >
              Cancel package
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
              Extend package
            </Button>
          </div>
        )}
      </Card>

      {/* Lịch sử đăng ký */}
      <Card className="p-4 mt-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6" fontWeight="bold" color="primary">
            📜 Registration History
          </Typography>
          <div className="flex items-center gap-4">
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
        </div>
        <ContractRepresentativePage dateRange={dateRange} />
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
