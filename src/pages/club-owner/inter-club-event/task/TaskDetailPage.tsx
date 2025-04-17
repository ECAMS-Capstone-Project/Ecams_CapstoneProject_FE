import { useLocation, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useInterTask } from "@/hooks/club/useInterTask";
import TaskDetailCard from "@/components/partial/club_owner/inter-club/task/TaskDetailCard";
import { TaskSubmissionList } from "@/components/partial/club_owner/inter-club/task/TaskSubmissionList";
import { TaskAssignedMembers } from "@/components/partial/club_owner/inter-club/task/TaskAssignedMembers";
import { EventClubDTO } from "@/api/representative/EventAgent";

export const TaskDetailPage = () => {
  const { eventTaskId } = useParams();
  const { getInterTaskDetailQuery } = useInterTask();
  const { data: response, isLoading } = getInterTaskDetailQuery(
    eventTaskId || ""
  );
  const { state } = useLocation();
  const currentClub = state?.currentClub as EventClubDTO;
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!response?.data) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Task not found</div>
      </div>
    );
  }

  const task = response.data;

  const submissions = [
    {
      id: "1",
      fileName: "Submission 1",
      fileUrl: "https://example.com/submission1.pdf",
      submittedAt: "2021-01-01",
      submittedBy: "John Doe",
      content: "This is the content of the submission",
      feedback: "This is the feedback of the submission",
      grade: 10,
    },
    {
      id: "2",
      fileName: "Submission 2",
      fileUrl: "https://example.com/submission2.pdf",
      submittedAt: "2021-01-02",
      submittedBy: "Jane Smith",
      content: "This is the content of the submission 2",
      feedback: "This is the feedback of the submission 2",
      grade: 9,
    },
  ];

  const assignedMembers = [
    {
      clubMemberId: "1",
      fullname: "Member 1",
      clubRoleName: "Member",
      status: "completed",
      avatar: "https://example.com/avatar1.png",
      userId: "1",
      studentId: "1",
      joinedAt: "2021-01-01",
      requestedDate: "2021-01-01",
      clubActivityPoint: 100,
      leftDate: "2021-01-01",
      email: "member1@example.com",
      leaveReason: "",
    },
  ];

  return (
    <div className="container mx-auto space-y-6">
      {/* Task Info Section */}
      <TaskDetailCard task={task} />
      {/* Tabs Section */}
      <Tabs defaultValue="submission" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submission">Submission</TabsTrigger>
          <TabsTrigger value="assigned-members">Assigned Members</TabsTrigger>
        </TabsList>
        <TabsContent value="submission" className="mt-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Submissions</h3>
            <TaskSubmissionList submissions={submissions} />
          </div>
        </TabsContent>
        <TabsContent value="assigned-members" className="mt-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Assigned Members</h3>
            <TaskAssignedMembers
              members={assignedMembers}
              currentClub={currentClub}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
