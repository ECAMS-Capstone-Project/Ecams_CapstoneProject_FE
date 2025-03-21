/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
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
  DollarSign,
  XCircleIcon,
} from "lucide-react";
import { format } from "date-fns";
import { EventAreas } from "@/models/Area";
import { Place } from "@mui/icons-material";
import useAuth from "@/hooks/useAuth";
import { usePaymentEvent } from "@/hooks/student/useEventRegister";
import { toast } from "react-hot-toast";

export const FreeEventConfirm = () => {
  const location = useLocation();
  const event = location.state?.event;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: paymentEvent } = usePaymentEvent();
  if (!event) {
    return <div>No event data found. Please navigate from the event page.</div>;
  }

  const handleSubmit = async () => {
    if (event.price > 0) {
      navigate("/events/payment-confirm", {
        state: {
          event: event,
          userInfo: user,
        },
      });
    } else {
      try {
        await paymentEvent(
          {
            studentId: user?.userId || "",
            eventId: event.eventId,
          },

          {
            onSuccess: () => {
              navigate("/student/events/success", {
                state: {
                  event: event,
                },
              });
            },
            onError: (error) => {
              console.error("Payment failed:", error);
              toast.error(error?.response?.data?.message || "Payment failed");
            },
          }
        );
      } catch (error) {
        console.error("Payment failed:", error);
        toast.error("Register event failed!");
      }
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
                  {event.price > 0 && (
                    <CardDescription className="text-sm text-white flex items-center gap-2">
                      <DollarSign size={18} />
                      {event.price.toLocaleString()} VND
                    </CardDescription>
                  )}
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
                      value={user?.fullname}
                      required
                    />
                  </div>

                  {/* <div>
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
                      value={user?.}
                      onChange={handleInputChange}
                      required
                    />
                  </div> */}

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
                      value={user?.email}
                      // onChange={handleInputChange}
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
                      value={user?.phonenumber}
                      required
                    />
                  </div>

                  {event.price > 0 && (
                    <button className="w-full p-2 mt-0 font-light text-md text-slate-500 italic">
                      Please note that this event is non-refundable.
                    </button>
                  )}
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
