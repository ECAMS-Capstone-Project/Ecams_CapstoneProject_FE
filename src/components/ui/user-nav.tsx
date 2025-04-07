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
import { CalendarCheck, CircleUser, House, LogOut } from "lucide-react";
import { Event } from "@mui/icons-material";
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
                  {userInfo?.fullname}
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
                <DropdownMenuShortcut>
                  <CircleUser />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              {userInfo?.roles &&
                !userInfo?.roles.includes("REPRESENTATIVE") &&
                !userInfo?.roles.includes("ADMIN") && (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/club")}>
                      My club
                      <DropdownMenuShortcut>
                        <Groups2Icon />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/student/student-events")}
                    >
                      My Event
                      <DropdownMenuShortcut>
                        <Event />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/student/schedule")}
                    >
                      Schedule
                      <DropdownMenuShortcut>
                        <CalendarCheck />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/student")}>
                      Back to page
                      <DropdownMenuShortcut>
                        <House />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </>
                )}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
              <DropdownMenuShortcut>
                <LogOut />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
