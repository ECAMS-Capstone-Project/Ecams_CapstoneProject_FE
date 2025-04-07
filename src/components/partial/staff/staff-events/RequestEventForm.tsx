/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  CheckCircle2,
  CheckCircle2Icon,
  CircleEllipsis,
  CornerDownLeftIcon,
  XCircle,
  XCircleIcon,
} from "lucide-react";
import { DenyEventRequest } from "./DenyEvent";
import { useState } from "react";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import { useNavigate, useParams } from "react-router-dom";
import LoadingAnimation from "@/components/ui/loading";
import EventWalletPicker from "./WalletPicker";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";

export const RequestEventDetail: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const { approveEvent, isApproving, getEventDetailQuery } = useEvents();
  const { user } = useAuth();
  const { eventId = "" } = useParams();
  const navigate = useNavigate();
  async function handleApprove() {
    try {
      console.log("Approving Event...");
      // Call API để cập nhật status thành "Active"

      await approveEvent({ eventId, walletId: selectedWalletId ?? "" });

      navigate("/representative/event");
    } catch (error: any) {
      const errorMessage = error.response.data.message || "An error occurred";
      console.log(errorMessage);
    }
  }
  const { data: eventDetail } = getEventDetailQuery(
    eventId,
    user?.userId ?? ""
  );
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
            <div className="flex justify-start items-center gap-2">
              <CornerDownLeftIcon
                size={24}
                onClick={() => navigate(-1)}
                className="cursor-pointer stroke-[#136CB5] hover:stroke-[#36b6b9] transition duration-300"
              />

              <h2 className="font-bold text-3xl  bg-gradient-to-r from-[#136CB5] to-[#49BBBD] bg-clip-text text-transparent">
                Event's Request Detailed Information
              </h2>
            </div>

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
                    {Array.isArray(event?.clubs)
                      ? event?.clubs.map((club) => club.clubName).join(", ")
                      : event?.representativeName}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8 ml-3">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Event Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600">Price:</p>
                      <p className="font-semibold text-lg">{`${
                        event?.price == 0
                          ? "FREE"
                          : event?.price.toLocaleString() + " VND"
                      }`}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Max Participants:</p>
                      <p className="font-semibold text-lg">
                        {event?.maxParticipants} people
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Training Point:</p>
                      <p className="font-semibold text-lg">
                        {event?.trainingPoint} points
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

                {/* Status Description */}

                <section className="flex items-center gap-2">
                  <h3 className="text-2xl font-semibold text-gray-800 ">
                    Status:
                  </h3>
                  <span
                    className={`font-semibold text-lg gap-1 py-1 px-2 rounded-md flex items-center justify-center ${
                      event?.status === "ACTIVE"
                        ? "bg-[#CBF2DA] text-[#2F4F4F]"
                        : event?.status === "PENDING"
                        ? "bg-[#FFE6CC] text-[#CC6600]"
                        : "bg-[#FFF5BA] text-[#5A3825]"
                    }`}
                  >
                    {event?.status === "ACTIVE"
                      ? "Active"
                      : event?.status === "PENDING"
                      ? "Pending"
                      : "Inactive"}

                    {event?.status === "ACTIVE" ? (
                      <CheckCircle2Icon size={19} className="text-[#2F4F4F]" />
                    ) : event?.status === "PENDING" ? (
                      <CircleEllipsis size={19} className=" text-[#CC6600]" />
                    ) : (
                      <XCircleIcon size={19} className=" text-[#5A3825]" />
                    )}
                  </span>
                </section>

                <div className="flex justify-center w-full space-x-1">
                  <Button
                    onClick={() => setIsOpen(true)}
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

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="p-4">
              <DialogHeader className="p-1">
                <DialogTitle>Select Wallet for Approval</DialogTitle>
                <DialogDescription>
                  Choose a wallet for this event to create QR code.
                </DialogDescription>
              </DialogHeader>
              <div className=" p-5">
                <Label className="mb-3">Wallet name</Label>
                <EventWalletPicker
                  value={selectedWalletId}
                  onChange={(walletId) => setSelectedWalletId(walletId)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant={"custom"}
                    onClick={() => {
                      handleApprove();
                      setIsOpen(false);
                    }}
                    disabled={!selectedWalletId}
                  >
                    Confirm Approval
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};
