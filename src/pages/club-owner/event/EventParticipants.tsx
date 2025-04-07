import { useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import ParticipantsList from "@/components/partial/club_owner/event-participants/ParticipantsTable";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ParticipantsHeader from "@/components/partial/club_owner/event-participants/ParticipantsHeader";
import ParticipantsSearchBar from "@/components/partial/club_owner/event-participants/ParticipantsSearchBar";
import { ParticipantStatus } from "@/models/Participants";
import { useEventDetail } from "@/hooks/club/useEventDetail";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

const EventParticipants = () => {
  const [isLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ParticipantStatus | "all">(
    "all"
  );
  const { eventId = "" } = useParams();
  const { state } = useLocation();
  const eventName = state?.eventName;
  const previousPage = state?.previousPath;

  const navigate = useNavigate();
  const { participants } = useEventDetail(eventId, 10, 1);

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

  // Calculate statistics
  const totalParticipants = participants.length;
  const checkedInCount = participants.filter(
    (p) => p.status === "CHECKED_IN"
  ).length;
  const waitingCount = participants.filter(
    (p) => p.status === "WAITING"
  ).length;

  return (
    <React.Suspense fallback={<LoadingAnimation />}>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <div className="space-y-6">
          <Button
            variant={"custom"}
            onClick={() => {
              if (previousPage === "/club/event-check-in") {
                navigate(`/club`);
              } else {
                navigate(-2);
              }
            }}
          >
            <ChevronLeft />{" "}
            {previousPage === "/club/event-check-in"
              ? "Back to club list"
              : "Back"}
          </Button>

          <ParticipantsHeader
            eventName={eventName}
            totalParticipants={totalParticipants}
            participants={participants}
            checkedInCount={checkedInCount}
            waitingCount={waitingCount}
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
      )}
    </React.Suspense>
  );
};

export default EventParticipants;
