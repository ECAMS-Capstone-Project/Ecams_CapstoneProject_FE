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
      <DialogContent className="max-w-4xl h-[83vh] rounded-2xl p-4 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-700">
            Club Ranking Point Calculation Guide
          </DialogTitle>
        </DialogHeader>
        <div className="w-full h-full mt-2">
          <iframe
            src="https://res.cloudinary.com/ecams/image/upload/v1744205625/instruction_igwvg6.pdf"
            title="Club Ranking Guide"
            className="w-full h-[calc(80vh-60px)] rounded-lg border"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
