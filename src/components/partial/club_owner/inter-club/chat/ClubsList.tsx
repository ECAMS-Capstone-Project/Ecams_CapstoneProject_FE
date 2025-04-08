import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface Club {
  id: string;
  name: string;
  logo?: string;
}

interface ClubsListProps {
  clubs: Club[];
  selectedClub: Club | null;
  onClubSelect: (club: Club) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ClubsList = ({
  clubs,
  selectedClub,
  onClubSelect,
  searchQuery,
  onSearchChange,
}: ClubsListProps) => {
  return (
    <div className="w-full">
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clubs..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-2">
          {clubs.map((club) => (
            <Button
              key={club.id}
              variant={selectedClub?.id === club.id ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => onClubSelect(club)}
            >
              {club.logo && (
                <img
                  src={club.logo}
                  alt={club.name}
                  className="h-8 w-8 rounded-full"
                />
              )}
              {club.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
