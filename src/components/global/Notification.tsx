import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon, Info, MonitorCog } from "lucide-react";
import * as signalR from "@microsoft/signalr";
import { Noti } from "@/models/Notification";
import { getUserNotiQuery } from "@/api/agent/NotiAgent";
import { getCurrentUserAPI } from "@/api/auth/LoginAPI";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import toast from "react-hot-toast";
import { useNotification } from "@/hooks/useNotification";
import useAuth from "@/hooks/useAuth";
import Swal from "sweetalert2";

const NotificationDropdown = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [notifications, setNotifications] = useState<Noti[]>([]);
  const accessToken = localStorage.getItem("accessToken") || "";
  const [userInfo, setUserInfo] = useState<UserAuthDTO>();
  const [unreadCount, setUnreadCount] = useState(0);
  const { readNotiMutation } = useNotification();
  const { logout } = useAuth();
  const shownNotiIdsRef = useRef<Set<string>>(new Set());

  // Tự động kết nối SignalR ngay khi load component
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

  const { data: notificationsData, isLoading } = getUserNotiQuery(
    userInfo?.userId || ""
  );

  // Cập nhật danh sách notifications và unread count khi nhận dữ liệu mới
  useEffect(() => {
    if (notificationsData?.data) {
      const unread = notificationsData.data.filter(
        (noti) => noti.isRead === false
      ).length;
      setUnreadCount(unread);
      setNotifications(notificationsData.data);
    }
  }, [notificationsData?.data]);

  // 🟢 Kết nối SignalR ngay khi load
  useEffect(() => {
    const connectSignalR = async () => {
      if (connection) {
        console.log("Already connected!");
        return;
      }

      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(
          `https://ecams.duckdns.org/notificationHub?access_token=${accessToken}`
        )
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      newConnection.on(
        "ReceiveNotification",
        async (notificationId, notificationType, message, isRead) => {
          console.log("=== SignalR Notification Received ===");
          console.log("Connection state:", newConnection.state);
          console.log("Connection ID:", newConnection.connectionId);
          console.log("Notification details:", {
            notificationId,
            notificationType,
            message,
            isRead,
          });
          console.log("=== End Notification ===");
          setNotifications((prev) => {
            const exists = prev.some(
              (noti) => noti.notificationId === notificationId
            );
            if (exists) return prev;
            return [
              ...prev,
              { notificationType, message, isRead, notificationId },
            ];
          });

          if (!isRead) {
            console.log("New unread notification:", isRead);
            setUnreadCount((prev) => prev + 1);
          }

          if (!shownNotiIdsRef.current.has(notificationId)) {
            shownNotiIdsRef.current.add(notificationId);

            toast.custom(
              () => (
                <div className="bg-white border-l-4 border-blue-500 shadow-md rounded-md p-4 w-96 text-sm text-gray-800">
                  <div className="flex items-start space-x-2">
                    <div className="text-xl">
                      {notificationType === "SYSTEM" ? "🚨" : "ℹ️"}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Thông báo</p>
                      <p className="mt-1">{message}</p>
                    </div>
                  </div>
                </div>
              ),
              {
                position: "top-right",
                duration: 4000,
              }
            );
          }

          if (
            message.includes("New club owner has been add! You are kicked!") ||
            message.includes("New representative has been add! You are kicked!")
          ) {
            try {
              // Hiển thị popup đẹp với 1 nút OK
              const result = await Swal.fire({
                title: "Alert",
                text: message,
                icon: "error", // Có thể là 'warning', 'success', 'error'
                confirmButtonText: "OK",
                allowOutsideClick: false, // Không cho click ra ngoài để tắt
                allowEscapeKey: false, // Không cho bấm ESC để tắt
              });

              // Sau khi bấm OK thì logout
              if (result.isConfirmed) {
                await logout();
                window.location.href = "/login"; // Chuyển hướng sau khi logout thành công
              }
            } catch (error) {
              console.error("Error during logout", error);
            }
          }
        }
      );

      try {
        await newConnection.start();
        setConnection(newConnection);
      } catch (error) {
        console.error("Error connecting to SignalR", error);
      }
    };

    connectSignalR();
  }, [connection]);

  // Thêm useEffect để theo dõi trạng thái kết nối
  useEffect(() => {
    if (connection) {
      connection.onclose((error) => {
        console.log("SignalR connection closed", error);
      });

      connection.onreconnecting((error) => {
        console.log("SignalR reconnecting", error);
      });

      connection.onreconnected((connectionId) => {
        console.log("SignalR reconnected", connectionId);
      });
    }
  }, [connection]);

  // 🟢 Đánh dấu tất cả thông báo là đã đọc
  const markNotificationsAsRead = async () => {
    if (unreadCount > 0 && !isLoading) {
      try {
        await readNotiMutation(userInfo?.userId || "");
        setUnreadCount(0); // Reset unread count after marking notifications as read
        toast.success("Notifications marked as read", {
          position: "top-center",
        });
      } catch (error) {
        toast.error("Failed to mark notifications as read");
        console.log("Error marking notifications as read:", error);
      }
    }
  };

  return (
    <div className="relative">
      {isLoading ? (
        <div className="flex justify-center items-center h-full w-full  absolute bg-opacity-50 bg-gray-500 z-50">
          {/* <DialogLoading /> */}
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative cursor-pointer p-0.5">
              <BellIcon
                size={38}
                className="p-2.5 shadow-slate-300 bg-slate-50 shadow-md rounded-full text-[#136CB9] font-extrabold"
              />
              {unreadCount > 0 && (
                <span className="absolute top-[-8px] right-[-5px] bg-red-600 rounded-full h-5 w-5 text-white text-xs font-semibold flex items-center justify-center z-9999">
                  {unreadCount}
                </span>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="max-w-md w-auto max-h-96 p-2"
            align="end"
            forceMount
            onMouseEnter={markNotificationsAsRead}
          >
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
            <DropdownMenuGroup className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <DropdownMenuItem className="text-center text-sm">
                  No new notifications
                </DropdownMenuItem>
              ) : (
                notifications
                  .sort((a, b) => {
                    const aDate = a.createdDate
                      ? new Date(a.createdDate)
                      : null;
                    const bDate = b.createdDate
                      ? new Date(b.createdDate)
                      : null;
                    return (bDate?.getTime() || 0) - (aDate?.getTime() || 0);
                  })
                  .map((notification) => (
                    <DropdownMenuItem
                      key={notification.notificationId}
                      className="py-3"
                    >
                      <div className="flex justify-between items-center w-full px-2">
                        <div className="icon w-1/5">
                          {notification.notificationType === "SYSTEM" ? (
                            <MonitorCog size={26} className="text-yellow-700" />
                          ) : (
                            <Info size={26} className="text-[#247093]" />
                          )}
                        </div>
                        <div className="message w-4/5">
                          {notification.message}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default NotificationDropdown;
