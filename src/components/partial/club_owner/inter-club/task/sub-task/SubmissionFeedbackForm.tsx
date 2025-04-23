import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EventTaskDetail } from "@/models/InterTask";

interface SubmissionFeedbackFormProps {
  score: number;
  feedback: string;
  onScoreChange: (score: number) => void;
  onFeedbackChange: (feedback: string) => void;
  subtask: EventTaskDetail;
}

export const SubmissionFeedbackForm = ({
  score,
  feedback,
  onScoreChange,
  onFeedbackChange,
  subtask,
}: SubmissionFeedbackFormProps) => {
  const isDisabled =
    subtask?.status !== "ON_GOING" ||
    new Date() > new Date(subtask?.deadline || "");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Grade
        </label>
        <Input
          type="number"
          value={score}
          onChange={(e) => onScoreChange(Number(e.target.value))}
          min={0}
          max={10}
          className="w-32"
          disabled={!isDisabled}
        />
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
          disabled={!isDisabled}
        />
      </div>
    </div>
  );
};
