import { useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import ParticipantsList from "@/components/partial/club_owner/event-participants/ParticipantsTable";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import ParticipantsHeader from "@/components/partial/club_owner/event-participants/ParticipantsHeader";
import ParticipantsSearchBar from "@/components/partial/club_owner/event-participants/ParticipantsSearchBar";
import { Participant, ParticipantStatus } from "@/models/Participants";

// Mock data - Replace with actual API call
const mockParticipants: Participant[] = [
  {
    id: "1",
    fullname: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    studentId: "SE123456",
    avatar: "https://github.com/shadcn.png",
    registrationDate: new Date("2024-03-20"),
    status: "CHECKED_IN",
  },
  {
    id: "2",
    fullname: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0987654321",
    studentId: "SE654321",
    avatar: "https://github.com/shadcn.png",
    registrationDate: new Date("2024-03-19"),
    status: "WAITING",
  },
  {
    id: "3",
    fullname: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0369852147",
    studentId: "SE987654",
    avatar: "https://github.com/shadcn.png",
    registrationDate: new Date("2024-03-18"),
    status: "WAITING",
  },
];

const EventParticipants = () => {
  const [isLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ParticipantStatus | "all">(
    "all"
  );
  const [participants] = useState<Participant[]>(mockParticipants);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filter participants list
  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      participant.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.studentId.toLowerCase().includes(searchTerm.toLowerCase());

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
          <Button variant={"custom"} onClick={() => navigate(-1)}>
            <ChevronLeft /> Back
          </Button>

          <ParticipantsHeader
            universityName={user?.universityName}
            totalParticipants={totalParticipants}
            checkedInCount={checkedInCount}
            waitingCount={waitingCount}
            participants={participants}
          />

          <ParticipantsSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />

          <ParticipantsList participants={filteredParticipants} />
        </div>
      )}
    </React.Suspense>
  );
};

export default EventParticipants;
