import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TaskSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const TaskSearchBar = ({
  searchQuery,
  onSearchChange,
}: TaskSearchBarProps) => {
  return (
    <div className="relative w-64">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};
