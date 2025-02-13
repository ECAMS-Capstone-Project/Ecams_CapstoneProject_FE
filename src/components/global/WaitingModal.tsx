import {

  Backdrop,
} from "@mui/material";
import { Stack } from "@mui/system";
interface WaitingModalProps {
  open: boolean;
  setOpen?: (state: boolean) => void;
}

export default function WaitingModal({ open, setOpen }: WaitingModalProps) {
  const handleClose = () => {
    setOpen?.(false);
  };
  console.log(handleClose);
  return (
    <Backdrop open={open} style={{ zIndex: 1300 }}>
      <div className="bg-white w-full h-full flex items-center justify-center">
        <Stack sx={{ width: "100%", color: "grey.500", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} spacing={3}>
          <l-bouncy speed="1.75" color="#136CB5"></l-bouncy>
        </Stack>
      </div>
    </Backdrop>
  );
}
