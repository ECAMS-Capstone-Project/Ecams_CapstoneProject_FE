import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { AvailableClubResponse } from "@/models/Club";
import { Button } from "@/components/ui/button";

interface ClubInfoDialogProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  selectedClub: AvailableClubResponse;
}

export const ClubInfoDialog: React.FC<ClubInfoDialogProps> = ({
  openDialog,
  setOpenDialog,
  selectedClub,
}) => {
  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
      <DialogContent className="rounded-lg p-6 bg-white shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Club Information
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            View the detailed information of the club
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex gap-4 items-center bg-purple-100 p-4 rounded-lg">
            <Avatar className="w-32 h-32 rounded-full overflow-hidden shadow-md">
              <AvatarImage
                src={selectedClub?.logoUrl}
                className="object-cover w-full h-full"
              />
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-purple-900">
                {selectedClub?.clubName}
              </h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <p className="text-sm text-gray-600">
                  Email: {selectedClub?.contactEmail}
                </p>
                <p className="text-sm text-gray-600">
                  Founding Date:{" "}
                  {selectedClub?.foundingDate
                    ? format(selectedClub?.foundingDate, "dd/MM/yyyy")
                    : "N/A"}
                </p>
              </div>
              <div className="flex items-center justify-start gap-2 mt-3">
                {selectedClub?.clubFields.map((field) => (
                  <Badge
                    key={field.fieldId}
                    className="bg-purple-300 text-purple-800 text-sm px-3 py-1 rounded-lg hover:bg-purple-400 hover:text-purple-950 "
                  >
                    {field.fieldName}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-semibold text-gray-800">Description:</p>
            <p className="text-sm text-gray-600 mt-1">
              {selectedClub?.description}
            </p>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => setOpenDialog(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
