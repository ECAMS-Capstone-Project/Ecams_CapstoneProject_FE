import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Backdrop,
} from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { Stack } from "@mui/system";

interface WaitingModalProps {
  open: boolean;
  setOpen?: (state: boolean) => void;
}

export default function WaitingModal({ open, setOpen }: WaitingModalProps) {
  const handleClose = () => {
    setOpen?.(false);
  };

  return (
    <Backdrop open={open} style={{ zIndex: 1300 }}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
        disableEscapeKeyDown
      >
        <DialogTitle id="alert-dialog-title">
          <span className="flex items-center text-indigo-800">
            <AutorenewIcon />
            <span style={{ marginLeft: "10px" }}>Vui lòng chờ xíu</span>
          </span>
          <hr></hr>
        </DialogTitle>
        <DialogContent style={{ width: "100%" }}>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "black" }}
          >
            <Stack sx={{ width: "100%", color: "grey.500" }} spacing={3}>
              <LinearProgress color="success" />
            </Stack>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Backdrop>
  );
}
