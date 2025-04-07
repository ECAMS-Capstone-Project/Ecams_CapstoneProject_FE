import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckIcon, ChevronDownIcon, X } from "lucide-react";
import { useClubs } from "@/hooks/student/useClub";
import useAuth from "@/hooks/useAuth";
import { EventClubDTO } from "@/api/representative/EventAgent";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ClubPickerProps {
  value: string[];
  onChange: (clubNames: string[]) => void;
}

const ClubPicker: React.FC<ClubPickerProps> = ({ value = [], onChange }) => {
  const [open, setOpen] = useState(false);
  const [pageNo] = useState(1);
  const [pageSize] = useState(10);

  const { user } = useAuth();
  const { clubs } = useClubs(user?.universityId, pageNo, pageSize);

  const currentClub = clubs?.find((club: EventClubDTO) =>
    club.clubMembers?.some(
      (member) =>
        member.userId === user?.userId && member.clubRoleName === "CLUB_OWNER"
    )
  );

  const clubsNotCurrentClub = clubs.filter(
    (club: EventClubDTO) => club.clubId !== currentClub?.clubId
  );
  const selectedClubs = clubsNotCurrentClub.filter((club: EventClubDTO) =>
    value.includes(club.clubName.trim())
  );

  const handleSelect = (club: EventClubDTO) => {
    const trimmedClubName = club.clubName.trim();
    if (value.includes(trimmedClubName)) {
      onChange(value.filter((name) => name.trim() !== trimmedClubName));
    } else {
      onChange([...value, trimmedClubName]);
    }
  };

  const handleRemove = (clubName: string) => {
    const trimmedName = clubName.trim();
    onChange(value.filter((name) => name.trim() !== trimmedName));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedClubs.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {selectedClubs.map((club: EventClubDTO) => (
                <Badge
                  key={club.clubId}
                  variant="secondary"
                  className="mr-1 mb-1"
                >
                  {club.clubName.trim()}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(club.clubName);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <span>Select clubs...</span>
          )}
          <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search clubs..." />
          <CommandList>
            <CommandEmpty>No clubs found.</CommandEmpty>
            <CommandGroup>
              {clubsNotCurrentClub.map((club: EventClubDTO) => {
                const isSelected = value.includes(club.clubName.trim());
                return (
                  <CommandItem
                    key={club.clubId}
                    onSelect={() => handleSelect(club)}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {isSelected && <CheckIcon className="h-4 w-4" />}
                    </div>
                    {club.clubName.trim()}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ClubPicker;
