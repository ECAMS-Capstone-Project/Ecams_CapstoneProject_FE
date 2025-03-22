import { Users } from "lucide-react";
import ExportToExcel from "./ExportParticipants";
import { Participant } from "@/models/Participants";

interface ParticipantsHeaderProps {
  universityName?: string;
  totalParticipants: number;
  checkedInCount: number;
  waitingCount: number;
  participants: Participant[];
}

const ParticipantsHeader = ({
  universityName,
  totalParticipants,
  checkedInCount,
  waitingCount,
  participants,
}: ParticipantsHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-[#136CB9]/10 to-[#49BBBD]/10 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-[#136CB9]">
            Event Participants
          </h2>
          <p className="text-gray-500">
            View and manage all participants of {universityName}
          </p>
        </div>
        <ExportToExcel data={participants} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#136CB9]/10 rounded-full">
              <Users className="h-5 w-5 text-[#136CB9]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Participants</p>
              <p className="text-xl font-semibold text-[#136CB9]">
                {totalParticipants}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#49BBBD]/10 rounded-full">
              <Users className="h-5 w-5 text-[#49BBBD]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Checked In</p>
              <p className="text-xl font-semibold text-[#49BBBD]">
                {checkedInCount}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Users className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Waiting</p>
              <p className="text-xl font-semibold text-yellow-600">
                {waitingCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsHeader;
