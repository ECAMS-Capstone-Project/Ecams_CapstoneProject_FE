import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface Props {
  page: number;
  setPage: (value: number) => void;
  totalPages: number;
}

export default function PageNavigation({ page, setPage, totalPages }: Props) {
  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value); // Cập nhật số trang khi user bấm đổi trang
  };

  return (
    <Stack
      spacing={2}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        color="primary"
      />
    </Stack>
  );
}
