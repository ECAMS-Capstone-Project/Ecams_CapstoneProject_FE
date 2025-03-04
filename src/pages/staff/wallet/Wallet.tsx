import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import WalletCard from "@/components/partial/staff/staff-wallet/WalletCard";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import { getCurrentUserAPI } from "@/api/auth/LoginAPI";
import { useWallet } from "@/hooks/staff/Wallet/useWallet";
import { ViewWalletDialog } from "@/components/partial/staff/staff-wallet/ViewWalletDialog";

import { WalletPagination } from "@/components/partial/staff/staff-wallet/WalletPagination";

const Wallet = () => {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [userInfo, setUserInfo] = useState<UserAuthDTO>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getCurrentUserAPI();

        if (userInfo) {
          setUserInfo(userInfo.data);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const { wallets, isLoading, totalPages } = useWallet(
    userInfo?.universityId ?? "",
    accessToken ?? "",
    pageNo,
    pageSize
  );

  // Hàm xử lý đóng dialog sau khi thêm ví mới
  const handleCloseDialog = () => setIsDialogOpen(false);

  // Hàm thay đổi trang

  return (
    <React.Suspense fallback={<LoadingAnimation />}>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="flex items-center justify-between pt-4">
            <Heading
              title={`Manage Wallet`}
              description={`Monitor and manage the wallet of ${userInfo?.universityName}`}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger>
                <Button className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] shadow-lg hover:shadow-xl hover:scale-105 transition duration-300">
                  <Plus className="mr-1 h-4 w-4" />
                  New Bank Account
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <ViewWalletDialog
                  initialData={null}
                  onSuccess={() => {}}
                  setOpen={handleCloseDialog}
                />
              </DialogContent>
            </Dialog>
          </div>
          <Separator />

          <WalletCard wallets={wallets} />

          <div className="flex justify-between items-center mt-9 pt-6">
            <div className="w-full h-full">
              {/* Pagination nằm ở dưới cùng */}
              <WalletPagination
                totalPages={totalPages}
                pageSize={pageSize}
                pageNo={pageNo}
                setPageNo={setPageNo}
                setPageSize={setPageSize}
              />
            </div>
          </div>
        </>
      )}
    </React.Suspense>
  );
};

export default Wallet;
