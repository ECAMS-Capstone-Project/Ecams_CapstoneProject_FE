import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";

interface DenyProps {
  onClose: () => void;
  open: boolean;
}

export const PointClubDialog: React.FC<DenyProps> = ({
  onClose,
  open,
}) => {

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-blue-600">
            How Club Ranking is Calculated
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 text-sm text-gray-700 space-y-3">
          <p>Club ranking is determined based on:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Total number of approved events organized</li>
            <li>Student participation rate in activities</li>
            <li>Feedback ratings from event attendees</li>
            <li>Timely submission and quality of task reports</li>
            <li>Number of active members in the club</li>
          </ul>
          <p>Points are aggregated monthly to determine each club’s position on the leaderboard.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
