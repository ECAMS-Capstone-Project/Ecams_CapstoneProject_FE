// components/partial/club_owner/event-participants/ExportToExcel.tsx
import * as XLSX from "xlsx";
import { Participant } from "@/models/Participants";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportToExcelProps {
  data: Participant[];
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({ data }) => {
  const handleExport = () => {
    // Convert data thành sheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Tạo workbook và append sheet vào
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");

    // Xuất file và tự động tải về
    XLSX.writeFile(wb, "participants_list.xlsx");
  };

  return (
    <Button
      onClick={handleExport}
      className="bg-[#136CB9] hover:bg-[#49BBBD] transition-colors duration-300 flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Export List
    </Button>
  );
};

export default ExportToExcel;
