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

export const FreeEventConfirm = () => {
  const location = useLocation();
  const event = location.state?.event;
  const navigate = useNavigate();

  if (!event) {
    return <div>No event data found. Please navigate from the event page.</div>;
  }

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
                      Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Thanh Van"
                      className="w-full"
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
                      type="text"
                      placeholder="SE12345"
                      className="w-full"
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
                      type="email"
                      placeholder="contact@gmail.com"
                      className="w-full"
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
                      type="text"
                      placeholder="0123456789"
                      className="w-full"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-1 p-0">
                  <Button variant="ghost" className="text-red-900 ">
                    <XCircleIcon /> Cancel
                  </Button>
                  <Button variant="custom">
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
