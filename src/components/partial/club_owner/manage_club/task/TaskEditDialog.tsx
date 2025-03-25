import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";

// Các API và interface
import { GetMemberInClubsByStatusAPI } from "@/api/club-owner/ClubByUser";
import {
  TaskDetailDTO,
  MemberInTaskDTO,
  GetTaskDetail,
  UpdateTaskAPI
} from "@/api/club-owner/TaskAPI";

interface EditTaskProps {
  taskId: string;
  clubId: string;
  onClose: () => void;
  setFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

// Các field form dùng để edit task (không bao gồm assignedMember)
interface EditTaskFormValues {
  taskName: string;
  description: string;
  startTime: string;
  deadline: string;
  taskScore: number;
}

const EditTaskDialog: React.FC<EditTaskProps> = ({ taskId, clubId, onClose, setFlag }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EditTaskFormValues>();

  // State lưu chi tiết task (bao gồm assignedMember)
  const [taskDetail, setTaskDetail] = useState<TaskDetailDTO | null>(null);
  // State lưu danh sách member được assign (selected)
  const [selectedMembers, setSelectedMembers] = useState<MemberInTaskDTO[]>([]);
  // Danh sách available members trong club
  const [availableMembers, setAvailableMembers] = useState<MemberInTaskDTO[]>([]);
  // State lưu từ khóa search
  const [memberSearch, setMemberSearch] = useState("");

  // Fetch task detail dựa trên taskId
  useEffect(() => {
    async function fetchTaskDetail() {
      try {
        const response = await GetTaskDetail(taskId);
        if (response.data) {
          const taskData = response.data;
          setTaskDetail(taskData);
          setSelectedMembers(taskData.assignedMember);
          reset({
            taskName: taskData.taskName,
            description: taskData.description,
            startTime: taskData.startTime,
            deadline: taskData.deadline,
            taskScore: taskData.taskScore
          });
        }
      } catch (error) {
        console.error("Failed to fetch task detail", error);
        toast.error("Failed to load task details");
      }
    }
    fetchTaskDetail();
  }, [taskId, reset]);

  // Load available members từ API
  useEffect(() => {
    async function fetchAvailableMembers() {
      try {
        const response = await GetMemberInClubsByStatusAPI(clubId, 100, 1, "ACTIVE");
        if (response.data) {
          const filteredMembers = response.data.data.filter(
            (member) => member.clubRoleName !== "CLUB_OWNER"
          );
          setAvailableMembers(filteredMembers);
        }
      } catch (error) {
        console.error("Failed to fetch available members", error);
        toast.error("Failed to load available members");
      }
    }
    fetchAvailableMembers();
  }, [clubId]);

  // Tìm kiếm thành viên theo fullname
  const filteredMembers = availableMembers.filter((member) =>
    member.fullname.toLowerCase().includes(memberSearch.toLowerCase())
  );

  // Kiểm tra member đã được chọn hay chưa
  const isMemberSelected = (member: MemberInTaskDTO) => {
    return selectedMembers.some((m) => m.userId === member.userId);
  };

  // Toggle member
  const handleToggleMember = (member: MemberInTaskDTO, checked: boolean) => {
    if (checked) {
      if (!isMemberSelected(member)) {
        setSelectedMembers((prev) => [...prev, member]);
      }
    } else {
      setSelectedMembers((prev) => prev.filter((m) => m.userId !== member.userId));
    }
  };

  // Submit form
  const onSubmit = async (data: EditTaskFormValues) => {
    if (!taskDetail) return;

    const payload = {
      clubId,
      taskId,
      taskName: data.taskName,
      description: data.description,
      // Dùng startTime & deadline từ taskDetail (không cho sửa)
      startTime: taskDetail.startTime,
      deadline: taskDetail.deadline,
      taskScore: data.taskScore,
      status: taskDetail.status,
      assignedMembers: selectedMembers.map((member) => ({
        clubMemberId: member.clubMemberId
      }))
    };

    try {
      await UpdateTaskAPI(payload);
      toast.success("Task updated successfully");
      // Báo cho parent biết để refresh
      setFlag((pre) => !pre);
      // Đóng form
      onClose();
    } catch (error) {
      toast.error("Failed to update task" + error);
    }
  };

  // Nếu chưa load xong dữ liệu task
  if (!taskDetail) {
    return (
      <div className="max-w-xl p-6">
        <p>Loading task details...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Tiêu đề */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Edit Task</h2>
      </div>

      {/* Form */}
      <div className="px-6 py-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Task Name</label>
            <Input
              {...register("taskName", { required: "Task Name is required" })}
              className="mt-1"
            />
            {errors.taskName && (
              <p className="text-red-500 text-sm">{errors.taskName.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register("description", { required: "Description is required" })}
              className="mt-1 block w-full border p-2 rounded-md"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          {/* Start Time - read-only */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <Input
              {...register("startTime")}
              className="mt-1"
              placeholder="YYYY-MM-DDTHH:MM:SS"
              disabled
            />
          </div>

          {/* Deadline - read-only */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <Input
              {...register("deadline")}
              className="mt-1"
              placeholder="YYYY-MM-DDTHH:MM:SS"
              disabled
            />
          </div>

          {/* Task Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Task Score</label>
            <Input
              {...register("taskScore", {
                required: "Task Score is required",
                valueAsNumber: true,
                min: { value: 0, message: "Task Score cannot be negative" }
              })}
              className="mt-1"
              type="number"
            />
            {errors.taskScore && (
              <p className="text-red-500 text-sm">{errors.taskScore.message}</p>
            )}
          </div>

          {/* Assigned Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Members</label>
            {/* Search input */}
            <Input
              type="text"
              placeholder="Search members"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="mb-2 w-2/4"
            />
            {/* Danh sách thành viên có auto scroll */}
            <div className="space-y-2 max-h-64 overflow-y-auto border p-2 rounded">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div key={member.userId} className="flex items-center space-x-2">
                    <Checkbox
                      checked={isMemberSelected(member)}
                      onCheckedChange={(checked) => handleToggleMember(member, !!checked)}
                    />
                    <span className="text-sm">
                      {member.fullname} ({member.clubRoleName})
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No members found</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskDialog;
