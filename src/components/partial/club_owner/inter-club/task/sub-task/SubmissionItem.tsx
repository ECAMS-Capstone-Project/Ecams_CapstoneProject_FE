import { FileText, Mail, Clock } from "lucide-react";
import { InterTaskSubmission } from "@/models/InterTask";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface SubmissionItemProps {
  submission: InterTaskSubmission;
  index: number;
  onClick: (submission: InterTaskSubmission) => void;
}

export const SubmissionItem = ({
  submission,
  index,
  onClick,
}: SubmissionItemProps) => {
  return (
    <motion.div
      key={submission.clubMemberId}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div
        onClick={() => onClick(submission)}
        className="border rounded-xl p-5 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 space-y-3 bg-white border-gray-200"
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
              <p className="text-sm font-semibold text-black uppercase">
                {submission.memberName}{" "}
                <span className="font-medium text-gray-600">({index + 1})</span>
              </p>

              <p className="text-xs text-gray-500">
                {submission.submissionDate === "0001-01-01T00:00:00"
                  ? "Not submitted"
                  : format(
                      new Date(submission.submissionDate),
                      "dd-MM-yyyy HH:mm:ss"
                    )}
              </p>
            </div>
          </div>
          <span
            className={`text-sm font-medium px-2 py-0.5 rounded-full ${
              submission.status === "COMPLETED"
                ? "text-green-600 bg-green-100"
                : "text-yellow-600 bg-yellow-100"
            }`}
          >
            {submission.status}
          </span>
        </div>

        <p className="text-sm text-gray-700 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span className="font-medium">Email:</span> {submission.memberEmail}
        </p>

        <p className="text-sm text-gray-700 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="font-medium">Submitted at:</span>{" "}
          {submission.submissionDate === "0001-01-01T00:00:00"
            ? "Have not submitted yet"
            : format(new Date(submission.submissionDate), "dd/MM/yyyy - hh:mm")}
        </p>

        <p className="text-sm text-gray-700 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span className="font-medium">Content:</span>{" "}
          {submission.studentSubmission || "No content yet"}
        </p>
      </div>
    </motion.div>
  );
};
