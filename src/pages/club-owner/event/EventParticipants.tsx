/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import ParticipantsList from "@/components/partial/club_owner/event-participants/ParticipantsTable";
import { useLocation } from "react-router-dom";
import ParticipantsSearchBar from "@/components/partial/club_owner/event-participants/ParticipantsSearchBar";
import { Participant, ParticipantStatus } from "@/models/Participants";
import { useEventDetail } from "@/hooks/club/useEventDetail";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import ParticipantsHeader from "@/components/partial/staff/staff-events/event-participants/ParticipantsHeader";
import { ClubEventFeedback } from "./EventFeedback";
import { Separator } from "@/components/ui/separator";
import ParticipantPagination from "@/components/partial/staff/staff-events/event-participants/ParticipantPagination";
import { GetEventParticipants } from "@/api/club-owner/ClubEvent";

interface props {
  eventId: string;
}
const EventParticipants = ({ eventId }: props) => {
  const [isLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ParticipantStatus | "all">(
    "all"
  );
  const { state } = useLocation();
  const eventName = state?.eventName;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const { participants, totalPages } = useEventDetail(
    eventId,
    searchTerm ? 999 : pageSize,
    currentPage
  );
  // Fetching participants data for the full list (without pagination)
  const [allParticipants, setAllParticipants] = useState<Participant[]>();

  useEffect(() => {
    const fetchAllParticipants = async () => {
      const participant = await GetEventParticipants(eventId, 999, currentPage);
      setAllParticipants(participant.data?.data);
    };

    fetchAllParticipants();
  }, [eventId, totalPages, currentPage]);
  console.log("all", allParticipants);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  // Filter participants list
  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      participant.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.studentDetailId
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || participant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics based on all participants
  const totalParticipants = allParticipants && allParticipants.length;
  const checkedInCount =
    allParticipants &&
    allParticipants.filter((p) => p.status === "CHECKED_IN").length;
  const waitingCount =
    allParticipants &&
    allParticipants.filter((p) => p.status === "WAITING").length;

  return (
    <React.Suspense fallback={<LoadingAnimation />}>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="space-y-6">
            <ParticipantsHeader
              eventName={eventName}
              totalParticipants={totalParticipants || 0}
              participants={participants}
              checkedInCount={checkedInCount || 0}
              waitingCount={waitingCount || 0}
            />

            {participants.length > 0 ? (
              <>
                <ParticipantsSearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                />
                <ParticipantsList participants={filteredParticipants} />
                <ParticipantPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="flex justify-center items-center h-full mt-10">
                <AnimatedGradientText>
                  <span
                    className={
                      "inline animate-gradient bg-gradient-to-r from-[#136CB5] via-[#6A5ACD] to-[#49BBBD] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent text-4xl text-bold"
                    }
                  >
                    There is no participant in this event!
                  </span>
                </AnimatedGradientText>
              </div>
            )}
          </div>
          <Separator className="my-8" />
          <div className="mt-4">
            <ClubEventFeedback eventId={eventId} />
          </div>
        </>
      )}
    </React.Suspense>
  );
};

export default EventParticipants;
