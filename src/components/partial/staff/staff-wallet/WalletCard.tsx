/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Edit, EyeIcon, RotateCcw, Trash2 } from "lucide-react";
import { Wallet } from "@/models/Wallet";
import { Input } from "@/components/ui/input";
import { MagicCard } from "@/components/magicui/magic-card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ViewWalletDialog } from "./ViewWalletDialog";
import { OnlyViewWalletDialog } from "./OnlyViewWalletDialog";
import { useWallet } from "@/hooks/staff/Wallet/useWallet";
import { useQueryClient } from "@tanstack/react-query";
import { AlertModal } from "@/components/ui/alert-modal";
import toast from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WalletData {
  wallets: Wallet[];
}

const WalletCard = ({ wallets }: WalletData) => {
  const [showSensitive] = useState(false);
  const [search, setSearch] = useState("");
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const handleCloseDialog = () => setIsDialogOpen(false);
  const [openWalletId, setOpenWalletId] = useState<string | null>(null); // Trạng thái open cho ví cụ thể
  const [loading, setLoading] = useState(false);
  const { deactiveWallet, reactiveWallet } = useWallet();
  const queryClient = useQueryClient();

  const onConfirm = async (walletId: string) => {
    setLoading(true);
    try {
      await deactiveWallet(walletId);
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    } catch (error: any) {
      const errorMessage = error.response.data?.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Error deactivating wallet:", error);
    } finally {
      setLoading(false);
      setOpenWalletId(null); // Đóng modal sau khi xác nhận
    }
  };
  async function handleReactive(walletId: string) {
    try {
      console.log("Approving Event...");
      // Call API để cập nhật status thành "Active"
      await reactiveWallet(walletId);
    } catch (error: any) {
      const errorMessage = error.response.data.message || "An error occurred";
      console.log(errorMessage);
    }
  }
  // Lọc ví theo tên hoặc thông tin khác
  const filteredWallets = wallets.filter((wallet) =>
    wallet.walletName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Tìm kiếm */}
      <div className="p-4 my-3 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search Wallets..."
          className="p-2 border rounded-lg w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Hiển thị ví */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {filteredWallets.map((wallet) => (
          <div key={wallet.walletId}>
            {/* AlertModal chỉ hiển thị cho ví đang được chọn */}
            <AlertModal
              isOpen={openWalletId === wallet.walletId}
              onClose={() => setOpenWalletId(null)}
              onConfirm={() => onConfirm(wallet.walletId)}
              loading={loading}
            />
            <MagicCard
              key={wallet.walletId}
              className="cursor-pointer p-5 flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 "
              gradientColor="#D1EAF0"
            >
              <div className="flex justify-between items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">{wallet.walletName}</h3>
              </div>
              <p className="text-gray-500 text-sm gap-2">
                Status:{" "}
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-md w-fit ${
                    wallet.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {wallet.status ? "Active" : "Inactive"}
                </span>
              </p>
              <div className="space-y-1 mt-2">
                <p className=" text-gray-800 font-medium">
                  Bank: {wallet.bankName}
                </p>
                <p className=" text-gray-800">
                  API Key: {showSensitive ? wallet.apiKey : "••••••••"}
                </p>
                <p className="text-gray-800">
                  Client ID: {showSensitive ? wallet.clientId : "••••••••"}
                </p>
                <p className="text-gray-800">
                  Checksum Key:{" "}
                  {showSensitive ? wallet.checkSumKey : "••••••••"}
                </p>
              </div>
              {wallet.status ? (
                <div className="flex items-center gap-2 justify-end mt-3">
                  <button
                    onClick={() => setOpenWalletId(wallet.walletId)}
                    className="pb-[6px]"
                  >
                    <Trash2 size={20} className=" text-red-500" />
                  </button>
                  <Dialog>
                    <DialogTrigger>
                      <button>
                        <Edit size={20} />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <ViewWalletDialog
                        initialData={wallet}
                        onSuccess={() => {}}
                        // setOpen={handleCloseDialog}
                      />
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger>
                      <button>
                        <EyeIcon size={20} />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <OnlyViewWalletDialog initialData={wallet} />
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-end mt-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => handleReactive(wallet.walletId)}>
                          <RotateCcw size={20} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD]">
                        <p>Reactive wallet</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Dialog>
                    <DialogTrigger>
                      {/* <button> */}
                      <EyeIcon size={23} />
                      {/* </button> */}
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <OnlyViewWalletDialog initialData={wallet} />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </MagicCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletCard;
