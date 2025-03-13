import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import { getCurrentUserAPI } from "@/api/auth/LoginAPI";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import Groups2Icon from "@mui/icons-material/Groups2";
import NotificationDropdown from "../global/Notification";
export function UserNav() {
  const [userInfo, setUserInfo] = useState<UserAuthDTO>();
  const navigate = useNavigate();
  const { logout } = useAuth();
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

  const handleLogout = async () => {
    await logout();
    navigate("/");
    toast.success("Logout successfully");
  };

  return (
    <>
      <div className="flex w-fit justify-center items-center gap-3 ">
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <BellIcon size={24} className="cursor-pointer p-0.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  Your Notifications
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  Check your latest notifications
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="truncate max-w-sm block">
                premium 2 package will be discontinued from now. However,
                current subscribers can continue to use the package until its
                expiration date, but it will no longer be renewable after this
                point.
              </DropdownMenuItem>
              <DropdownMenuItem className="truncate max-w-sm block">
                premium 2 package will be discontinued from now. However,
                current subscribers can continue to use the package until its
                expiration date, but it will no longer be renewable after this
                point.
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>New Team</DropdownMenuItem> */}
        {/* </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu> */}
        {userInfo?.roles && !userInfo?.roles.includes("ADMIN") && (
          <NotificationDropdown />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {userInfo?.fullname} | {userInfo?.roles}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userInfo?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/common/profile")}>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/club")}>
                My club
                <DropdownMenuShortcut>
                  <Groups2Icon />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/student")}>
                Back to page
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
