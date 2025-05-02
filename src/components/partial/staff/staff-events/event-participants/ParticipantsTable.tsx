import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BookAIcon,
  EyeIcon,
  GraduationCap,
  Mail,
  Phone,
  University,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { MagicCard } from "@/components/magicui/magic-card";
import { Participant, ParticipantStatus } from "@/models/Participants";
import { Badge } from "@/components/ui/badge";

interface ParticipantsListProps {
  participants: Participant[];
}

const ParticipantsList = ({ participants }: ParticipantsListProps) => {
  const getStatusColor = (status: ParticipantStatus): string => {
    switch (status) {
      case "CHECKED_IN":
        return "bg-[#49BBBD] text-white";
      case "WAITING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {participants.map((participant) => (
        <MagicCard
          key={participant.userId}
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-[#136CB9] hover:scale-[1.02]"
          gradientColor="rgba(19, 108, 185, 0.1)"
        >
          {/* <div className="absolute inset-0  bg-gradient-to-br from-[#136CB9]/5 to-[#49BBBD]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}

          <div className="flex items-center justify-between mb-4 relative">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-[#136CB9] ring-offset-2 transition-transform duration-300 group-hover:scale-110">
                <AvatarImage src={participant.major} />
                <AvatarFallback className="bg-gradient-to-br from-[#136CB9] to-[#49BBBD] text-white">
                  {participant.fullname.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-[#136CB9] transition-colors duration-300">
                  {participant.fullname}
                </h3>
                <p className="text-sm text-gray-500">
                  {participant.studentDetailId}
                </p>
              </div>
            </div>
            <Badge
              className={`${getStatusColor(
                participant.status
              )} transition-all duration-300 group-hover:scale-105`}
            >
              {participant.status === "CHECKED_IN" ? "Checked In" : "Waiting"}
            </Badge>
          </div>

          <div className="space-y-3 relative">
            <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-[#136CB9] transition-colors duration-300">
              <Mail className="h-4 w-4 text-[#136CB9]" />
              <span className="truncate">{participant.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-[#136CB9] transition-colors duration-300">
              <Phone className="h-4 w-4 text-[#136CB9]" />
              <span>{participant.phonenumber}</span>
            </div>

            <div className="flex justify-end pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-[#136CB9] hover:text-[#49BBBD] hover:bg-[#136CB9]/10 transition-all duration-300"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md rounded-xl">
                  <div className="flex flex-col items-center text-center space-y-3">
                    {/* Avatar */}
                    <Avatar className="h-24 w-24 ring-4 ring-[#136CB9] ring-offset-2 shadow-md">
                      <AvatarImage src={participant.major} />
                      <AvatarFallback className="bg-gradient-to-br from-[#136CB9] to-[#49BBBD] text-white text-3xl font-bold">
                        {participant.fullname.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Tên + Mã SV */}
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">
                        {participant.fullname}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {participant.studentDetailId}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-6">
                    {/* Contact */}
                    <div>
                      <h4 className="font-medium text-[#136CB9] mb-2">
                        Contact
                      </h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-[#136CB9]" />
                          <span>{participant.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[#136CB9]" />
                          <span>{participant.phonenumber}</span>
                        </div>
                      </div>
                    </div>

                    {/* Academic */}
                    <div>
                      <h4 className="font-medium text-[#136CB9] mb-2">
                        Academic
                      </h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <University className="h-4 w-4 text-[#136CB9]" />
                          <span>{participant.universityName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-[#136CB9]" />
                          <span>{participant.major}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookAIcon className="h-4 w-4 text-[#136CB9]" />
                          <span>Year {participant.yearOfStudy}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="mt-6 text-center">
                    <Badge className={getStatusColor(participant.status)}>
                      {participant.status === "CHECKED_IN"
                        ? "Checked In"
                        : "Waiting"}
                    </Badge>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </MagicCard>
      ))}
    </div>
  );
};

export default ParticipantsList;
