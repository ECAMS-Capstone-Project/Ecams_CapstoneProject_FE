import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import {
  EventTaskDetail,
  InterTask,
  InterTaskSubmission,
} from "@/models/InterTask";
import { SubmissionItem } from "./SubmissionItem";

interface SubmissionListProps {
  submissions: InterTaskSubmission[] | undefined;
  onAssignMembers: () => void;
  onViewSubmission: (submission: InterTaskSubmission) => void;
  subTask: EventTaskDetail;
  task: InterTask;
}

export const SubmissionList = ({
  submissions,
  onAssignMembers,
  onViewSubmission,
  subTask,
  task,
}: SubmissionListProps) => {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-[#136CB9] flex items-center gap-2">
            Submissions
          </h3>
          {subTask.status.toLowerCase() !== "completed" &&
            subTask.status.toLowerCase() !== "overdue" &&
            task.status.toLowerCase() !== "completed" && (
              <Button
                onClick={onAssignMembers}
                className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] text-white hover:opacity-90"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Members
              </Button>
            )}
        </div>
        {submissions && submissions.length > 0 ? (
          <>
            {submissions.map((submission: InterTaskSubmission, index) => (
              <SubmissionItem
                key={submission.clubMemberId}
                submission={submission}
                index={index}
                onClick={onViewSubmission}
              />
            ))}
          </>
        ) : (
          <p className="text-gray-500 italic">No submissions yet.</p>
        )}
      </CardContent>
    </Card>
  );
};
