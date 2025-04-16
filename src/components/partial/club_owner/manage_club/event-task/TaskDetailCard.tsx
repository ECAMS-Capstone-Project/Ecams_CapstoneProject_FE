import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Clock, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GetTaskDetail, Submission, TaskDetailDTO } from "@/api/club-owner/TaskAPI";
import { format } from "date-fns";
import { motion } from "framer-motion";

const TaskDetailCard = () => {
  const [tab, setTab] = useState("submission");
  const { taskId = "" } = useParams();
  const location = useLocation();
  const isClubOwner = location.state.isClubOwner as boolean;
  const [taskDetail, setTaskDetail] = useState<TaskDetailDTO>()
  const navigate = useNavigate();
  const handleClick = (data: Submission) => {
    if (isClubOwner) {
      navigate('/club/task-submission', { state: { taskDetail: taskDetail, submission: data } })
    } else {
      navigate('/club/task-submission-student', { state: { taskDetail: taskDetail, submission: data } })
    }
  }
  useEffect(() => {
    if (!taskId) return;
    async function fetchTaskDetail() {
      try {
        const response = await GetTaskDetail(taskId);
        if (response.data) {
          setTaskDetail(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch task detail", error);
      }
    }
    fetchTaskDetail();
  }, [taskId]);

  return (
    <div className="p-6 max-w-full mx-auto space-y-6 rounded-md border border-gray-300 shadow-lg bg-white">
      {/* Header */}
      <Card className="shadow-md bg-blue-50">
        <CardContent className="py-6 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#136cb9]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-blue-600">{taskDetail?.taskName}
              </h1>
              <p className="mt-1">{taskDetail?.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Start Time</p>
                <p>{taskDetail?.startTime ? format(new Date(taskDetail.startTime), "dd/MM/yyyy - hh:mm") : "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Deadline</p>
                <p>{taskDetail?.deadline ? format(new Date(taskDetail.deadline), "dd/MM/yyyy - hh:mm") : "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {taskDetail?.status ? (
                <>
                  <span className="w-5 h-5 rounded-full bg-green-500 inline-block" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <p className="text-green-600 font-semibold">Active</p>
                  </div>
                </>
              ) : (
                <>
                  <span className="w-5 h-5 rounded-full bg-[#D6E4FF] inline-block" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <p className="text-sm font-medium text-[#007BFF]">InActive</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Number of member in task</p>
                <p>{taskDetail?.assignedMember ? taskDetail.assignedMember.length : "N/A"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="submission">Submission</TabsTrigger>
          <TabsTrigger value="assigned">Assigned Members</TabsTrigger>
        </TabsList>

        {/* Submission Tab */}
        <TabsContent value="submission">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                📥 Submissions
              </h3>

              {taskDetail && taskDetail?.submissions.length > 0 ? (
                taskDetail.submissions.map((data, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      onClick={() => handleClick(data)}
                      className="border border-gray-200 rounded-xl p-5 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 space-y-3 bg-white"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-blue-600 text-base">
                          📄 Submission {index + 1}
                        </p>
                        <span
                          className={`text-sm font-medium px-2 py-0.5 rounded-full ${data.submissionDate !== "0001-01-01T00:00:00"
                            ? "text-green-600 bg-green-100"
                            : "text-yellow-600 bg-yellow-100"
                            }`}
                        >
                          {data.submissionDate !== "0001-01-01T00:00:00" ? "✅ Submitted" : "🕐 In Progress"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700">
                        <span className="font-medium">👤 Submitted by:</span> {data.memberName}
                      </p>

                      <p className="text-sm text-gray-700">
                        <span className="font-medium">🕒 Submitted at:</span>{" "}
                        {data?.submissionDate == "0001-01-01T00:00:00"
                          ? "Not submitted"
                          : format(new Date(data.submissionDate), "dd/MM/yyyy - hh:mm")}
                      </p>

                      <p className="text-sm text-gray-700">
                        <span className="font-medium">📝 Content:</span>{" "}
                        {data?.studentSubmission || "Not submitted"}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 italic">No submissions yet.</p>
              )}
            </CardContent>
          </Card>

        </TabsContent>

        {/* Assigned Members Tab */}
        <TabsContent value="assigned">
          <Card>
            <CardContent className="p-6 space-y-2">
              <h3 className="text-lg font-semibold mb-2">Assigned Members</h3>
              {taskDetail?.assignedMember.map((data, index) => (
                <div key={index} className="border p-4 rounded-md space-y-2">
                  <p className="font-semibold text-blue-600">👤 {data.fullname}</p>
                  <p>Email: {data.email}</p>
                  <p className="text-green-600 font-semibold">
                    {taskDetail.assignedMember.some(member =>
                      taskDetail.submissions.some(sub => sub.clubMemberId === member.clubMemberId)
                    ) ? "Completed" : "In progress"}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskDetailCard;
