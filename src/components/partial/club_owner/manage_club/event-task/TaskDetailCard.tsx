/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Clock, ArrowLeft, CircleCheck } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  EventSubmissionTaskDetail,
  GetMemberSubmissionTaskEvent,
} from "@/api/club-owner/TaskAPI";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import EventTaskBreadcrumb from "./EventTaskBreadcrumb";
import { DescriptionWithToggle } from "@/lib/DescriptionWithToggle";
import {
  EventTaskDetail,
  InterTask,
  UpdateInterTaskRequest3,
} from "@/models/InterTask";
import toast from "react-hot-toast";
import {
  AvailableMemberEventTask,
  GetAvailableMember,
} from "@/api/student/ClubAgent";
import { AssignMembersDialog } from "./AssignMemberDialog";
import { useInterTask } from "@/hooks/club/useInterTask";
import useAuth from "@/hooks/useAuth";

const TaskDetailCard = () => {
  const { taskId = "" } = useParams();
  const location = useLocation();
  const isClubOwner = location.state?.isClubOwner as boolean;
  const taskDetail = location.state?.taskDetail as EventTaskDetail;
  const clubId = location.state?.clubId as string;
  const bigTask = location.state?.bigTask as InterTask;
  const [submissionList, setSubmissionList] =
    useState<EventSubmissionTaskDetail[]>();
  const [currentPageSubmission, setCurrentPageSubmission] = useState(1);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState<boolean>(false);
  const [allStudents, setAllStudents] = useState<AvailableMemberEventTask[]>(
    []
  );
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateInterEventTask3 } = useInterTask();

  const [flag, setFlag] = useState<boolean>(false);

  useEffect(() => {
    if (!taskId) return;
    async function fetchTaskDetail() {
      try {
        const response = await GetMemberSubmissionTaskEvent(
          taskId,
          currentPageSubmission
        );
        if (response.data) {
          setSubmissionList(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch task detail", error);
      }
    }
    fetchTaskDetail();
  }, [taskId, currentPageSubmission, flag]);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await GetAvailableMember(
          clubId,
          new Date(taskDetail.startTime).toISOString(),
          new Date(taskDetail.deadline).toISOString(),
          taskDetail.priority
        );
        if (response.data) {
          setAllStudents(response.data);
        }
      } catch (error: any) {
        console.error("Failed to fetch club members", error);
      }
    }

    fetchMembers();
  }, [taskDetail, clubId]);

  const membersSelected =
    (submissionList &&
      submissionList.map((item) => ({
        clubMemberId: item.clubMemberId,
      }))) ||
    [];

  const sortedSubmissions = [
    ...(submissionList ?? []).filter((s) => s.memberEmail === user?.email),
    ...(submissionList ?? []).filter((s) => s.memberEmail !== user?.email),
  ];

  // Pagination logic for Submissions
  const itemsPerPage = 5;
  const totalPagesSubmission = Math.ceil(
    sortedSubmissions.length / itemsPerPage
  );
  const paginatedSubmissions = sortedSubmissions.slice(
    (currentPageSubmission - 1) * itemsPerPage,
    currentPageSubmission * itemsPerPage
  );

  const handleClick = (data: EventSubmissionTaskDetail) => {
    const isUserSubmission = data.memberEmail === user?.email;
    const isSubmitted = data.submissionDate !== "0001-01-01T00:00:00";

    if (isUserSubmission && isClubOwner && !isSubmitted) {
      // Club owner chính là người nộp và chưa nộp => bắt đi nộp trước
      if (
        taskDetail.taskDependencies.length > 0 &&
        !taskDetail.taskDependencies.every((p) => p.status == "COMPLETED")
      ) {
        toast.error("Task dependency has not finished");
      } else {
        if (data.status == "NOT_STARTED") {
          toast.error("This task has not started");
        } else {
          navigate("/club/task-submission-student", {
            state: { taskDetail, submission: data },
          });
        }
      }
    } else if (isClubOwner) {
      navigate("/club/task-submission", {
        state: { taskDetail, submission: data },
      });
    } else if (isUserSubmission) {
      if (
        taskDetail.taskDependencies.length > 0 &&
        !taskDetail.taskDependencies.every((p) => p.status == "COMPLETED")
      ) {
        toast.error("Task dependency has not finished");
      } else {
        if (data.status == "NOT_STARTED") {
          toast.error("Task has not started yet");
        } else {
          navigate("/club/task-submission-student", {
            state: { taskDetail, submission: data },
          });
        }
      }
    }
  };

  const handleAssignMembers = async (updateData: UpdateInterTaskRequest3) => {
    updateData.eventTaskDetailId = taskDetail.eventTaskDetailId;
    updateData.priority = taskDetail.priority;
    updateData.detailName = taskDetail.detailName;
    await updateInterEventTask3({
      subtask: updateData,
      eventTaskDetailId: taskDetail.eventTaskDetailId,
    });
    setIsAssignDialogOpen(false);
    setFlag((pre) => !pre);
  };

  return (
    <div className="max-w-full mx-auto space-y-6 ">
      <EventTaskBreadcrumb
        items={[
          { label: "Event List" },
          { label: "Task list in event" },
          { label: "Sub task list in event" },
          { label: "Sub task detail" },
        ]}
      />
      {/* Header */}
      <Card className="shadow-md bg-blue-50">
        <CardContent className="py-6 space-y-4">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#136cb9]" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">
                  {taskDetail?.detailName}
                </h1>
              </div>
            </div>
            <p className="mt-1">{taskDetail?.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-bold text-gray-700">Start Time</p>
                <p>
                  {taskDetail?.startTime
                    ? format(
                      new Date(taskDetail.startTime),
                      "dd/MM/yyyy - HH:mm a"
                    )
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-bold text-gray-700">Deadline</p>
                <p>
                  {taskDetail?.deadline
                    ? format(
                      new Date(taskDetail.deadline),
                      "dd/MM/yyyy - HH:mm a"
                    )
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {taskDetail.status == "NOT_STARTED" ? (
                <div className="flex items-center gap-2">
                  <CircleCheck className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-bold text-gray-700 ml-1.5">Status</p>
                    <p className="text-sm font-medium px-3 py-1 rounded-full bg-white text-gray-900 border border-gray-200 shadow-sm">
                      NOT_STARTED
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-bold text-gray-700 ml-1">Status</p>
                    <p
                      className={`text-sm font-medium px-2 py-0.5 rounded-full ${taskDetail.status === "ON_GOING"
                        ? "text-blue-600 bg-blue-100"
                        : taskDetail.status === "REVIEWING"
                          ? "text-yellow-600 bg-yellow-100"
                          : taskDetail.status === "COMPLETED"
                            ? "text-green-900 bg-green-300"
                            : "text-blue-600 bg-blue-200"
                        }`}
                    >
                      {taskDetail.status}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-bold text-gray-700">
                  Number of member in task
                </p>
                <p>{submissionList?.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              📥 Submissions
            </h3>
            {isClubOwner && (
              <Button
                variant={"custom"}
                onClick={() => setIsAssignDialogOpen(true)}
              >
                Assign Member
              </Button>
            )}
          </div>
          {sortedSubmissions.length > 0 ? (
            <>
              {paginatedSubmissions.map((data, index) => {
                const isUserSubmission = data.memberEmail === user?.email;
                return (
                  <motion.div
                    key={data.eventTaskDetailId || index}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      onClick={() => {
                        if (isUserSubmission || isClubOwner) {
                          handleClick(data);
                        }
                      }}
                      className={`border rounded-xl p-5 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 space-y-3 
                      ${isUserSubmission
                          ? "bg-blue-50 border-blue-300"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                            <img
                              src={"https://res.cloudinary.com/ecams/image/upload/v1746281259/%E1%BA%A3nh_fpt_xqriyr.png"}
                              alt="avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div>
                            {/* Tên + số lượng nộp */}
                            <p className="text-sm font-semibold text-black uppercase">
                              {data.memberName}{" "}
                            </p>

                            {/* Thời gian */}
                            <p className="text-xs text-gray-500">
                              {data?.submissionDate === "0001-01-01T00:00:00"
                                ? "Not submitted"
                                : format(
                                  new Date(data.submissionDate),
                                  "dd-MM-yyyy HH:mm:ss"
                                )}
                            </p>
                          </div>
                        </div>
                        {data.status == "NOT_STARTED" ? (
                          <span className="text-sm font-medium px-3 py-1 rounded-full bg-white text-gray-900 border border-gray-200 shadow-sm">
                            {data.status}
                          </span>
                        ) : (
                          <span
                            className={`text-sm font-medium px-2 py-0.5 rounded-full ${data.status === "ON_GOING"
                              ? "text-blue-600 bg-blue-100"
                              : data.status === "REVIEWING"
                                ? "text-yellow-600 bg-yellow-100"
                                : data.status === "COMPLETED"
                                  ? "text-green-900 bg-green-300"
                                  : "text-red-700 bg-red-200"
                              }`}
                          >
                            {data.status}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-700">
                        <span className="font-medium">📧 Email:</span>{" "}
                        {data.memberEmail}
                      </p>

                      <p className="text-sm text-gray-700">
                        <span className="font-medium">🕒 Submitted at:</span>{" "}
                        {data?.submissionDate === "0001-01-01T00:00:00"
                          ? "Not submitted"
                          : format(
                            new Date(data.submissionDate),
                            "dd/MM/yyyy - hh:mm"
                          )}
                      </p>

                      <p className="text-sm text-gray-700">
                        <span className="font-medium">📝 Content:</span>{" "}
                        <DescriptionWithToggle
                          text={data?.studentSubmission || "Not submitted"}
                        ></DescriptionWithToggle>
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              {/* Pagination controls */}
              <div className="flex justify-end items-center gap-2 pt-4">
                <Button
                  variant="outline"
                  disabled={currentPageSubmission === 1}
                  onClick={() => setCurrentPageSubmission((prev) => prev - 1)}
                >
                  ⬅ Prev
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPageSubmission} of {totalPagesSubmission}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPageSubmission === totalPagesSubmission}
                  onClick={() => setCurrentPageSubmission((prev) => prev + 1)}
                >
                  Next ➡
                </Button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">No submissions yet.</p>
          )}
        </CardContent>
      </Card>
      {isClubOwner && (
        <AssignMembersDialog
          isOpen={isAssignDialogOpen}
          onClose={() => setIsAssignDialogOpen(false)}
          onAssign={handleAssignMembers}
          members={allStudents}
          subTask={taskDetail}
          clubId={clubId}
          task={bigTask}
          memberSelected={membersSelected}
        />
      )}
    </div>
  );
};

export default TaskDetailCard;
