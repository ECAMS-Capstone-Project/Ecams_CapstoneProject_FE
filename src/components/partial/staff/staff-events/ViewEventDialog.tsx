import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export const EventDetail: React.FC = () => {
  const { eventId = "" } = useParams();
  const { getEventDetailQuery } = useEvents();
  const navigate = useNavigate();
  const {
    data: eventDetail,
    isLoading: isEventDetailLoading,
    error,
  } = getEventDetailQuery(eventId);

  if (isEventDetailLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        Error loading event details: {error.message}
      </div>
    );
  }

  const event = eventDetail?.data;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <Button variant="custom" onClick={() => navigate(-1)} className="mb-2">
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
          <div className="p-6 space-y-8">
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
                      ? `${format(new Date(event.startDate), "PP")} - ${format(
                          new Date(event.endDate),
                          "PP"
                        )}`
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
                        )} - ${format(new Date(event.registeredEndDate), "PP")}`
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
                    {event?.eventAreas?.map((area) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};
