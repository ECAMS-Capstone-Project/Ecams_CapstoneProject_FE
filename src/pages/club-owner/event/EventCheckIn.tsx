/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { EventAvailable, PhoneIphone } from "@mui/icons-material";
import useAuth from "@/hooks/useAuth";

interface TicketInfo {
  id: string;
  ticketCode: string;
  purchaseDate: Date;
  price: number;
  status: "pending" | "checked-in";
  event: {
    id: string;
    name: string;
    date: Date;
    startTime: string;
    endTime: string;
    location: string;
    organizerName: string;
  };
  participant: {
    id: string;
    name: string;
    studentId: string;
    avatar?: string;
    email: string;
    phone: string;
  };
}

export const EventCheckIn = () => {
  //   const location = useLocation();
  //   const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  // TODO: Lấy ticketId từ QR code và gọi API để lấy thông tin
  const mockTicket: TicketInfo = {
    id: "TICKET123",
    ticketCode: "EVT-2024-001",
    purchaseDate: new Date(),
    price: 50000,
    status: "pending",
    event: {
      id: "1",
      name: "Workshop: React Advanced Patterns",
      date: new Date(),
      startTime: "15:00",
      endTime: "17:00",
      location: "Room 305, Building A",
      organizerName: "F-Code Club",
    },
    participant: {
      id: user?.userId || "",
      name: user?.fullname || "",
      studentId: user?.universityName || "",
      email: user?.email || "",
      phone: user?.phonenumber || "",
      avatar: user?.avatar,
    },
  };

  const handleCheckIn = async () => {
    try {
      setIsLoading(true);
      // TODO: Gọi API check-in với ticketId
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Giả lập API call
      toast.success("Successfully checked in participant");
      // TODO: Redirect hoặc đóng QR scanner
    } catch (error) {
      toast.error("Failed to check in participant");
    } finally {
      setIsLoading(false);
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
                <span className="text-xs sm:text-sm text-gray-500">
                  #{mockTicket.ticketCode}
                </span>
              </div>
            </div>
            <Badge
              variant={
                mockTicket.status === "checked-in" ? "default" : "secondary"
              }
              className={`${
                mockTicket.status === "checked-in"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              } px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm`}
            >
              {mockTicket.status === "checked-in" ? "Checked-in" : "Pending"}
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
                    {mockTicket.event.organizerName}
                  </h3>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#2C8A84] mb-3 sm:mb-4">
                  {mockTicket.event.name}
                </h2>
                <div className="space-y-2 sm:space-y-3 text-gray-600">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 bg-white rounded">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#136CB9] flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        Date & Time
                      </span>
                      <span className="text-xs sm:text-sm truncate">
                        {format(mockTicket.event.date, "EEEE, dd MMM yyyy")} |{" "}
                        {mockTicket.event.startTime} -{" "}
                        {mockTicket.event.endTime}
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
                        {mockTicket.event.location}
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
                        {mockTicket.price.toLocaleString("en-US")} VND
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
                <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-white shadow-sm">
                  <AvatarImage src={mockTicket.participant.avatar} />
                  <AvatarFallback className="bg-blue-100 text-[#136CB9] text-sm sm:text-base">
                    {mockTicket.participant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    {mockTicket.participant.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {mockTicket.participant.studentId}
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
                      {mockTicket.participant.email}
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
                      {mockTicket.participant.phone}
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
                      {format(mockTicket.purchaseDate, "dd MMM yyyy, HH:mm")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {mockTicket.status === "pending" ? (
            <Button
              className="w-full hover:scale-[102%] shadow-lg hover:shadow-xl text-white py-4 sm:py-6 text-base sm:text-lg font-medium transition-all duration-200"
              onClick={handleCheckIn}
              disabled={isLoading}
              variant="custom"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                </div>
              ) : (
                "Confirm Check-in"
              )}
            </Button>
          ) : (
            <div className="text-center">
              <Button className="w-full py-4 sm:py-6" variant="custom" disabled>
                Already Checked-in
              </Button>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                This ticket has been checked in and cannot be used again
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
