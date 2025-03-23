/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import {
  BanknoteIcon,
  Building2,
  CalendarCheck2,
  CalendarDaysIcon,
  Clock,
  MapPin,
  QrCode,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { EventAvailable, PhoneIphone } from "@mui/icons-material";
import useAuth from "@/hooks/useAuth";
import { useEventSchedule } from "@/hooks/student/useEventRegister";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const StudentEventCheckIn = () => {
  // const location = useLocation();
  // const navigate = useNavigate();
  const { user } = useAuth();
  const { checkInStudent, isCheckingIn, getCheckInInfoQuery } =
    useEventSchedule(user?.userId || "");
  const [userId, setUserId] = useState("");
  const [eventId, setEventId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy URL hiện tại của trang
    // const url = window.location.href;

    // Sử dụng URLSearchParams để lấy các tham số
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get("userId");
    const event = urlParams.get("eventId");

    if (user && event) {
      setUserId(user);
      setEventId(event);
    }
  }, []);
  console.log("from url", userId, eventId);

  // TODO: Lấy ticketId từ QR code và gọi API để lấy thông tin
  const { data: checkInInfo } = getCheckInInfoQuery(userId, eventId);

  const handleCheckIn = async () => {
    try {
      checkInStudent(
        {
          eventId: eventId,
          userId: userId,
        },
        {
          onSuccess: () => {
            toast.success("Successfully checked in participant");
            navigate(`/club/event-participants/${eventId}`, {
              state: {
                previousPath: "/club/event-check-in",
              },
            });
          },
        }
      );

      // TODO: Redirect hoặc đóng QR scanner
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to check in participant"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-3 sm:p-4 md:p-6 rounded-lg">
      {/* Header */}
      <div className="w-full max-w-md mx-auto mb-4 sm:mb-6 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full mb-3 sm:mb-4">
          <CalendarCheck2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#136CB9]" />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Event Check-in
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Verify and confirm participant attendance
        </p>
      </div>

      <Card className="w-full md:max-w-2xl max-w-lg mx-auto border-t-4 border-t-[#136CB9] shadow-lg">
        <div className="p-4 sm:p-6">
          {/* Ticket Status */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-[#136CB9]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  Ticket ID
                </span>
              </div>
            </div>
            <Badge
              variant={"secondary"}
              className={`${"bg-yellow-100 text-yellow-800"} px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm`}
            >
              Pending
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Event Info */}
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <EventAvailable className="w-4 h-4 sm:w-5 sm:h-5 text-[#136CB9]" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                  Event Information
                </h3>
              </div>
              <div className="mb-4 sm:mb-6 bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#136CB9]" />
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                    {checkInInfo?.data?.clubName}
                  </h3>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#2C8A84] mb-3 sm:mb-4">
                  {checkInInfo?.data?.eventName}
                </h2>
                <div className="space-y-2 sm:space-y-3 text-gray-600">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 bg-white rounded">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#136CB9] flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        Date & Time
                      </span>
                      <span className="text-xs sm:text-sm truncate">
                        {checkInInfo?.data?.startDate &&
                          format(
                            checkInInfo?.data?.startDate,
                            "EEEE, dd MMM yyyy"
                          )}{" "}
                        -{" "}
                        {checkInInfo?.data?.endDate &&
                          format(
                            checkInInfo?.data?.endDate,
                            "EEEE, dd MMM yyyy"
                          )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2 bg-white rounded">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#136CB9] flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        Location
                      </span>
                      <span className="text-xs sm:text-sm truncate">
                        {checkInInfo?.data?.areaName
                          .map((area) => area)
                          .join(", ")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2 bg-white rounded">
                    <BanknoteIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#136CB9] flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        Ticket Price
                      </span>
                      <span className="text-xs sm:text-sm">
                        {checkInInfo?.data?.price &&
                        checkInInfo?.data?.price > 0
                          ? checkInInfo?.data?.price.toLocaleString("vi-VN") +
                            " VND"
                          : "Free"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <Separator className="my-4 sm:my-6 " /> */}

            {/* Participant Info */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#136CB9]" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                  Participant Information
                </h3>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    {checkInInfo?.data?.fullname}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {checkInInfo?.data?.studentDetailId}
                  </p>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3 bg-white p-2 rounded">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#136CB9]">@</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <label className="text-xs sm:text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {checkInInfo?.data?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-white p-2 rounded">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#136CB9]">
                      <PhoneIphone />
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <label className="text-xs sm:text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {checkInInfo?.data?.phonenumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-white p-2 rounded">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600">
                      <CalendarDaysIcon size={16} />
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <label className="text-xs sm:text-sm font-medium text-gray-700">
                      Purchase Date
                    </label>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {checkInInfo?.data?.purchaseDate &&
                        format(
                          new Date(checkInInfo.data.purchaseDate),
                          "dd MMM yyyy, HH:mm"
                        )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Action Button */}
          <Button
            className="w-full hover:scale-[102%] shadow-lg hover:shadow-xl text-white py-4 sm:py-6 text-base sm:text-lg font-medium transition-all duration-200"
            onClick={handleCheckIn}
            disabled={isCheckingIn}
            variant="custom"
          >
            {isCheckingIn ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
              </div>
            ) : (
              "Confirm Check-in"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};
