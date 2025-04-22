/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Search, Users, Eye, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  AvailableMember,
  EventTaskDetail,
  UpdateInterTaskRequest,
  InterTask,
} from "@/models/InterTask";
// import { GetAIRecommendation } from "@/api/club-owner/InterEventTask";
import { toast } from "react-hot-toast";
import { MemberInfoDialog } from "./MemberInfoDialog";
import { Badge } from "@/components/ui/badge";
import { ClubMemberDTO } from "@/api/club-owner/ClubByUser";
import { GetAIRecommendation } from "@/api/club-owner/InterEventTask";
import { EventClubDTO } from "@/api/representative/EventAgent";
import { fixTime } from "@/lib/utils";
import { InterClubEventDTO } from "@/models/Event";

interface AssignMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (
    taskId: string,
    data: Partial<UpdateInterTaskRequest>
  ) => Promise<void>;
  members: AvailableMember[] | ClubMemberDTO[];
  subTask: EventTaskDetail;
  currentClub: EventClubDTO;
  task: InterTask;
  selectedEvent: InterClubEventDTO;
}

export const AssignMembersDialog = ({
  isOpen,
  onClose,
  onAssign,
  members,
  subTask,
  task,
  currentClub,
  selectedEvent,
}: AssignMembersDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [, setAssignAll] = useState(false);
  const [aiRecommendations, setAIRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [selectedMember, setSelectedMember] = useState<
    AvailableMember | ClubMemberDTO | null
  >(null);

  const filteredMembers = members.filter((member) => {
    if (!member) return false;
    const availableMember = member as AvailableMember;
    const clubMember = member as ClubMemberDTO;
    return (
      (availableMember.fullName?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (clubMember.fullname?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )
    );
  });

  const handleSelectMember = (memberId: string, checked: boolean) => {
    console.log(
      `Checkbox for member ${memberId} is ${checked ? "checked" : "unchecked"}`
    );

    // Check if the task detail is selected and update the selectedMembers accordingly
    setSelectedMembers((prevSelectedMembers) => {
      if (checked) {
        // Add the member to the selectedMembers if not already present
        if (!prevSelectedMembers.includes(memberId)) {
          console.log(`Adding member ${memberId} to selectedMembers`);
          return [...prevSelectedMembers, memberId];
        }
      } else {
        // Remove the member from the selectedMembers if unchecked
        console.log(`Removing member ${memberId} from selectedMembers`);
        return prevSelectedMembers.filter((id) => id !== memberId);
      }
      return prevSelectedMembers;
    });
  };
  console.log("selectedMembers", selectedMembers);
  const isMemberAssignedToSubtask = (
    currentId: string,
    eventTaskDetailId: string
  ) => {
    // Check if the member is assigned to the current task detail by matching the taskDetailId
    return currentId === eventTaskDetailId; // Adjust if you need task-specific matching logic
  };

  const handleAssign = () => {
    console.log("selectedMembers", selectedMembers);

    // Update existing subtasks with the selected members only for the relevant subtask
    const updatedSubtasks = task.eventTaskDetails.map((detail) => {
      // For the subtask being updated, assign the selected members
      if (detail.eventTaskDetailId === subTask.eventTaskDetailId) {
        return {
          ...detail,
          assignedMembers: [
            ...detail.assignedMembers,
            ...selectedMembers.map((memberId: string) => ({
              clubMemberId: memberId, // Wrap the memberId inside the expected structure
            })),
          ],
        };
      }
      // For other subtasks, keep the existing assigned members
      return detail;
    });

    const updateData: UpdateInterTaskRequest = {
      eventTaskId: task.eventTaskId,
      clubId: currentClub.clubId,
      eventId: selectedEvent.eventId,
      taskName: task.taskName,
      description: task.description,
      startTime: fixTime(new Date(task.startTime)),
      deadline: fixTime(new Date(task.deadline)),
      status: task.status || "ON_GOING", // Default value to avoid undefined
      eventTaskDetails: updatedSubtasks, // Only update the eventTaskDetails array with the modified subtask
    };

    onAssign(task.eventTaskId, updateData); // Call the onAssign function to update the task with the new data
    onClose();
  };

  const handleAIRecommend = async () => {
    try {
      setIsLoading(true);
      const response = await GetAIRecommendation(
        {
          taskName: subTask.detailName,
          taskDescription: subTask.description,
          startTime: new Date(subTask.startTime).toISOString(),
          endTime: new Date(subTask.deadline).toISOString(),
          priority: subTask.priority,
          clubId: currentClub.clubId,
          taskId: subTask.eventTaskDetailId,
        },
        currentClub.clubId
      );
      if (response.data) {
        setAIRecommendations(response.data);
        setSelectedMembers([]);
        console.log("selectedMembers when ai recommendation", selectedMembers);
        setAssignAll(true);
        setShowAIRecommendations(true);
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      console.error("Failed to get AI recommendations:", error);
      toast.error("Failed to get AI recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  const getMemberRecommendation = (memberId: string) => {
    return aiRecommendations.find((rec) => rec.clubMemberId === memberId);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] -mx-6 -mt-6 p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white text-xl flex items-center gap-2">
                <Users className="h-5 w-5" />
                Assign members
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Search and Select All */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-gray-50 border-gray-200 focus:border-[#136CB9] focus:ring-[#136CB9]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2"></div>
                <div className="flex items-center gap-2">
                  {showAIRecommendations && (
                    <Button
                      onClick={() => setShowAIRecommendations(false)}
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      Back to All Members
                    </Button>
                  )}
                  <a
                    onClick={handleAIRecommend}
                    className="click-btn btn-style501 p-3 "
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {isLoading ? "Loading..." : "AI Recommendation"}
                    </span>
                  </a>

                  {/* <center>
                    <button
                      className="codepro-custom-btn codepro-btn-6"
                      title="Code Pro"
                      onClick={() => window.open("https://www.code.pro.vn/")}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        {isLoading ? "Loading..." : "AI Recommendation"}
                      </span>
                    </button>
                  </center> */}
                </div>
              </div>
            </div>
            {error && (
              <div className="text-indigo-900 text-center">
                <p className="font-medium bg-gradient-to-br from-indigo-50 to-purple-50 w-fit mx-auto py-1 px-3 rounded-xl">
                  😢 {error}
                </p>
              </div>
            )}
            {/* Members List */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
                {(showAIRecommendations
                  ? aiRecommendations
                  : filteredMembers
                ).map((member) => (
                  <div
                    key={member.clubMemberId}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <Checkbox
                      id={member.clubMemberId}
                      checked={
                        isMemberAssignedToSubtask(
                          (member as AvailableMember).currentTasks?.find(
                            (task) =>
                              task.eventTaskDetailId ===
                              subTask.eventTaskDetailId
                          )?.eventTaskDetailId || "",
                          subTask.eventTaskDetailId
                        ) || selectedMembers.includes(member.clubMemberId)
                      }
                      onCheckedChange={(checked) =>
                        handleSelectMember(
                          member.clubMemberId,
                          checked as boolean
                        )
                      }
                      className="border-gray-300 data-[state=checked]:bg-[#136CB9] data-[state=checked]:border-[#136CB9]"
                    />
                    <label
                      htmlFor={member.clubMemberId}
                      className="flex-1 flex items-center justify-between cursor-pointer"
                    >
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-900">
                          {(member as AvailableMember).fullName ||
                            (member as ClubMemberDTO).fullname}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {member.email}
                          </Badge>
                          {getMemberRecommendation(member.clubMemberId) && (
                            <Badge
                              variant="outline"
                              className="bg-indigo-50 text-indigo-700 border-indigo-200"
                            >
                              Recommended
                            </Badge>
                          )}
                          {isMemberAssignedToSubtask(
                            (member as AvailableMember).currentTasks?.find(
                              (task) =>
                                task.eventTaskDetailId ===
                                subTask.eventTaskDetailId
                            )?.eventTaskDetailId || "",
                            subTask.eventTaskDetailId
                          ) && (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Assigned
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-gray-100"
                        onClick={() => setSelectedMember(member)}
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] text-white hover:opacity-90"
                onClick={handleAssign}
                disabled={selectedMembers.length === 0}
              >
                Assign ({selectedMembers.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedMember && (
        <MemberInfoDialog
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          member={selectedMember as AvailableMember}
          recommendation={getMemberRecommendation(selectedMember.clubMemberId)}
        />
      )}
    </>
  );
};
