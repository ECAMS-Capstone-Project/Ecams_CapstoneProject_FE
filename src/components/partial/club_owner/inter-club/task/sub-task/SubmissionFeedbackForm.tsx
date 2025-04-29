import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  EventTaskDetail,
  InterTask,
  InterTaskSubmission,
} from "@/models/InterTask";
import toast from "react-hot-toast"; // Import thư viện toast

interface SubmissionFeedbackFormProps {
  score: number;
  feedback: string;
  onScoreChange: (score: number) => void;
  onFeedbackChange: (feedback: string) => void;
  subtask: EventTaskDetail;
  task: InterTask;
  submission: InterTaskSubmission | null;
}

export const SubmissionFeedbackForm = ({
  score,
  feedback,
  onScoreChange,
  onFeedbackChange,
  subtask,
  task,
  submission,
}: SubmissionFeedbackFormProps) => {
  console.log("task", task);
  const isDisabled =
    submission?.status !== "REVIEWING" || // submission phải có trạng thái "REVIEWING"
    new Date() > new Date(subtask?.deadline || "") || // Kiểm tra thời gian hiện tại có vượt qua deadline của subtask
    subtask.status === "COMPLETED";

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= 10) {
      onScoreChange(value);
    }
  };

  // Hiển thị thông báo Toast khi người dùng nhập điểm ngoài phạm vi
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 0 || value > 10) {
      toast.error("Score must be between 0 and 10."); // Thông báo lỗi
      if (value < 0) {
        onScoreChange(0); // Set lại giá trị là 0 nếu nhỏ hơn 0
      } else if (value > 10) {
        onScoreChange(10); // Set lại giá trị là 10 nếu lớn hơn 10
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Grade
        </label>
        <Input
          type="number"
          value={score}
          onChange={handleScoreChange}
          min={0}
          max={10}
          className="w-32"
          disabled={isDisabled}
          onBlur={handleBlur} // Khi mất focus, kiểm tra và thông báo
        />
        {/* Thêm thông báo lỗi nếu giá trị không hợp lệ */}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Feedback
        </label>
        <Textarea
          value={feedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
          placeholder="Enter your feedback..."
          className="min-h-[100px]"
          disabled={isDisabled}
        />
      </div>
    </div>
  );
};
