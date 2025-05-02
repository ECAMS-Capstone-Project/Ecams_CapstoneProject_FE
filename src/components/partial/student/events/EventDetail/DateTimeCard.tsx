/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Event } from "@/models/Event";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { RefundFormPopup, RefundFormData } from "./RefundFormPopup";
import { useEventSchedule } from "@/hooks/student/useEventRegister";
import useAuth from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

interface DateTimeCardProps {
  event: Event;
}

export const DateTimeCard: React.FC<DateTimeCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const [isRefundPopupOpen, setIsRefundPopupOpen] = useState(false);
  const { user } = useAuth();
  const { refundEvent, isRefunding } = useEventSchedule(user?.userId ?? "");
  const queryClient = useQueryClient();
  const handleRefundSubmit = async (data: RefundFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    await refundEvent(formData);
    queryClient.invalidateQueries({
      queryKey: ["eventDetail", event.eventId, user?.userId],
    });
    !isRefunding && setIsRefundPopupOpen(false);
    // Tự động refetch danh sách ✅
  };

  const isRequestRefund =
    event.eventRegistrations?.find((student) => student.userId == user?.userId)
      ?.refundInforStatus === "UPDATED";

  return (
    <div className="rounded-lg bg-white p-8 shadow space-y-6 w-3/5">
      <div className="space-y-4">
        <h3 className="mb-2 text-left text-2xl font-semibold">Date & time</h3>
        <p className="text-gray-700 flex items-center gap-2">
          <Calendar size={18} />
          {event?.startDate
            ? format(new Date(event.startDate), "iiii, PP")
            : "Invalid date"}
        </p>
      </div>
      <div>
        {event.status !== "ENDED" &&
          (event.registrationStatus === null ? (
            <Button
              variant="custom"
              className="w-full p-6 mt-5 font-light text-md"
              onClick={() => {
                if (event.price === 0) {
                  navigate("/student/events/free-confirmation", {
                    state: {
                      event: event,
                      previousPage: location.pathname,
                      breadcrumb: event.eventName,
                    },
                  });
                } else {
                  navigate("/student/events/fee-confirmation", {
                    state: {
                      event: event,
                      previousPage: location.pathname,
                      breadcrumb: event.eventName,
                    },
                  });
                }
              }}
            >
              Register now
            </Button>
          ) : (
            <Button className="w-full p-6 mt-5 font-light text-md cursor-default bg-slate-400 text-white">
              You have joined this event!
            </Button>
          ))}
        {event.status.toLowerCase() == "canceled" && (
          <Button
            className="w-full p-6 mt-5 font-light text-md bg-red-500 text-white hover:bg-red-600"
            onClick={() => setIsRefundPopupOpen(true)}
          >
            {isRequestRefund ? "Your refund is pending!" : "Request Refund"}
          </Button>
        )}
      </div>

      <RefundFormPopup
        isOpen={isRefundPopupOpen}
        onClose={() => setIsRefundPopupOpen(false)}
        onSubmit={handleRefundSubmit}
        event={event}
        isRefunding={isRefunding}
      />
    </div>
  );
};
