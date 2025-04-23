import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Download, Eye, FileText, MessageSquare } from "lucide-react";
import { useState } from "react";
import { TaskSubmissionDialog } from "./TaskSubmissionDialog";

interface TaskSubmission {
  id: string;
  fileName?: string;
  fileUrl?: string;
  submittedAt: string;
  submittedBy: string;
  content?: string;
  feedback?: string;
  grade?: number;
}

interface TaskSubmissionListProps {
  submissions: TaskSubmission[];
}

export const TaskSubmissionList = ({
  submissions,
}: TaskSubmissionListProps) => {
  const [selectedSubmission, setSelectedSubmission] =
    useState<TaskSubmission | null>(null);

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No submissions yet
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                {submission.fileName ? (
                  <FileText className="h-5 w-5 text-[#136CB9]" />
                ) : (
                  <MessageSquare className="h-5 w-5 text-[#136CB9]" />
                )}
                {submission.fileName || "Text Submission"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Submitted by: {submission.submittedBy}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Submitted at:{" "}
                    {format(
                      new Date(submission.submittedAt),
                      "dd/MM/yyyy HH:mm"
                    )}
                  </p>
                  {submission.content && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      Content: {submission.content}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  {submission.fileUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={submission.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedSubmission && (
        <TaskSubmissionDialog
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          submission={selectedSubmission}
        />
      )}
    </>
  );
};
