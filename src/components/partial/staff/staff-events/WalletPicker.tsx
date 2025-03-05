import { Wallet } from "@/models/Wallet";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { useWallet } from "@/hooks/staff/Wallet/useWallet";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import { getCurrentUserAPI } from "@/api/auth/LoginAPI";

interface EventWalletPickerProps {
  value?: string | null; // Đây là walletId
  onChange: (walletId: string) => void;
}

const EventWalletPicker: React.FC<EventWalletPickerProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [pageNo] = useState(1);
  const [pageSize] = useState(10);
  const [userInfo, setUserInfo] = useState<UserAuthDTO>();

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
  const { wallets } = useWallet(
    userInfo?.universityId ?? "",
    accessToken ?? "",
    pageNo,
    pageSize
  );
  console.log(wallets);

  // Tìm đối tượng wallet tương ứng từ walletId
  const selectedWallet = wallets.find(
    (wallet: Wallet) => wallet.walletId === value
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-9 px-3 w-full rounded-md flex items-center justify-between"
          onClick={() => setOpen(true)}
        >
          <span>
            {selectedWallet ? selectedWallet.walletName : "Select Wallet..."}
          </span>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search wallet..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {wallets.map((wallet: Wallet) => (
                <CommandItem
                  key={wallet.walletId}
                  onSelect={() => {
                    onChange(wallet.walletId);
                    setOpen(false);
                  }}
                  className="flex items-center"
                >
                  <span>{wallet.walletName}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default EventWalletPicker;
