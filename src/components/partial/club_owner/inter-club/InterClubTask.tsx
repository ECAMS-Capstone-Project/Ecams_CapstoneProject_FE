/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InterClubEventDTO } from "@/models/Event";
import { useInterTask } from "@/hooks/club/useInterTask";
import { TaskPagination } from "./task/TaskPagination";
import { TaskSearchBar } from "./task/TaskSearchBar";
import { TaskCreateDialog } from "./task/TaskCreateDialog";
import { TaskItem } from "./task/TaskItem";
import { CreateInterTaskRequest } from "@/models/InterTask";
import useAuth from "@/hooks/useAuth";
import { useClubs } from "@/hooks/student/useClub";

interface Club {
  id: string;
  name: string;
}

interface InterClubTaskProps {
  selectedEvent: InterClubEventDTO | null;
}

export const InterClubTask = ({ selectedEvent }: InterClubTaskProps) => {
  const [, setClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(5);

  useEffect(() => {
    if (!selectedEvent) return;
    const mockClubs: Club[] = selectedEvent.clubs.map((club) => ({
      id: club.clubId,
      name: club.clubName,
    }));
    setClubs(mockClubs);
  }, [selectedEvent]);

  const { tasks, totalPages, createInterEventTask } = useInterTask(
    selectedEvent?.eventId,
    pageSize,
    pageNo
  );

  const handleCreateTask = async (newTask: CreateInterTaskRequest) => {
    if (!newTask.taskName || !selectedEvent) return;
    await createInterEventTask(newTask);
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

  const isHostClub = selectedEvent?.clubs.find((club) => club.isHost === true);
  const { user } = useAuth();
  const { clubs } = useClubs(user?.universityId, 1, 20);

  const club = clubs?.filter((club) =>
    club.clubMembers?.some(
      (member) =>
        member.userId === user?.userId && member.clubRoleName === "CLUB_OWNER"
    )
  );
  const isHost = isHostClub?.clubId === club?.[0]?.clubId;

  return (
    <div className="h-[calc(100vh-200px)]">
      <div className="flex justify-between items-center mb-4">
        <TaskSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        {isHostClub?.clubId === club?.[0]?.clubId && (
          <TaskCreateDialog
            onCreateTask={handleCreateTask}
            eventId={selectedEvent?.eventId || ""}
            selectedEvent={selectedEvent}
          />
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.eventTaskId}
              task={task}
              isHost={isHost}
              selectedEvent={selectedEvent}
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
