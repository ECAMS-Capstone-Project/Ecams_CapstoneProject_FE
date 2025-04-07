import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from 'react-hot-toast';
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});
function App() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
