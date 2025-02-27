/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { DenyEventRequest } from "./DenyEvent";
import { useState } from "react";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import { useNavigate, useParams } from "react-router-dom";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";

export const RequestEventDetail: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { approveEvent, isApproving, getEventDetailQuery } = useEvents();
  const { eventId = "" } = useParams();
  const navigate = useNavigate();
  async function handleApprove() {
    try {
      console.log("Approving Event...");
      // Call API để cập nhật status thành "Active"

      await approveEvent(eventId);
      navigate("/representative/event");
    } catch (error: any) {
      const errorMessage = error.response.data.message || "An error occurred";
      console.log(errorMessage);
    }
  }
  const { data: eventDetail } = getEventDetailQuery(eventId);
  const event = eventDetail?.data;
  return (
    <div className="min-h-[200px] sm:min-h-[300px] h-auto sm:min-w-[300px]">
      {isApproving ? (
        <div className="flex justify-center items-center h-full w-full">
          <LoadingAnimation />
        </div>
      ) : (
        <div>
          <div className="container mx-auto px-4">
            {/* Heading */}
            <Button
              variant="custom"
              onClick={() => navigate(-1)}
              className="mb-2"
            >
              <ArrowLeft size={24} />
            </Button>
            <Heading
              title="Manage Events"
              description="Manage Event in the system"
            />

            <div className="bg-white rounded-xl shadow-xl overflow-hidden mt-8">
              {/* Banner */}
              <div className="relative">
                <img
                  src={event?.imageUrl}
                  alt={event?.eventName}
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center">
                  <h1 className="text-4xl font-bold text-white drop-shadow-md">
                    {event?.eventName}
                  </h1>
                  <p className="mt-2 text-lg text-gray-200 drop-shadow-md">
                    {event?.clubName || event?.representativeName}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8 ml-3">
                {/* Event Information */}
                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Event Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600">Status:</p>
                      <p
                        className={`font-semibold text-lg ${
                          event?.status === "ACTIVE"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {event?.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Price:</p>
                      <p className="font-semibold text-lg">{`${event?.price.toLocaleString()} VND`}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Event Duration:</p>
                      <p className="font-semibold text-lg">
                        {event?.startDate && event?.endDate
                          ? `${format(
                              new Date(event.startDate),
                              "PP"
                            )} - ${format(new Date(event.endDate), "PP")}`
                          : "Invalid event dates"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Registered Range:</p>
                      <p className="font-semibold text-lg">
                        {event?.registeredStartDate && event?.registeredEndDate
                          ? `${format(
                              new Date(event.registeredStartDate),
                              "PP"
                            )} - ${format(
                              new Date(event.registeredEndDate),
                              "PP"
                            )}`
                          : "Invalid dates"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Max Participants:</p>
                      <p className="font-semibold text-lg">
                        {event?.maxParticipants} people
                      </p>
                    </div>
                  </div>
                </section>

                {/* Event Areas */}
                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Event Areas
                  </h2>
                  <div className="overflow-x-auto rounded-lg shadow-md  mx-6 bg-transparent">
                    <table className="min-w-full divide-y divide-gray-200 px-6 rounded-lg shadow-md">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Area Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Start Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            End Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {event?.eventAreas?.map((area: any) => (
                          <tr key={area.areaId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {area.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {format(new Date(area.startDate), "P")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {format(new Date(area.endDate), "P")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Event Description */}
                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {event?.description}
                  </p>
                </section>
                <div className="flex justify-center w-full space-x-1">
                  <Button
                    onClick={handleApprove}
                    className="w-1/4 sm:w-1/4 text-lg bg-[#D4F8E8] text-[#007B55] p-3 hover:bg-[#C2F2DC] hover:text-[#005B40] transition duration-300 ease-in-out"
                  >
                    <CheckCircle2 size={18} /> Approve
                  </Button>

                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="w-1/4 sm:w-1/4 text-lg bg-[#F8D7DA] text-[#842029] p-3 hover:bg-[#F4C2C5] hover:text-[#6A1B20] transition duration-300 ease-in-out"
                  >
                    <XCircle size={18} /> Reject
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DenyEventRequest
              eventId={event?.eventId ?? ""}
              onClose={() => {
                setIsDialogOpen(false); // Đóng dialog phụ
              }}
              dialogAction={"reject"}
            />
          </Dialog>
        </div>
      )}
    </div>
  );
};
