import { ReactNode } from "react";

interface Club {
  id: string;
  name: string;
  logo?: string;
}

interface ChatHeaderProps {
  selectedClub: Club;
  children?: ReactNode;
}

export const ChatHeader = ({ selectedClub, children }: ChatHeaderProps) => {
  return (
    <div className="border-b p-2 flex items-center gap-4">
      {children}
      <h2 className="text-lg font-semibold">{selectedClub.name}</h2>
    </div>
  );
};
