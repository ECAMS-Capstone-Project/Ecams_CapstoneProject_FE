import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ClubResponse } from "@/models/Club";

interface DateTimeCardProps {
  club: ClubResponse;
}

export const DateTimeCard: React.FC<DateTimeCardProps> = ({ club }) => {
  // const navigate = useNavigate();
  return (
    <div className="rounded-lg bg-white p-7 shadow space-y-6">
      <div className="space-y-4">
        <h3 className="mb-2 text-left text-2xl font-semibold">Date & time</h3>
        <p className="text-gray-700">
          {club.foundingDate
            ? format(new Date(club.foundingDate), "iiii, PP")
            : "Invalid date"}
        </p>
      </div>
      <div>
        <Button
          variant="custom"
          className="w-full p-6 mt-5 font-light text-md"
          onClick={() => {}}
        >
          Join now
        </Button>
        {/* <button
          className="w-full p-3.5 mt-0 font-light text-md text-slate-500"
          onClick={() =>
            navigate("/student/events/success", {
              state: {
                event: event,
                previousPage: location.pathname,
                breadcrumb: event.eventName,
              },
            })
          }
        >
          No Refunds
        </button> */}
      </div>
    </div>
  );
};
