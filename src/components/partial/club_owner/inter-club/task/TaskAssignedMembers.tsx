import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, UserPlus } from "lucide-react";
import { useState } from "react";
import { AssignMembersDialog } from "./AssignMembersDialog";
import { useClub } from "@/hooks/club/useClub";
import { EventClubDTO } from "@/api/representative/EventAgent";
import { ClubMemberDTO } from "@/api/club-owner/ClubByUser";

interface TaskAssignedMembersProps {
  members: ClubMemberDTO[];
  onAssignMembers?: (selectedIds: string[]) => void;
  currentClub: EventClubDTO;
}

const statusColors = {
  completed: "bg-green-100 text-green-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  not_started: "bg-gray-100 text-gray-800",
};

const statusLabels = {
  completed: "Completed",
  in_progress: "In Progress",
  not_started: "Not Started",
};

export const TaskAssignedMembers = ({
  members,
  onAssignMembers,
  currentClub,
}: TaskAssignedMembersProps) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const { members: clubMembers } = useClub(currentClub.clubId);
  const availableMembers = clubMembers.filter(
    (member) => member.clubRoleName !== "CLUB_OWNER"
  );

  const handleAssign = (selectedIds: string[]) => {
    onAssignMembers?.(selectedIds);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsAssignDialogOpen(true)}
          className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] text-white hover:opacity-90"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Assign Members
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          There are no members assigned to this task!
        </div>
      ) : (
        <div className="space-y-4">
          {members.map((member) => (
            <Card key={member.clubMemberId}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  {member.fullname}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Role: {member.clubRoleName}
                    </p>
                    <Badge
                      variant="secondary"
                      className={
                        statusColors[member.status as keyof typeof statusColors]
                      }
                    >
                      {statusLabels[member.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AssignMembersDialog
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        onAssign={handleAssign}
        members={availableMembers}
      />
    </div>
  );
};
