/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InterClubEventDTO } from "@/models/Event";
import { useInterTask } from "@/hooks/club/useInterTask";
import { CreateInterTaskRequest2 } from "@/models/InterTask";
import { TaskSearchBar } from "../../inter-club/task/TaskSearchBar";
import { TaskPagination } from "../../inter-club/task/TaskPagination";
import { TaskBigItem } from "./TaskBigItem";
import { TaskBigCreateDialog } from "./TaskBigCreateDialog";
import { useMemberEventTask } from "@/hooks/club/useMemberEventTask";
import useAuth from "@/hooks/useAuth";

interface InterClubTaskProps {
  selectedEvent: InterClubEventDTO | null;
  isClubOwner: boolean
  clubId: string
}

export const EventTaskBig = ({ selectedEvent, isClubOwner, clubId }: InterClubTaskProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(5);
  const { user } = useAuth();

  const { tasks, totalPages, createInterEventTask2 } = isClubOwner ? useInterTask(
    selectedEvent?.eventId,
    pageSize,
    pageNo
  ) : useMemberEventTask(selectedEvent?.clubEventId, pageSize, pageNo, user?.userId);

  const handleCreateTask = async (newTask: CreateInterTaskRequest2) => {
    if (!newTask.taskName || !selectedEvent || !clubId) return;
    newTask.clubId = clubId
    await createInterEventTask2(newTask);
  };

  const filteredTasks =
    tasks?.filter((task) =>
      task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  if (!selectedEvent) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] text-muted-foreground">
        Please select an event to view and manage tasks
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)]">
      <div className="flex justify-between items-center mb-4">
        <TaskSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        {isClubOwner && (
          <TaskBigCreateDialog
            onCreateTask={handleCreateTask}
            eventId={selectedEvent?.eventId || ""}
            selectedEvent={selectedEvent}
          />
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskBigItem
              key={task.eventTaskId}
              task={task}
              selectedEvent={selectedEvent}
              isClubOwner={isClubOwner}
            />
          ))}
        </div>
      </ScrollArea>

      <TaskPagination
        totalPages={totalPages}
        pageNo={pageNo}
        setPageNo={setPageNo}
      />
    </div>
  );
};
