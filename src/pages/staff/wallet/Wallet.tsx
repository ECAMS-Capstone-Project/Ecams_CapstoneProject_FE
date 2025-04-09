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
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// import { WalletPagination } from "@/components/partial/staff/staff-wallet/WalletPagination";

const Wallet = () => {
  const [pageNo] = useState(1);
  const [pageSize] = useState(10);
  const [userInfo, setUserInfo] = useState<UserAuthDTO>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Hàm mở hoặc đóng video dialog
  const toggleVideoDialog = () => {
    setIsVideoOpen(!isVideoOpen);
  };
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

  const { wallets, isLoading } = useWallet(
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
            <div className="flex items-center gap-2">
              <div className="relative">
                {/* Button để mở video */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="custom"
                        onClick={toggleVideoDialog}
                        className=" text-white shadow-lg hover:shadow-xl duration-300 hover:scale-105 transition"
                      >
                        View instruction
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gradient-to-r from-[#136CB9]/10 to-[#49BBBD]/10 text-[#136CB9] text-md">
                      <p>View instruction to register PayOs account</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Video dialog chỉ hiển thị khi isVideoOpen là true */}
                {isVideoOpen && (
                  <HeroVideoDialog
                    animationStyle="from-center"
                    videoSrc="https://www.youtube.com/embed/y1XELoAZ1_c?si=Bh7QGpUb2EDyFIWM"
                    thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                    thumbnailAlt="Hero Video"
                    isOpen={isVideoOpen}
                    setIsOpen={() => setIsVideoOpen(false)}
                  />
                )}
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger>
                  <Button className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] shadow-lg hover:shadow-xl hover:scale-105 transition duration-300">
                    <Plus className="mr-1 h-4 w-4" />
                    New Wallet
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <ViewWalletDialog
                    initialData={null}
                    onSuccess={() => { }}
                    setOpen={handleCloseDialog}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Separator />

          <WalletCard wallets={wallets} />

          {/* <div className="flex justify-between items-center mt-9 pt-6">
            <div className="w-full h-full">
              <WalletPagination
                totalPages={totalPages}
                pageSize={pageSize}
                pageNo={pageNo}
                setPageNo={setPageNo}
                setPageSize={setPageSize}
              />
            </div>
          </div> */}
        </>
      )}
    </React.Suspense>
  );
};

export default Wallet;
