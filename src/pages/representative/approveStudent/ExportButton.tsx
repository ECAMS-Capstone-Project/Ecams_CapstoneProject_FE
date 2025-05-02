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
import StudentRequest from "@/models/StudentRequest";

interface ExportButtonProps {
  universityId: string | undefined;
  data: StudentRequest[];
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

const ExportButton = ({ universityId, data }: ExportButtonProps) => {
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

      if (rawData.length <= 0) {
        toast.error("No data found!");
        return;
      }

      exportToExcel(rawData);
      toast.success("Export successfully!");
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
        disabled={data.length <= 0}
        onClick={handleOpenDialog}
        className=" hover:bg-[#3b6a9e] text-white px-4 py-2 flex items-center gap-2 transition"
      >
        <GetAppIcon /> Export training point
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
            background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={1}
          sx={{
            borderBottom: "1px solid #e0e0e0",
            pb: 1,
          }}
        >
          <DialogTitle
            className="flex align-middle gap-2"
            sx={{
              fontWeight: "bold",
              color: "#2c3e50",
              fontSize: "1.25rem",
              p: 0,
            }}
          >
            <Calendar style={{ marginTop: "3px", color: "#4F81BD" }} />
            Export training point
          </DialogTitle>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              color: "#6c757d",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ py: 3 }}>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <TextField
                label="Start date"
                type="date"
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                  sx: { color: "#4F81BD" },
                }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                sx={{
                  my: 1,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#4F81BD",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4F81BD",
                    },
                  },
                }}
              />
              <TextField
                label="End date"
                type="date"
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                  sx: { color: "#4F81BD" },
                }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                sx={{
                  my: 1,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#4F81BD",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4F81BD",
                    },
                  },
                }}
              />
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Select the date range to export student training points
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button
            onClick={handleCloseDialog}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-2 transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={!startDate || !endDate}
            className="bg-[#4F81BD] hover:bg-[#3b6a9e] text-white rounded-lg px-4 py-2 transition-colors duration-200 shadow-sm"
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportButton;
