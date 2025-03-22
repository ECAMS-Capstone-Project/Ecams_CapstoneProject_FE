import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

type ParticipantStatus = "CHECKED_IN" | "WAITING";

interface ParticipantsSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: ParticipantStatus | "all";
  onStatusChange: (value: ParticipantStatus | "all") => void;
}

const ParticipantsSearchBar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: ParticipantsSearchBarProps) => {
  const handleValueChange = (value: ParticipantStatus | "all") => {
    if (value === statusFilter) {
      onStatusChange("all");
    } else {
      onStatusChange(value);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white p-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search by name, email or student ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-gray-200 focus:border-[#96c2e8] focus:ring-[#96c2e8] shadow-md"
        />
      </div>
      <Select value={statusFilter} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px] text-white bg-gradient-to-r from-[#136CB9] to-[#49BBBD] focus:border-[#136CB9] focus:ring-[#136CB9] shadow-md">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="CHECKED_IN">Checked In</SelectItem>
          <SelectItem value="WAITING">Waiting</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ParticipantsSearchBar;
