/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Grid2, Typography } from "@mui/material";
import { ClubResponseDTO } from "@/api/club-owner/ClubByUser";
import { formatDate } from "date-fns";
import { DescriptionWithToggle } from "@/lib/DescriptionWithToggle";


interface ClubDetailDialogProps {
  initialData: ClubResponseDTO | null;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClubActiveDetailDialog: React.FC<ClubDetailDialogProps> = ({ initialData }) => {

  return (
    <div className="p-5 mt-2">
      <>
        <h2 className="text-xl font-semibold mb-4">Club Detail</h2>
        {/* Avatar */}
        <Grid2 container>
          <Grid2 size={6}>
            <div className="mb-3">
              <Typography variant="subtitle1" fontWeight="bold">
                Club Name
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                {initialData?.clubName}
              </Typography>
            </div>
            <div className="mb-3">
              <Typography variant="subtitle1" fontWeight="bold">
                Founding Date
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                {formatDate(initialData?.foundingDate || new Date(), "dd/MM/yyyy")}
              </Typography>
            </div>
          </Grid2>
          <Grid2 size={6}>
            <div className="mb-3">
              <Typography variant="subtitle1" fontWeight="bold">
                Purpose
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                {initialData?.purpose}
              </Typography>
            </div>
            <div className="mb-3">
              <Typography variant="subtitle1" fontWeight="bold">
                Club Description
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                {<DescriptionWithToggle text={initialData?.description ?? "N/A"} />}
              </Typography>
            </div>
          </Grid2>
          <Grid2 size={6}>
            <div className="mb-3">
              <Typography variant="subtitle1" fontWeight="bold">
                Contact Email
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                {initialData?.contactEmail || "N/A"}
              </Typography>
            </div>
            <div className="mb-3">
              <Typography variant="subtitle1" fontWeight="bold">
                Contact Phone
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                {initialData?.contactPhone || "N/A"}
              </Typography>
            </div>
          </Grid2>
          <Grid2 size={6}>
            <div className="mb-3">
              <Typography variant="subtitle1" fontWeight="bold">
                Website URL
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                {initialData?.websiteUrl || "N/A"}
              </Typography>
            </div>
            <div className="mb-3">
              <Typography variant="subtitle1" fontWeight="bold">
                Status
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                {initialData?.status}
              </Typography>
            </div>
          </Grid2>
          <Grid2 size={6}>
            <div className="mb-3">
              <Typography variant="subtitle1" fontWeight="bold">
                Website URL
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                {initialData?.websiteUrl || "N/A"}
              </Typography>
            </div>

          </Grid2>
        </Grid2>
        <div className="flex justify-center mt-6">
          <Avatar className="w-72 h-52 rounded-lg">
            <AvatarImage
              src={initialData?.logoUrl || "https://github.com/shadcn.png"}
              alt="empty"
              className="object-cover w-full h-full"
            />
          </Avatar>
        </div>
      </>
    </div>
  );
};

export default ClubActiveDetailDialog;
