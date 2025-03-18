import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2Icon,
  ChevronLeft,
  XCircleIcon,
} from "lucide-react";
import { format } from "date-fns";
import { EventAreas } from "@/models/Area";
import { Place } from "@mui/icons-material";
import { useState } from "react";
import toast from "react-hot-toast";

export const FreeEventConfirm = () => {
  const location = useLocation();
  const event = location.state?.event;
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "",
    studentCode: "",
    email: "",
    phone: "",
  });

  if (!event) {
    return <div>No event data found. Please navigate from the event page.</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Check required fields
    if (
      !userInfo.name ||
      !userInfo.studentCode ||
      !userInfo.email ||
      !userInfo.phone
    ) {
      toast.error("Please fill in all required information");
      return;
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      toast.error("Invalid email format");
      return;
    }

    // Check phone number format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(userInfo.phone)) {
      toast.error("Invalid phone number format");
      return;
    }
    if (event.price > 0) {
      navigate("/events/payment-confirm", {
        state: {
          event: event,
          userInfo: userInfo,
        },
      });
    } else {
      navigate("/student/events/success", {
        state: {
          event: event,
        },
      });
    }
  };

  return (
    <div>
      <div className="relative w-full h-screen rounded-xl">
        {/* Ảnh nền */}
        <img
          src={event.imageUrl}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover rounded-xl"
        />
        {/* Lớp phủ mờ */}
        <div className="absolute inset-0 bg-black/50 rounded-xl" />
        <Button
          variant={"custom"}
          className="absolute top-8 left-10 cursor-pointer z-[1000]"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft /> Back
        </Button>
        {/* Nội dung chính */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-3">
          <p className="text-3xl p-0 mb-4 text-center text-white font-light">
            Confirm your registration
          </p>
          <Card className="w-full max-w-[30rem] p-5 h-fit">
            {/* Container chia làm 2 phần: thông tin event (1/3) & form (2/3) */}
            <div className="flex flex-col h-full gap-5 p-1">
              {/* Phần thông tin event – chiếm 1/3 chiều cao */}
              <div className="basis-1/4 flex flex-col md:flex-row justify-between items-center  bg-gradient-to-r from-[#136CB9] to-[#49BBBD] px-4 py-3 rounded-xl">
                <CardHeader className="p-0 text-left text-white flex-1 space-y-3">
                  <CardTitle className="text-xl font-semibold">
                    {event.eventName}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {event?.startDate && event?.endDate ? (
                      <p className="inline-flex items-center gap-2 text-white font-light">
                        <CalendarDays size={18} />
                        {format(new Date(event.startDate), "iiii, PP")}
                      </p>
                    ) : (
                      "Invalid date"
                    )}
                  </CardDescription>
                  <CardDescription className="text-sm text-white ">
                    <Place className="w-[22px]" />
                    {event.eventAreas
                      .map((area: EventAreas) => area.name)
                      .join(", ")}
                  </CardDescription>
                </CardHeader>
                {/* Giảm width của phần ảnh để không chiếm toàn bộ */}
                <div className="flex-1 flex justify-end">
                  <img
                    src={event.imageUrl}
                    alt="Event"
                    className="w-40 h-40 object-cover rounded-md"
                  />
                </div>
              </div>

              {/* Phần form xác nhận – chiếm 2/3 chiều cao */}
              <div className="basis-3/4 flex flex-col">
                <CardContent className="space-y-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="block mb-1 text-sm font-medium"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full"
                      value={userInfo.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="studentCode"
                      className="block mb-1 text-sm font-medium"
                    >
                      Student Code
                    </Label>
                    <Input
                      id="studentCode"
                      name="studentCode"
                      type="text"
                      placeholder="Enter your student code"
                      className="w-full"
                      value={userInfo.studentCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="block mb-1 text-sm font-medium"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full"
                      value={userInfo.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="block mb-1 text-sm font-medium"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="text"
                      placeholder="Enter your phone number"
                      className="w-full"
                      value={userInfo.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-1 p-0">
                  <Button variant="ghost" className="text-red-900 ">
                    <XCircleIcon /> Cancel
                  </Button>
                  <Button variant="custom" onClick={handleSubmit}>
                    <CheckCircle2Icon />
                    Confirm
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
