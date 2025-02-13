import { Policy } from "@/models/Policy";
import { Typography } from "@mui/material";
import { ArchiveX } from "lucide-react";

interface PolicyProps {
  data: Policy[];
}

export function PolicyRegisterTable({ data }: PolicyProps) {
  return (
    <>
      <div className="w-full p-2">
        {data.length <= 0 && (
          <div className="flex justify-center align-middle gap-2">
            <ArchiveX />
          </div>
        )}
        {data.length > 0 && data.map((report) => (
          <>
            <Typography gutterBottom variant="h6" component="div" mb={1} mt={1}>
              {report.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} mb={1}>
              {report.description}
            </Typography>
            <div className="w-full border-t border-gray-300 opacity-50"></div>
          </>
        ))}
      </div>
    </>
  );
}
