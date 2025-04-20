/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import GetAppIcon from "@mui/icons-material/GetApp";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Slide,
  Box,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import { Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { exportStudentAPI } from "@/api/student/StudentScheduleAgent";

interface ExportButtonProps {
  universityId: string | undefined;
}

export interface StudentTrainingPoint {
  studentId: string;
  phoneNumber: string;
  email: string;
  fullname: string;
  trainingPoint: number;
}

const Transition = (
  props: TransitionProps & { children: React.ReactElement<any, any> }
) => {
  return <Slide direction="up" {...props} />;
};

const ExportButton = ({ universityId }: ExportButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleExport = async () => {
    if (!universityId) {
      toast.error("Missing universityId!");
      return;
    }

    try {
      const response = await exportStudentAPI(universityId, startDate, endDate);

      // ✅ Kiểm tra đầy đủ các tầng
      const rawData: StudentTrainingPoint[] = response?.data || [];

      console.log("Export Data:", rawData);

      if (rawData.length <= 0) {
        toast.error("No data found!");
        return;
      }

      exportToExcel(rawData);
      toast.success("Export thành công!");
      handleCloseDialog();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const exportToExcel = (data: StudentTrainingPoint[]) => {
    try {
      const result: any[] = [];
      const header = [
        "Student ID",
        "Phone Number",
        "Email",
        "Full Name",
        "Training Point",
      ];
      result.push(header);

      data.forEach((item: StudentTrainingPoint) => {
        result.push([
          item.studentId,
          item.phoneNumber,
          item.email,
          item.fullname,
          item.trainingPoint,
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(result);
      const range = XLSX.utils.decode_range(ws["!ref"]!);

      // Set column widths
      const colWidths = [15, 15, 25, 25, 15];
      ws["!cols"] = colWidths.map((width) => ({ width }));

      // Format training point column as number with 2 decimal places
      for (let row = 1; row <= range.e.r; row++) {
        const cell = ws[XLSX.utils.encode_cell({ r: row, c: 4 })];
        if (cell) {
          cell.z = "#,##0.00";
        }
      }

      // Style all cells
      for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
          if (cell) {
            // Base style for all cells
            const cellStyle: any = {
              border: {
                top: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
              },
              alignment: {
                horizontal: col === 4 ? "right" : "left",
                vertical: "center",
                wrapText: true,
              },
              font: { name: "Arial", sz: 11 },
            };

            // Alternate row colors
            if (row > 0 && row % 2 === 0) {
              cellStyle.fill = { fgColor: { rgb: "F2F2F2" } };
            }

            cell.s = cellStyle;
          }
        }
      }

      // Special styling for header row
      for (let col = range.s.c; col <= range.e.c; col++) {
        const headerCell = ws[XLSX.utils.encode_cell({ r: 0, c: col })];
        if (headerCell) {
          headerCell.s = {
            font: {
              bold: true,
              color: { rgb: "FFFFFF" },
              name: "Arial",
              sz: 12,
            },
            fill: {
              patternType: "solid",
              fgColor: { rgb: "4F81BD" },
            },
            alignment: {
              horizontal: "center",
              vertical: "center",
            },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };
        }
      }

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Students");

      const excelFile = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
        cellStyles: true,
      });
      const blob = new Blob([excelFile], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "students-training-point.xlsx");
    } catch (error) {
      console.error("Error generating Excel:", error);
    }
  };

  return (
    <>
      <Button
        variant="custom"
        onClick={handleOpenDialog}
        className="rounded-xl bg-[#4F81BD] hover:bg-[#3b6a9e] text-white px-4 py-2 flex items-center gap-2 transition"
      >
        <GetAppIcon /> Export
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            borderRadius: 16,
            padding: "12px 20px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
            minWidth: 400,
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={1}
        >
          <DialogTitle
            className="flex align-middle gap-2"
            sx={{ fontWeight: "bold" }}
          >
            <Calendar style={{ marginTop: "3px" }} />
            Export training point
          </DialogTitle>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent>
          <div className="flex gap-4">
            <TextField
              label="Start date"
              type="date"
              margin="dense"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ my: 1 }}
            />
            <TextField
              label="End date"
              type="date"
              margin="dense"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ my: 1 }}
            />
          </div>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            className="bg-gray-200 hover:bg-gray-300 text-black rounded-md px-3"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={!startDate || !endDate}
            className="bg-[#4F81BD] hover:bg-[#3b6a9e] text-white rounded-md px-4"
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportButton;
