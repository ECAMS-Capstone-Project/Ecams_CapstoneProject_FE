import React, { useState } from "react";

import { Feedback } from "@/models/Feedback";
import Rating from "@mui/material/Rating";
import { useFeedback } from "@/hooks/student/useFeedback";
import LoadingAnimation from "@/components/ui/loading";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { SearchXIcon } from "lucide-react";
import FeedbackDialog from "./FeedbackDialog";
import { TaskPagination } from "@/components/partial/club_owner/inter-club/task/TaskPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventFeedbackProps {
  eventId: string;
  studentId: string;
  isEventEnded: boolean;
}

export const EventFeedback: React.FC<EventFeedbackProps> = ({
  eventId,
  studentId,
  isEventEnded,
}) => {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(5);
  const [rating, setRating] = useState<number | null>(null);
  const { feedbacks, isLoading, totalPages } = useFeedback(
    eventId,
    rating,
    pageNo,
    pageSize
  );

  const feedbackList = feedbacks || [];

  const handleRatingFilter = (selectedRating: string) => {
    setRating(selectedRating === "all" ? null : Number(selectedRating));
    setPageNo(1);
  };

  // Helper function to format rating display
  const getRatingText = (rating: number) => {
    return rating % 1 === 0 ? `${rating}.0` : rating.toString();
  };

  if (!isEventEnded) {
    return null;
  }

  return (
    <div className="mt-8 overflow-hidden">
      <div className="bg-gradient-to-r from-[#136CB5] to-[#49BBBD] p-4 rounded-t-xl flex items-center justify-between">
        <h3 className="text-xl font-medium text-white">Event Feedback</h3>
        <FeedbackDialog studentId={studentId} eventId={eventId} />
      </div>
      <div className="p-6 bg-gradient-to-r from-[#136CB9]/10 to-[#49BBBD]/10 rounded-b-xl shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm font-medium text-gray-600">
            Filter by rating:
          </span>
          <Select
            value={rating === null ? "all" : rating.toString()}
            onValueChange={handleRatingFilter}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ratings</SelectItem>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value} ⭐
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <LoadingAnimation />
          </div>
        ) : feedbackList.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
            <div className="bg-gradient-to-r from-[#136CB5] to-[#49BBBD] p-3 rounded-full">
              <SearchXIcon size={32} color="white" />
            </div>
            <AnimatedGradientText>
              <span className="text-2xl font-bold">
                {rating
                  ? `No ${getRatingText(rating)}-star feedbacks yet!`
                  : "No feedbacks yet!"}
              </span>
            </AnimatedGradientText>
          </div>
        ) : (
          <div className="space-y-4 ">
            {feedbackList.map((feedback: Feedback) => (
              <div
                key={feedback.feedbackId}
                className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgb(0,0,0,0.08)]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Rating
                    value={feedback.rating}
                    readOnly
                    max={10}
                    size="small"
                  />
                  <span className="text-sm text-gray-500">
                    by {feedback.fullname}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{feedback.content}</p>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center mt-6">
          <TaskPagination
            totalPages={totalPages}
            pageNo={pageNo}
            setPageNo={setPageNo}
          />
        </div>
      </div>
    </div>
  );
};
