import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterClubEventDTO } from "@/models/Event";

interface Task {
  id: string;
  title: string;
  description: string;
  assignedClub: string;
  assignedMembers: string[];
  status: "TODO" | "IN_PROGRESS" | "DONE";
  deadline: Date;
  createdBy: string;
}

interface Club {
  id: string;
  name: string;
  // members: string[];
}

interface InterClubTaskProps {
  selectedEvent: InterClubEventDTO | null;
}

export const InterClubTask = ({ selectedEvent }: InterClubTaskProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    assignedClub: "",
    assignedMembers: [],
    status: "TODO",
    deadline: new Date(),
  });

  // TODO: Implement API calls to fetch tasks and clubs
  useEffect(() => {
    if (!selectedEvent) return;

    // Fetch tasks and clubs
    const fetchData = async () => {
      // Mock data
      const mockClubs: Club[] = selectedEvent.clubs.map((club) => ({
        id: club.clubId,
        name: club.clubName,
        // members: club., // TODO: Replace with actual members
      }));

      const mockTasks: Task[] = [
        {
          id: "1",
          title: `Setup for ${selectedEvent.eventName}`,
          description: "Prepare the venue and equipment",
          assignedClub: selectedEvent.clubs[0].clubName,
          assignedMembers: ["Member 1"],
          status: "TODO",
          deadline: new Date(),
          createdBy: "Your Club",
        },
        {
          id: "2",
          title: `Marketing for ${selectedEvent.eventName}`,
          description: "Create and distribute promotional materials",
          assignedClub: selectedEvent.clubs[1].clubName,
          assignedMembers: ["Member 4"],
          status: "IN_PROGRESS",
          deadline: new Date(),
          createdBy: "Your Club",
        },
      ];

      setClubs(mockClubs);
      setTasks(mockTasks);
    };

    fetchData();
  }, [selectedEvent]);

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.assignedClub || !selectedEvent) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || "",
      assignedClub: newTask.assignedClub,
      assignedMembers: newTask.assignedMembers || [],
      status: "TODO",
      deadline: newTask.deadline || new Date(),
      createdBy: "Your Club", // TODO: Replace with actual club name
    };

    setTasks((prev) => [...prev, task]);
    setIsCreateDialogOpen(false);
    setNewTask({
      title: "",
      description: "",
      assignedClub: "",
      assignedMembers: [],
      status: "TODO",
      deadline: new Date(),
    });

    // TODO: Implement API call to create task
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter task description"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Assign to Club</label>
                <Select
                  value={newTask.assignedClub}
                  onValueChange={(value) =>
                    setNewTask((prev) => ({ ...prev, assignedClub: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a club" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubs.map((club) => (
                      <SelectItem key={club.id} value={club.name}>
                        {club.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Deadline</label>
                <Input
                  type="date"
                  value={newTask.deadline?.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      deadline: new Date(e.target.value),
                    }))
                  }
                />
              </div>
              <Button onClick={handleCreateTask} className="w-full">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <span className="text-muted-foreground">
                      Assigned to: {task.assignedClub}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      Created by: {task.createdBy}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      task.status === "TODO"
                        ? "bg-yellow-100 text-yellow-800"
                        : task.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.status}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(task.deadline, "MMM d, yyyy")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
