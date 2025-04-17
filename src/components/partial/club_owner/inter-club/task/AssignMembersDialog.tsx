import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Search, Users } from "lucide-react";
import { useState } from "react";
import { ClubMemberDTO } from "@/api/club-owner/ClubByUser";

interface AssignMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (selectedIds: string[]) => void;
  members: ClubMemberDTO[];
}

export const AssignMembersDialog = ({
  isOpen,
  onClose,
  onAssign,
  members,
}: AssignMembersDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [assignAll, setAssignAll] = useState(false);

  const filteredMembers = members.filter((member) =>
    member.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    setAssignAll(checked);
    if (checked) {
      setSelectedMembers(members.map((m) => m.clubMemberId));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers([...selectedMembers, memberId]);
    } else {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    }
  };

  const handleAssign = () => {
    onAssign(selectedMembers);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] -mx-6 -mt-6 p-6 rounded-t-lg">
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assign Members
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Search and Select All */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="assign-all"
                checked={assignAll}
                onCheckedChange={handleSelectAll}
              />
              <label
                htmlFor="assign-all"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Assign all members
              </label>
            </div>
          </div>

          {/* Members List */}
          <div className="border border-[#136CB9]/20 rounded-lg">
            <div className="max-h-[300px] overflow-y-auto p-4 space-y-3">
              {filteredMembers.map((member) => (
                <div
                  key={member.clubMemberId}
                  className="flex items-center space-x-3 p-2 hover:bg-[#136CB9]/5 rounded-lg"
                >
                  <Checkbox
                    id={member.clubMemberId}
                    checked={selectedMembers.includes(member.clubMemberId)}
                    onCheckedChange={(checked) =>
                      handleSelectMember(
                        member.clubMemberId,
                        checked as boolean
                      )
                    }
                  />
                  <label
                    htmlFor={member.clubMemberId}
                    className="flex-1 flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">
                      {member.fullname}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {member.clubRoleName}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] text-white hover:opacity-90"
              onClick={handleAssign}
            >
              Assign Selected Members
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
