import { useLocation, useNavigate } from "react-router-dom";
import { EventClubDTO } from "@/api/representative/EventAgent";
import { Card } from "@/components/ui/card";
import {
  EventTaskDetail,
  InterTask,
  InterTaskSubmission,
  UpdateInterTaskRequest3,
} from "@/models/InterTask";
import { useState } from "react";
import { AssignMembersDialog } from "@/components/partial/club_owner/inter-club/task/AssignMembersDialog";
import { toast } from "react-hot-toast";
import { useInterTask } from "@/hooks/club/useInterTask";
import { useClub } from "@/hooks/club/useClub";
import { ClubMemberDTO } from "@/api/club-owner/ClubByUser";
import useAuth from "@/hooks/useAuth";
import saveAs from "file-saver";
import JSZip from "jszip";
import { SubtaskHeader } from "@/components/partial/club_owner/inter-club/task/sub-task/SubtaskHeader";
import { SubtaskInfo } from "@/components/partial/club_owner/inter-club/task/sub-task/SubtaskInfo";
import { SubmissionList } from "@/components/partial/club_owner/inter-club/task/sub-task/SubmissionList";
import { SubmissionDetailDialog } from "@/components/partial/club_owner/inter-club/task/sub-task/SubmissionDetailDialog";
import { useQueryClient } from "@tanstack/react-query";
export const SubtaskDetailPage = () => {
  const { state } = useLocation();
  const queryClient = useQueryClient();
  const currentClub = state?.currentClub as EventClubDTO;
  const subtask = state?.subTask as EventTaskDetail;
  const task = state?.task as InterTask;
  const navigate = useNavigate();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<InterTaskSubmission | null>(null);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const { members: clubMembers } = useClub(currentClub.clubId);
  const { user } = useAuth();
  const {
    getAvailableMemberQuery,
    updateInterEventTask3,
    getInterTaskSubmissionQuery,
    reviewInterTaskSubmission,
  } = useInterTask();
  const { data: availableMembers } = getAvailableMemberQuery(
    currentClub.clubId,
    new Date(subtask?.startTime || "").toISOString(),
    new Date(subtask?.deadline || "").toISOString(),
    subtask?.priority || "",
    subtask.eventTaskDetailId
  );
  const availableClubMembers = clubMembers?.filter(
    (member: ClubMemberDTO) => member.clubRoleName !== "CLUB_OWNER"
  );

  const { data: submissionsData } = getInterTaskSubmissionQuery(
    subtask.eventTaskDetailId,
    "",
    "",
    10,
    1
  );
  const submissions = submissionsData?.data?.data;

  const membersSelected = submissions && submissions.map(item => ({
    clubMemberId: item.clubMemberId,
  })) || [];

  const handleAssignMembers = async (updateData: UpdateInterTaskRequest3) => {
    updateData.priority = subtask.priority
    updateData.eventTaskDetailId = subtask.eventTaskDetailId
    await updateInterEventTask3({ subtask: updateData, eventTaskDetailId: subtask.eventTaskDetailId });
    setIsAssignDialogOpen(false);
    queryClient.invalidateQueries({
      queryKey: [
        "interTaskSubmission",
        subtask.eventTaskDetailId,
        "",
        "",
        10,
        1,
      ],
    });
  };

  const handleViewSubmission = (submission: InterTaskSubmission) => {
    setSelectedSubmission(submission);
    setScore(submission.submissionScore || 0);
    setFeedback(submission.comment || "");
  };

  const handleSaveFeedback = async () => {
    try {
      if (score < 0 || score > 10) {
        toast.error("Score must be between 0 and 10");
        return;
      }
      setIsSubmitting(true);
      await reviewInterTaskSubmission({
        eventTaskDetailId: selectedSubmission?.eventTaskDetailId || "",
        clubMemberId: selectedSubmission?.clubMemberId || "",
        comment: feedback,
        submissionScore: score,
        reviewedBy: user?.userId || "",
      });
      setSelectedSubmission(null);
    } catch (error) {
      console.error("Failed to save feedback", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadAll = async () => {
    if (
      selectedSubmission?.submissionFile &&
      selectedSubmission.submissionFile.length > 0
    ) {
      const zip = new JSZip();

      // Add each file to the zip
      selectedSubmission.submissionFile.forEach((fileUrl, index) => {
        const fileName = fileUrl.split("/").pop(); // You can adjust this logic if file name extraction is different
        fetch(fileUrl)
          .then((response) => response.blob())
          .then((blob) => {
            if (fileName) {
              zip.file(fileName, blob);
            }

            // If this is the last file, generate the zip
            if (index === selectedSubmission.submissionFile.length - 1) {
              zip.generateAsync({ type: "blob" }).then((content) => {
                // Save the zip file
                saveAs(content, "submission_files.zip");
              });
            }
          })
          .catch((error) => {
            console.error("Error downloading file:", error);
          });
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-[#136CB9]/10 to-[#49BBBD]/10 p-4 rounded-lg border border-[#136CB9]/20">
        <SubtaskHeader subtask={subtask} onBack={() => navigate(-1)} />
        <SubtaskInfo subtask={subtask} />
      </Card>

      <SubmissionList
        submissions={submissions}
        onAssignMembers={() => setIsAssignDialogOpen(true)}
        onViewSubmission={handleViewSubmission}
      />

      <AssignMembersDialog
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        onAssign={handleAssignMembers}
        members={
          Array.isArray(availableMembers?.data)
            ? availableMembers.data
            : availableClubMembers
        }
        subTask={subtask}
        task={task}
        clubId={task.clubId}
        memberSelected={membersSelected}
      />

      <SubmissionDetailDialog
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        score={score}
        feedback={feedback}
        onScoreChange={setScore}
        onFeedbackChange={setFeedback}
        onSaveFeedback={handleSaveFeedback}
        isSubmitting={isSubmitting}
        onDownloadAll={handleDownloadAll}
        subtask={subtask}
      />
    </div>
  );
};
