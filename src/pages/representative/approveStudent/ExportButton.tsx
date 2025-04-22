/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver"; // Thêm file-saver để download tệp
import GetAppIcon from "@mui/icons-material/GetApp";
import StudentRequest from "@/models/StudentRequest";
import * as XLSX from "xlsx";

interface ExportButtonProps {
  studentList: StudentRequest[];
}

const ExportButton = ({ studentList }: ExportButtonProps) => {
  // Tạo và lưu file Excel
  const exportToExcel = () => {
    try {
      const result: any[] = [];
      const header = [
        "User ID",
        "Email",
        "Full Name",
        "Address",
        "Phone Number",
        "Gender",
        "Status",
        "Student ID",
        "University Name",
        "Major",
        "Year of Study",
        "Start Date",
        "End Date",
        "Image URL",
      ];
      result.push(header);

      studentList.forEach((item: StudentRequest) => {
        result.push([
          item.userId,
          item.email,
          item.fullname,
          item.address,
          item.phonenumber,
          item.gender,
          item.status,
          item.studentId,
          item.universityName,
          item.major,
          item.yearOfStudy,
          item.startDate ? new Date(item.startDate).toISOString() : "",
          item.endDate ? new Date(item.endDate).toISOString() : "",
          item.imageUrl,
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(result);

      const range = XLSX.utils.decode_range(ws["!ref"]!);
      for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
          if (cell) {
            cell.s = {
              border: {
                top: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
              },
              alignment: { horizontal: "center", vertical: "center" },
            };
          }
        }
      }

      for (let col = range.s.c; col <= range.e.c; col++) {
        const headerCell = ws[XLSX.utils.encode_cell({ r: 0, c: col })];
        if (headerCell) {
          headerCell.s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4F81BD" } },
            alignment: { horizontal: "center", vertical: "center" },
          };
        }
      }

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Students");

      const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelFile], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "students.xlsx");
    } catch (error) {
      console.error("Error generating Excel:", error);
    }
  };

  return (
    <div>
      <Button variant="outline" onClick={exportToExcel}>
        <GetAppIcon /> Export
      </Button>
    </div>
  );
};

export default ExportButton;
