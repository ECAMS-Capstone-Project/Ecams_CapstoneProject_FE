/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Container, Typography, Divider, Grid2, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { PackageCurrent } from "@/api/agent/PackageAgent";
import { Package } from "@/models/Package";
import ContractStaffPage from "@/pages/staff/contract/ContractStaffPage";
import useAuth from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CircleAlertIcon } from "lucide-react"; // Icon for modal trigger
import { ContractStaff } from "@/api/staff/ContractAPI";
import { Contract } from "@/models/Contract";
import ConfirmDialog from "./confirmDialog";
import ConfirmCancelDialog from "./confirmCancel";

const WalletStaff = () => {
  const { user } = useAuth();
  const [curPackage, setCurPackage] = useState<Package | null>(null);
  const [, setLoading] = useState<boolean>(true);
  const [contractList, setContractList] = useState<Contract[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [openCancel, setOpenCancel] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(false);
  useEffect(() => {
    const loadCurrentPackage = async () => {
      if (user) {
        try {
          const contractData = await PackageCurrent(user.staffId);
          setCurPackage(contractData.data || null);
        } catch (error: any) {
          console.log(error.message);
        } finally {
          setLoading(false);
        }
      }
    };
    const loadContract = async () => {
      if (user) {
        try {
          const contractData = await ContractStaff(100, 1, user.staffId);
          setContractList(contractData.data?.data.filter((a) => a.status == true) || []);
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setLoading(false); // Hoàn tất tải
        }
      }
    };
    loadCurrentPackage();
    loadContract();
  }, [user, flag]);

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
          <Grid2 size={{ xs: 12, md: 3 }} className="flex justify-center align-middle" >
            <div>
              <img
                srcSet={`${'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgKcotk6_jh_7Prj9CmeNtQeyNDIIs0NnRzA&s'}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgKcotk6_jh_7Prj9CmeNtQeyNDIIs0NnRzA&s'}?w=248&fit=crop&auto=format`}
                alt={'item.title'}
                loading="lazy"
                style={{ height: "85%", width: "250px", borderRadius: "20px" }}
              />
            </div>
          </Grid2>

          {/* Thông tin User */}
          <Grid2 size={{ xs: 12, md: 9 }}>
            <Grid2 container>
              <Grid2 size={{ xs: 12, md: 10 }} sx={{ justifyContent: "center" }}>
                <Typography variant="h5" fontWeight="bold" className="text-center md:text-left mb-2">
                  {user?.fullname}
                </Typography>
                <Typography color="textSecondary" className="text-center md:text-left mb-3">
                  🔹 **Role**: {user?.roles[0] || "N/A"}
                </Typography>
                <Typography color="textSecondary" className="text-center md:text-left mt-1 mb-2">
                  📧 **Email**: {user?.email}
                </Typography>
                <Typography color="textSecondary" className="text-center md:text-left mt-3 mb-2">
                  📞 **Phone**: {user?.phonenumber || "N/A"}
                </Typography>
              </Grid2>
              <Grid2 display={'flex'} justifyContent="center" alignItems={'flex-start'} size={{ xs: 12, md: 2 }}>
                {/* Icon để mở modal chi tiết gói */}
                <Dialog>
                  <DialogTrigger>
                    <Button variant="outlined" color="primary" startIcon={<CircleAlertIcon />} size="small">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full md:w-1/2 p-6 bg-gradient-to-r from-[#e0f7fa] to-[#80deea] rounded-lg shadow-lg">
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      📌 Package Details:
                    </Typography>
                    <ul className="list-disc list-inside space-y-4 mt-4">
                      {curPackage && curPackage.packageDetails.map((detail, index) => (
                        <li key={index} className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-md hover:bg-blue-100 transition-all duration-300">
                          <span className="text-lg font-semibold text-blue-600">{detail.value}</span>
                          <span className="text-sm text-gray-500">{detail.packageType}</span>
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
                    <Typography variant="h6" fontWeight="bold" color="primary" className="mb-2">
                      🎟️ **Current Package**: {curPackage.packageName}
                    </Typography>
                    <Grid2 container spacing={4}>
                      <Grid2 size={{ xs: 12, md: 6 }} mt={2}>
                        <Typography mb={2}>
                          💰 **Price**: ${curPackage.price}
                        </Typography>
                        <Typography mb={2}>
                          📅 **Duration**: {curPackage.duration} months
                        </Typography>
                        <Typography mb={2}>
                          ⏳ **Expiry Date**: {curPackage.endOfSupportDate || "Not Expired"}
                        </Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, md: 6 }} mt={2}>
                        <Typography mb={2}>
                          🔘 **Status**:{" "}
                          <span className={curPackage.status ? "text-green-500" : "text-red-500"}>
                            {curPackage.status ? "Active" : "Inactive"}
                          </span>
                        </Typography>
                        <Typography mb={2}>📝 **Description**: {curPackage.description || "No description"}</Typography>
                      </Grid2>
                    </Grid2>
                  </div>
                </div>
                <div className="flex gap-7 mt-1 justify-end">
                  <Button
                    className="block mt-4 hover:scale-105"
                    variant="contained"
                    sx={{ background: "black", textTransform: "none" }}
                    // disabled={
                    //   contract == null || undefined || contract.status == false
                    // }
                    onClick={() => setOpenCancel(true)}
                  >
                    📄 Cancel package
                  </Button>
                  <Button
                    className="block mt-4 hover:scale-105"
                    sx={{ background: "linear-gradient(to right, #136CB5, #49BBBD)", textTransform: "none" }}
                    // disabled={
                    //   contract == null || undefined || contract.status == false
                    // }
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
        <ContractStaffPage />
      </Card>

      <ConfirmDialog open={open} setOpen={setOpen} />
      <ConfirmCancelDialog
        open={openCancel}
        setOpen={setOpenCancel}
        contract={contractList[0] || null}
        setFlag={setFlag}
      />
    </Container>
  );
};

export default WalletStaff;
