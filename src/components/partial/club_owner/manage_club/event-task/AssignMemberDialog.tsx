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
  import { InterTask } from "@/models/InterTask";
  // import { GetAIRecommendation } from "@/api/club-owner/InterEventTask";
  import { toast } from "react-hot-toast";
  import { Badge } from "@/components/ui/badge";
import { MemberInfoDialog } from "./AssignMemberInfoDialog";
import { MemberInTaskDTO } from "@/api/club-owner/TaskAPI";
  
  interface AssignMembersDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (selectedIds: string[]) => void;
    members: MemberInTaskDTO[];
    task?: InterTask;
  }
  
  interface RelatedTask {
    taskId: string;
    taskName: string;
    description: string;
    startTime: string;
    deadline: string;
    status: boolean;
  }
  
  interface AIRecommendResponse {
    memberId: string;
    fullName: string;
    reason: string;
    relatedTasks: RelatedTask[];
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
    const [aiRecommendations] = useState<AIRecommendResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMember, setSelectedMember] = useState<MemberInTaskDTO | null>(
      null
    );
  
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
  
    const handleAIRecommend = async () => {
      try {
        setIsLoading(true);
        // const response = await GetAIRecommendation({
        //   ...task,
        //   taskName: task.taskName,
        //   taskDescription: task.description,
        //   allMembers: [
        //     {
        //       userId: members[0].userId,
        //       clubMemberId: members[0].clubMemberId,
        //       fullName: members[0].fullname,
        //       taskHistories: [
        //         {
        //           taskId: task.eventTaskId,
        //           taskName: task.taskName,
        //           taskDescription: task.description,
        //           startDate: task.startTime,
        //           endDate: task.deadline,
        //           submittedDate: new Date(),
        //         },
        //       ],
        //     },
        //   ],
        // });
        // if (response.data) {
        //   setAIRecommendations(response.data);
        //   setSelectedMembers(
        //     response.data.map((rec: AIRecommendResponse) => rec.memberId)
        //   );
        //   setAssignAll(true);
        // }
      } catch (error: unknown) {
        console.error("Failed to get AI recommendations:", error);
        toast.error("Failed to get AI recommendations");
      } finally {
        setIsLoading(false);
      }
    };
  
    const getMemberRecommendation = (memberId: string) => {
      return aiRecommendations.find((rec) => rec.memberId === memberId);
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
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="assign-all"
                      checked={assignAll}
                      onCheckedChange={handleSelectAll}
                      className="border-gray-300 data-[state=checked]:bg-[#136CB9] data-[state=checked]:border-[#136CB9]"
                    />
                    <label
                      htmlFor="assign-all"
                      className="text-sm font-medium text-gray-700"
                    >
                      Select all members
                    </label>
                  </div>
                  <Button
                    onClick={handleAIRecommend}
                    disabled={isLoading}
                    className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
                    px-6 py-2 rounded-lg font-semibold transition-all duration-300 
                    hover:scale-105 hover:shadow-lg group"
                  >
                    <span
                      className="absolute inset-0 before:content-[''] before:absolute before:top-0 before:left-[-75%] 
                      before:w-[50%] before:h-full before:bg-white before:opacity-20 before:rotate-12
                      before:animate-none group-hover:before:animate-shine pointer-events-none"
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {isLoading ? "Is loading..." : "AI Recommendation"}
                    </span>
                  </Button>
                </div>
              </div>
  
              {/* Members List */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.clubMemberId}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
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
                        className="border-gray-300 data-[state=checked]:bg-[#136CB9] data-[state=checked]:border-[#136CB9]"
                      />
                      <label
                        htmlFor={member.clubMemberId}
                        className="flex-1 flex items-center justify-between cursor-pointer"
                      >
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-gray-900">
                            {member.fullname}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {member.clubRoleName}
                            </Badge>
                            {getMemberRecommendation(member.clubMemberId) && (
                              <Badge
                                variant="outline"
                                className="bg-indigo-50 text-indigo-700 border-indigo-200"
                              >
                                Recommended
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
                  Hủy
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] text-white hover:opacity-90"
                  onClick={handleAssign}
                  disabled={selectedMembers.length === 0}
                >
                  Phân công ({selectedMembers.length})
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
  
        {selectedMember && (
          <MemberInfoDialog
            isOpen={!!selectedMember}
            onClose={() => setSelectedMember(null)}
            member={selectedMember}
            recommendation={getMemberRecommendation(selectedMember.clubMemberId)}
          />
        )}
      </>
    );
  };