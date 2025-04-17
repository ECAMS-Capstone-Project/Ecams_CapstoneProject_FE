import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Clock, ArrowLeft, Mail, CheckCircle, Loader, Eye } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GetTaskDetail, Submission, TaskDetailDTO } from "@/api/club-owner/TaskAPI";
import { format } from "date-fns";
import { motion } from "framer-motion";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const TaskDetailCard = () => {
  const [tab, setTab] = useState("submission");
  const { taskId = "" } = useParams();
  const location = useLocation();
  const isClubOwner = location.state.isClubOwner as boolean;
  const [taskDetail, setTaskDetail] = useState<TaskDetailDTO>();
  const [currentPageSubmission, setCurrentPageSubmission] = useState(1);
  const [currentPageAssigned, setCurrentPageAssigned] = useState(1);

  const navigate = useNavigate();
  const { user } = useAuth();

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

  const members = taskDetail?.assignedMember || [];
  const submissions = taskDetail?.submissions || [];

  // Ưu tiên submission của người dùng lên đầu
  const sortedSubmissions = [
    ...submissions.filter((s) => s.memberEmail === user?.email),
    ...submissions.filter((s) => s.memberEmail !== user?.email),
  ];

  // Pagination logic for Submissions
  const itemsPerPage = 5;
  const totalPagesSubmission = Math.ceil(sortedSubmissions.length / itemsPerPage);
  const paginatedSubmissions = sortedSubmissions.slice(
    (currentPageSubmission - 1) * itemsPerPage,
    currentPageSubmission * itemsPerPage
  );

  // Pagination logic for Assigned Members
  const totalPagesAssigned = Math.ceil(members.length / itemsPerPage);
  const paginatedAssignedMembers = members.slice(
    (currentPageAssigned - 1) * itemsPerPage,
    currentPageAssigned * itemsPerPage
  );

  const handleClick = (data: Submission) => {
    if (isClubOwner) {
      navigate('/club/task-submission', { state: { taskDetail: taskDetail, submission: data } })
    } else {
      navigate('/club/task-submission-student', { state: { taskDetail: taskDetail, submission: data } })
    }
  }

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
              <h1 className="text-2xl font-bold text-blue-600">{taskDetail?.taskName}</h1>
              <p className="mt-1">{taskDetail?.description}</p>
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

              {sortedSubmissions.length > 0 ? (
                <>
                  {paginatedSubmissions.map((data, index) => {
                    const isUserSubmission = data.memberEmail === user?.email;
                    return (
                      <motion.div
                        key={data.taskId || index}
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
                      ${isUserSubmission ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"}`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                <img
                                  src="https://github.com/shadcn.png"
                                  alt="avatar"
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div>
                                {/* Tên + số lượng nộp */}
                                <p className="text-sm font-semibold text-black uppercase">
                                  {data.memberName}{" "}
                                  <span className="font-medium text-gray-600">({1})</span>
                                </p>

                                {/* Thời gian */}
                                <p className="text-xs text-gray-500">
                                  {data?.submissionDate === "0001-01-01T00:00:00"
                                    ? "Not submitted"
                                    : format(new Date(data.submissionDate), "dd-MM-yyyy HH:mm:ss")}
                                </p>
                              </div>
                            </div>
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
                            <span className="font-medium">📧 Email:</span> {data.memberEmail}
                          </p>

                          <p className="text-sm text-gray-700">
                            <span className="font-medium">🕒 Submitted at:</span>{" "}
                            {data?.submissionDate === "0001-01-01T00:00:00"
                              ? "Not submitted"
                              : format(new Date(data.submissionDate), "dd/MM/yyyy - hh:mm")}
                          </p>

                          <p className="text-sm text-gray-700">
                            <span className="font-medium">📝 Content:</span>{" "}
                            {data?.studentSubmission || "Not submitted"}
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
        </TabsContent>

        {/* Assigned Members Tab */}
        <TabsContent value="assigned">
          <Card>
            <CardContent className="p-6 space-y-2">
              <h3 className="text-lg font-semibold mb-2">Assigned Members</h3>
              {members.length > 0 ? (
                paginatedAssignedMembers.map((data, index) => (
                  <Dialog key={index}>
                    <div className="border p-4 rounded-md space-y-2 relative">
                      {/* 👁 Icon con mắt */}
                      {isClubOwner && (
                        <DialogTrigger asChild>
                          <button className="absolute top-2 right-2 text-gray-500 hover:text-blue-600 transition">
                            <Eye className="w-5 h-5" />
                          </button>
                        </DialogTrigger>
                      )}
                      {/* Tên */}
                      <p className="font-semibold text-blue-600 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        {data.fullname}
                      </p>

                      {/* Email */}
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {data.email}
                      </p>

                      {/* Trạng thái */}
                      {taskDetail?.submissions.some(
                        (sub) => sub.clubMemberId === data.clubMemberId && sub.submissionDate !== "0001-01-01T00:00:00"
                      ) ? (
                        <p className="text-green-600 font-semibold flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          Completed
                        </p>
                      ) : (
                        <p className="text-yellow-600 flex items-center gap-2">
                          <Loader className="w-5 h-5 text-yellow-600 animate-spin" />
                          In progress
                        </p>
                      )}
                    </div>

                    {/* 💬 Nội dung dialog */}
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-lg font-bold">👁️ Member Detail</DialogTitle>
                      </DialogHeader>

                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={"https://github.com/shadcn.png"}
                          alt="Avatar"
                          className="w-16 h-16 rounded-full border object-cover"
                        />
                        <div>
                          <p className="text-lg font-semibold">{data.fullname}</p>
                          <p className="text-sm text-gray-500">{data.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-base pb-2">
                        <div>
                          <p className="text-gray-500">Student ID</p>
                          <p className="font-medium">{data.studentId}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Club Member ID</p>
                          <p className="font-medium">{data.clubMemberId}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Role</p>
                          <p className="font-medium">{data.clubRoleName}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Joined At</p>
                          <p className="font-medium">{new Date(data.joinedAt).toLocaleDateString()}</p>
                        </div>
                        {data.leftDate && (
                          <div>
                            <p className="text-gray-500">Left Date</p>
                            <p className="font-medium">{new Date(data.leftDate).toLocaleDateString()}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-500">Activity Points</p>
                          <p className="font-medium">{data.clubActivityPoint}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Status</p>
                          <div className="flex items-center gap-2">
                            {taskDetail?.submissions.some(
                              (sub) =>
                                sub.clubMemberId === data.clubMemberId &&
                                sub.submissionDate !== "0001-01-01T00:00:00"
                            ) ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-green-600 font-semibold">Completed</span>
                              </>
                            ) : (
                              <>
                                <Loader className="w-4 h-4 text-yellow-600 animate-spin" />
                                <span className="text-yellow-600">In progress</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))
              ) : (
                <p className="text-gray-500 italic">No members assigned yet.</p>
              )}
              {/* Pagination controls */}
              <div className="flex justify-end items-center gap-2 pt-4">
                <Button
                  variant="outline"
                  disabled={currentPageAssigned === 1}
                  onClick={() => setCurrentPageAssigned((prev) => prev - 1)}
                >
                  ⬅ Prev
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPageAssigned} of {totalPagesAssigned}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPageAssigned === totalPagesAssigned}
                  onClick={() => setCurrentPageAssigned((prev) => prev + 1)}
                >
                  Next ➡
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskDetailCard;
